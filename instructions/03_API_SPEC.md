# API Specification

> All routes under `/api/*` unless noted. All tenant-scoped routes derive `tenant_id`
> from the authenticated session (see `01_ARCHITECTURE.md` multi-tenancy rule) — never
> from the request body or a query parameter. Field names below must match
> `02_DATABASE_SCHEMA.md` exactly.

## Auth & onboarding

### `POST /api/signup`
Public. Creates a lead record before payment.
- Body: `{ businessName, ownerName, email, phone, storeAddress, city, state, zip, referralCode? }`
- Action: stores submission temporarily (or passes through to Stripe Checkout session
  metadata), does **not** create a `tenants` row yet — that happens on webhook confirmation.
- Returns: `{ checkoutUrl }` — a Stripe Checkout session URL to redirect to.

### `POST /api/webhooks/stripe`
Stripe webhook receiver. Verify signature with `STRIPE_WEBHOOK_SECRET` — reject
unsigned requests.
- On `checkout.session.completed`:
  1. Create `tenants` row from session metadata.
  2. Create `subscriptions` row.
  3. Create `users` row with role `tenant_owner`, `password_hash = null`.
  4. Generate `password_set_token`, send welcome email with set-password link.
- On `invoice.payment_failed`: flag subscription `status = past_due`, trigger dunning email.
- On `customer.subscription.deleted`: flag `status = canceled`.

### `POST /api/set-password`
Public (token-gated, not session-gated).
- Body: `{ token, password }`
- Action: validate token + expiry, hash password, clear token fields, log user in.

### `POST /api/login`
- Body: `{ email, password }`
- Returns: session cookie (via NextAuth).

### `POST /api/users/invite`
Auth: `tenant_owner` only.
- Body: `{ email, role, locationIds[] }`
- Action: creates `users` row with token, sends invite email (same set-password flow).

### `GET /api/users`
Auth: `tenant_owner` only. Lists users for the session tenant (no password hashes).

### `POST /api/forgot-password`
Public. Body: `{ email }`. Always returns `{ ok: true }`. If the email exists, issues a set-password token and sends the same token-link email (never a plaintext password).

### `GET /api/tenants`
Auth: `tenant_owner`. Returns the session tenant (including `referralCode`).

### `PATCH /api/tenants`
Auth: `tenant_owner`. Body: `{ businessName?, ownerName?, ownerPhone? }`.

## Locations

### `GET /api/locations`
Auth: any role. Returns locations scoped to caller's tenant (and, for
`location_manager`/`cashier`, filtered to their assigned locations via `user_locations`).

### `POST /api/locations`
Auth: `tenant_owner` only. Body: `{ name, address, city, state, zip }`.

### `PATCH /api/locations/[id]`
Auth: `tenant_owner` only. Body: `{ name?, address?, city?, state?, zip?, active? }`.

## Games (reference data — read-only for tenants)

### `GET /api/games`
Public within dashboard. Returns active games. Query params: `?priceMax=`, `?active=true`.
Tenants never write to this table — it's maintained by platform admins.

## Packs & Inventory

### `POST /api/packs`
Auth: `tenant_owner`, `location_manager`.
- Body: `{ locationId, gameId, packNumber }`
- Action: creates pack row with `status: 'received'`, `ticket_count` copied from `games.tickets_per_pack`.

### `POST /api/packs/[id]/activate`
Auth: `tenant_owner`, `location_manager`.
- Action: sets `status: 'activated'`, `activated_at: now()`, and **bulk-generates**
  `tickets` rows 1..ticket_count with computed `barcode_value` for each. This is the
  "no manual per-ticket entry" mechanism described in the product discussion — do not
  build a UI for entering individual tickets by hand.

### `POST /api/packs/[id]/transfer`
Auth: `tenant_owner`, `location_manager`. Gated by `plan.features.pack_transfer`.
- Body: `{ toLocationId }`
- Action: writes a `pack_transfers` row and updates `packs.location_id`. Rejects closed packs and cross-tenant locations.

### `GET /api/packs?locationId=&status=`
Auth: any role scoped to that location. Returns packs with remaining ticket counts.

## Scan-to-sell

### `POST /api/tickets/scan`
Auth: `cashier` and above.
- Body: `{ barcodeValue, locationId }`
- Action:
  1. Look up `tickets` row by `barcode_value` where the parent pack's `location_id`
     matches (reject cross-location scans).
  2. If `status != 'in_stock'`, return 409 conflict (already sold — prevents double-sell
     race condition; wrap in a DB transaction with row lock).
  3. Set `status: 'sold'`, `sold_at: now()`, `sold_by_user_id`.
  4. Insert a `sales` row with price/commission snapshot from current `settings`.
  5. If pack's remaining `in_stock` count hits 0, set pack `status: 'closed'`.
- Returns: `{ ticket, sale, gameName, price }` for UI confirmation.

### `POST /api/payouts`
Auth: `cashier` and above.
- Body: `{ ticketId (nullable), locationId, amountPaidCents }`
- Action: inserts `prize_payouts` row with commission snapshot from `settings`.

## Reporting

### `GET /api/sales?locationId=&from=&to=&groupBy=`
Auth: `location_manager` and above (not `cashier`).
Returns aggregated sales/commission figures. `groupBy` options: `day`, `week`, `month`,
`game`, `location`.

### `GET /api/inventory/low-stock?locationId=`
Returns packs where `in_stock` ticket count < `settings.low_stock_threshold`.

### `GET /api/alerts`
Auth: `location_manager` and above. Gated by `plan.features.alerts`.
Returns low-stock with 7-day sell-through velocity, games still active past `games.official_close_at`, and per-employee scan counts that are far above the location average for the last 7 days. Does **not** suggest which games are "luckier."

### `GET /api/settings` / `PATCH /api/settings`
Auth: `tenant_owner`. Body: `{ commissionRate?, cashingBonusRate?, lowStockThreshold? }`.

### `GET /api/display-configs?locationId=` / `PUT /api/display-configs`
Auth: `tenant_owner`, `location_manager`. Gated by `display`.
Body: `{ locationId, layout, theme, binAssignments, showWinners, language }`.

### `GET /api/shifts` / `POST /api/shifts` / `POST /api/shifts/[id]/close`
Auth: `location_manager` and above. Gated by `cash_reconciliation`.
Open body: `{ locationId }`. Close body: `{ actualCents }`. Expected drawer = ticket sales minus prize payouts during the open window.

### `GET /api/referrals` / `POST /api/referrals`
Auth: `tenant_owner`. Gated by `referrals`.
POST body: `{ email }`. Records a pending $50 (`5000` cents) referral.

## Display (public, read-only, no auth — rendered on in-store TV)

### `GET /display/[locationId]` (page route, not API)
Server-renders current active games for that location from `packs` (status =
`activated`) joined to `games`, respecting `tenants.artwork_license_approved` to
decide generic vs. licensed-artwork rendering mode. Poll or use a websocket/SSE
connection for live updates when a game sells out.

## Standard error shape (use everywhere)

```json
{ "error": { "code": "STRING_CODE", "message": "human readable" } }
```

Common codes: `UNAUTHORIZED`, `FORBIDDEN_ROLE`, `TENANT_MISMATCH`, `TICKET_ALREADY_SOLD`,
`PACK_NOT_ACTIVATED`, `VALIDATION_ERROR`.
