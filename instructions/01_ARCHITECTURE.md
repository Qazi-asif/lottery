# Architecture

## Tech stack (fixed — do not substitute without updating this file first)

| Layer | Choice | Why |
|---|---|---|
| Frontend + Backend | **Next.js 15 (App Router), TypeScript** | Single codebase for marketing site, dashboard, and API routes. Good Cursor support. |
| Styling | **Tailwind CSS** | Fast, consistent, no design-system drift. |
| Database | **PostgreSQL on Supabase** | Relational fit is strong (packs/tickets/sales are inherently relational); transactional safety prevents double-selling a ticket across two registers. Hosted on Supabase; the app connects with Prisma (`DATABASE_URL` pooler + `DIRECT_URL` for migrations). |
| ORM | **Prisma** | Schema-as-code — this is what keeps Cursor from hallucinating field names; `schema.prisma` becomes the enforced source of truth alongside `02_DATABASE_SCHEMA.md`. |
| Auth | **NextAuth.js (Auth.js) with credentials + JWT sessions** | Handles session management; password set via signed one-time token link (see `04_AUTH_AND_BILLING.md`), never emailed in plaintext. |
| Payments | **Stripe** (Checkout + Billing + Customer Portal), Google Pay via Stripe, PayPal as secondary payment method | See `04_AUTH_AND_BILLING.md` for full flow. |
| Hosting | **Vercel** (app) + **Supabase** (managed Postgres) | Standard Next.js + Supabase pairing. |
| Barcode scanning | Keyboard-wedge input listener (no SDK) | USB/Bluetooth scanners act as keyboard input ending in Enter — see `03_API_SPEC.md` scan endpoint. |
| Email | **Resend** or **Postmark** | Transactional email (welcome, password-set link, receipts). |

## High-level system diagram (text form)

```
                         ┌─────────────────────────┐
                         │   Marketing Site         │
                         │   (Next.js, public)      │
                         │   /, /pricing, /features │
                         └───────────┬─────────────┘
                                     │ signup
                                     ▼
                         ┌─────────────────────────┐
                         │   Stripe Checkout        │
                         └───────────┬─────────────┘
                                     │ webhook: checkout.session.completed
                                     ▼
                         ┌─────────────────────────┐
                         │   /api/webhooks/stripe   │──► creates Tenant, Subscription,
                         │                          │    tenant_owner User, sends
                         │                          │    password-set email
                         └───────────┬─────────────┘
                                     ▼
                         ┌─────────────────────────┐
                         │   Dashboard (auth'd)     │
                         │   /dashboard/*           │
                         │   - Inventory            │
                         │   - Sales & Commission   │
                         │   - Display Manager      │
                         │   - Team/Users           │
                         │   - Billing              │
                         └───────────┬─────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                 ▼
            ┌───────────────┐ ┌─────────────┐  ┌──────────────┐
            │ Supabase       │ │ Stripe API  │  │ In-store TV  │
            │ Postgres       │ │             │  │ display app  │
            │ (via Prisma)   │ │             │  │              │
            └───────────────┘ └─────────────┘  │ (reads via   │
                                                 │  public/read-│
                                                 │  only API)   │
                                                 └──────────────┘
```

## Folder structure (Next.js App Router)

```
/app
  /(marketing)              # public marketing site
    page.tsx                # home
    pricing/page.tsx
    features/page.tsx
    layout.tsx
  /(auth)
    signup/page.tsx
    set-password/[token]/page.tsx
    login/page.tsx
    forgot-password/page.tsx
  /dashboard
    layout.tsx               # auth guard + role guard lives here
    page.tsx                 # overview
    inventory/
      page.tsx
      packs/[packId]/page.tsx
    sales/page.tsx
    display/page.tsx         # display manager (theme, bin assignment, language)
    team/page.tsx
    billing/page.tsx
    alerts/page.tsx
    shifts/page.tsx
    compare/page.tsx
    settings/page.tsx
  /display                   # PUBLIC read-only route rendered on in-store TV
    [locationId]/page.tsx
  /api
    /webhooks/stripe/route.ts
    /tenants/route.ts
    /locations/route.ts
    /games/route.ts
    /packs/route.ts
    /packs/[id]/activate/route.ts
    /tickets/scan/route.ts
    /sales/route.ts
    /payouts/route.ts
    /users/route.ts
    /users/invite/route.ts
    /forgot-password/route.ts
    /settings/route.ts
    /display-configs/route.ts
    /alerts/route.ts
    /shifts/route.ts
    /shifts/[id]/close/route.ts
    /packs/[id]/transfer/route.ts
    /referrals/route.ts
    /locations/[id]/route.ts

/lib
  prisma.ts                  # Prisma client singleton
  auth.ts                    # NextAuth config
  stripe.ts                  # Stripe client + helpers
  permissions.ts             # role-check helpers, used by every /api route

/prisma
  schema.prisma              # MUST match 02_DATABASE_SCHEMA.md exactly

/supabase
  schema.sql                 # same tables as Prisma, for SQL Editor paste
  README.md                  # dashboard values and connection strings

/components
  /dashboard
  /marketing
  /display
```

## Multi-tenancy rule (apply everywhere)

Every query that touches tenant-scoped data (locations, packs, tickets, sales,
payouts, users) **must** filter by `tenant_id` derived from the authenticated
session — never from a client-supplied parameter. This is the #1 place an AI
coding agent introduces a security bug (trusting a `tenantId` passed in the
request body). Put this check in `lib/permissions.ts` and reuse it, don't
reimplement it per-route.
