# Auth & Billing Flow

## Signup → payment → dashboard, step by step

1. Visitor on marketing site selects a plan on `/pricing` → redirected to `/signup`.
2. `/signup` form collects: business name, owner name, email, phone, store address,
   city, state, zip. **Do not collect a password here.**
3. On submit, `POST /api/signup` creates a Stripe Checkout Session with:
   - `mode: 'subscription'`
   - `line_items`: the selected plan's `stripe_price_id_monthly` or `_annual`
   - `customer_email`: from the form
   - `metadata`: the full form data (businessName, ownerName, phone, address, etc.) —
     this is how the webhook has everything it needs to create the tenant later
   - `payment_method_types`: `['card']` — Google Pay and Apple Pay are automatically
     offered by Stripe Checkout when enabled in the Stripe Dashboard, no extra code
   - PayPal: enable as an additional payment method type in Stripe Dashboard settings
     (Stripe supports PayPal natively as of recent API versions) rather than
     integrating PayPal's SDK separately
4. User is redirected to Stripe's hosted Checkout page — **card data never touches
   our servers.**
5. On success, Stripe redirects to `/signup/success` and fires a
   `checkout.session.completed` webhook asynchronously.
6. `POST /api/webhooks/stripe` handles the event (see `03_API_SPEC.md`):
   creates `tenants`, `subscriptions`, and the `tenant_owner` `users` row, then
   sends a **"Set up your account" email** containing a link to
   `/set-password/[token]`, NOT a plaintext password.
7. User clicks the link, sets a password on `/set-password/[token]`, gets logged in,
   lands on `/dashboard`.

## Why no plaintext temporary password

A password emailed in plaintext sits in the inbox indefinitely and is a real
security liability. The token-link pattern (same mechanism as a password reset)
achieves the identical one-email UX the client asked for, without the risk. This
is a fixed decision — do not change it back to emailing a generated password.

## Password-set token rules

- Token: random 32-byte value, stored hashed in `users.password_set_token`.
- Expiry: 24 hours, stored in `users.password_set_token_expires`.
- Single use: cleared immediately after successful password set.
- Same mechanism reused for "forgot password" and for inviting sub-users
  (`location_manager`, `cashier`) — one implementation, multiple entry points.

## Plan gating

- `plans.features` is a JSON object of feature flags, e.g.
  `{"inventory": true, "display": true, "multi_location": false, "commission_reports": true}`.
- On every dashboard route/component that gates a feature, check
  `session.tenant.subscription.plan.features.<flag>` — do not hardcode plan names
  ("if plan === 'Smart'") anywhere in UI logic. Always check the feature flag, so
  changing what a plan includes is a database edit, not a code change (this is what
  "plan can be updated from the backend" means in practice).
- If a subscription's `status` is `past_due` or `canceled`, restrict the dashboard to
  a billing-only view with a "reactivate" call to action — do not hard-lock the
  account out silently.

## Stripe Customer Portal

Use Stripe's hosted Customer Portal (`stripe.billingPortal.sessions.create`) for
plan upgrades/downgrades and payment method updates from the dashboard's Billing
page, rather than building custom UI for this — it's free, handles proration
automatically, and is exactly what `04_AUTH_AND_BILLING` in the architecture doc
assumes exists at `/dashboard/billing`.

## Environment variables (define in `.env`, never commit)

```
DATABASE_URL=          # Supabase transaction pooler (port 6543) + ?pgbouncer=true
DIRECT_URL=            # Supabase session pooler or direct (port 5432), for Prisma migrate
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=   (or Postmark equivalent)
```

See `supabase/README.md` for where to copy each Supabase dashboard value. Do not put the `anon` or `service_role` keys in the client app; Prisma uses the database password only.
