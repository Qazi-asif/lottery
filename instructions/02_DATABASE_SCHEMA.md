# Database Schema — Source of Truth

> This file is the canonical schema. `prisma/schema.prisma` must match it exactly.
> If you need a new field or table while building, add it here FIRST, then update
> Prisma — never the reverse. This prevents Cursor from silently drifting the schema.

## Entity relationship summary

```
Plan ──< Subscription >── Tenant ──< Location ──< Pack ──< Ticket
                              │                       │
                              ├──< User               ├──< Sale
                              ├──< Settings            └──< PrizePayout
                              └──< DisplayConfig
Game ──< Pack   (Game is global reference data, not tenant-owned)
Tenant ──< ShiftReconciliation
Tenant ──< PackTransfer
Tenant ──< Referral
```

## Tables

### `plans` (platform-level, not tenant-scoped)

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| name | text | "Lite", "Essential", "Smart", "Premium" |
| price_monthly_cents | int | |
| price_annual_cents | int | |
| stripe_price_id_monthly | text | |
| stripe_price_id_annual | text | |
| features | jsonb | feature flags this plan unlocks, e.g. `{"inventory": true, "display": true, "multi_location": false}` |
| active | boolean | can be toggled off without deleting |
| created_at | timestamptz | |

### `tenants`

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| business_name | text | |
| owner_name | text | |
| owner_email | text, unique | |
| owner_phone | text | |
| stripe_customer_id | text | |
| artwork_license_approved | boolean, default false | gates official-branding display mode — see `00_OVERVIEW.md` |
| referral_code | text, unique, nullable | shareable code for the $50 referral program |
| created_at | timestamptz | |

### `subscriptions`

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| tenant_id | uuid, FK → tenants.id | |
| plan_id | uuid, FK → plans.id | |
| stripe_subscription_id | text | |
| status | enum: `active`, `past_due`, `canceled`, `trialing` | |
| current_period_end | timestamptz | |
| created_at | timestamptz | |

### `users`

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| tenant_id | uuid, FK → tenants.id | |
| email | text, unique | |
| password_hash | text, nullable | null until they complete the set-password flow |
| name | text | |
| role | enum: `tenant_owner`, `location_manager`, `cashier` | see `00_OVERVIEW.md` for role scope |
| password_set_token | text, nullable | one-time token for initial password set / reset |
| password_set_token_expires | timestamptz, nullable | |
| created_at | timestamptz | |

### `user_locations` (join table — which locations a manager/cashier can access)

| Field | Type | Notes |
|---|---|---|
| user_id | uuid, FK → users.id | |
| location_id | uuid, FK → locations.id | |

`tenant_owner` role implicitly has access to all locations under their tenant —
does not need rows here.

### `locations`

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| tenant_id | uuid, FK → tenants.id | |
| name | text | e.g. "Main St Store" |
| address | text | |
| city | text | |
| state | text | default 'TX' |
| zip | text | |
| active | boolean, default true | |
| created_at | timestamptz | |

### `games` (global reference data — shared across all tenants, not tenant-scoped)

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| game_number | text, unique | official TX Lottery game number |
| name | text | |
| price_cents | int | |
| tickets_per_pack | int | fixed count per game, used to auto-generate ticket rows |
| active | boolean | |
| prizes_remaining_data | jsonb, nullable | optional cache of publicly published prize-tier data |
| official_close_at | timestamptz, nullable | official game closing date; used for overdue-active alerts |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `packs`

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| tenant_id | uuid, FK → tenants.id | |
| location_id | uuid, FK → locations.id | |
| game_id | uuid, FK → games.id | |
| pack_number | text | |
| ticket_count | int | copied from `games.tickets_per_pack` at receive time |
| status | enum: `received`, `activated`, `closed` | `activated` triggers ticket row generation |
| received_at | timestamptz | |
| activated_at | timestamptz, nullable | |
| closed_at | timestamptz, nullable | |

### `tickets`

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| pack_id | uuid, FK → packs.id | |
| ticket_number | int | position within pack, e.g. 001–150 |
| barcode_value | text, unique | derived from game_number + pack_number + ticket_number |
| status | enum: `in_stock`, `sold` | |
| sold_at | timestamptz, nullable | |
| sold_by_user_id | uuid, FK → users.id, nullable | |

### `sales` (denormalized log — do not compute from `tickets` alone; this is the reporting source of truth)

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| tenant_id | uuid, FK → tenants.id | |
| location_id | uuid, FK → locations.id | |
| ticket_id | uuid, FK → tickets.id | |
| game_id | uuid, FK → games.id | |
| price_cents | int | snapshot at time of sale |
| commission_rate | numeric | snapshot of tenant's rate at time of sale |
| commission_earned_cents | int | computed and stored, not recalculated later |
| sold_by_user_id | uuid, FK → users.id | |
| sold_at | timestamptz | |

### `prize_payouts`

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| tenant_id | uuid, FK → tenants.id | |
| location_id | uuid, FK → locations.id | |
| ticket_id | uuid, FK → tickets.id, nullable | nullable because the winning ticket may have been sold elsewhere |
| amount_paid_cents | int | |
| cashing_bonus_rate | numeric | snapshot |
| cashing_bonus_earned_cents | int | |
| paid_by_user_id | uuid, FK → users.id | |
| paid_at | timestamptz | |

### `settings` (tenant-scoped, one row per tenant)

| Field | Type | Notes |
|---|---|---|
| tenant_id | uuid, PK, FK → tenants.id | |
| commission_rate | numeric, default 0.05 | |
| cashing_bonus_rate | numeric, default 0 | |
| low_stock_threshold | int, default 10 | tickets remaining before reorder alert fires |

### `display_configs`

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| location_id | uuid, FK → locations.id | |
| layout | enum: `landscape`, `portrait` | |
| theme | text | theme identifier |
| bin_assignments | jsonb | maps physical bin number → game_id |
| show_winners | boolean, default true | |
| language | text, default 'en' | `en`, `es`, or `bilingual` for in-store display copy |
| updated_at | timestamptz | |

### `shift_reconciliations`

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| tenant_id | uuid, FK → tenants.id | |
| location_id | uuid, FK → locations.id | |
| opened_by_user_id | uuid, FK → users.id | |
| closed_by_user_id | uuid, FK → users.id, nullable | |
| opened_at | timestamptz | |
| closed_at | timestamptz, nullable | |
| expected_cents | int | sales minus prize payouts while the shift was open |
| actual_cents | int, nullable | drawer count entered at close |
| variance_cents | int, nullable | actual minus expected |
| status | enum: `open`, `closed` | at most one `open` shift per location (enforced in API) |

### `pack_transfers`

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| tenant_id | uuid, FK → tenants.id | |
| pack_id | uuid, FK → packs.id | |
| from_location_id | uuid, FK → locations.id | |
| to_location_id | uuid, FK → locations.id | |
| transferred_by_user_id | uuid, FK → users.id | |
| transferred_at | timestamptz | |

Closed packs cannot be transferred. After transfer, `packs.location_id` is the destination.

### `referrals`

| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| tenant_id | uuid, FK → tenants.id | referring tenant |
| referred_email | text | |
| referred_tenant_id | uuid, FK → tenants.id, nullable | set when the referred account is created |
| credit_cents | int, default 5000 | $50 credit recorded in-app (Stripe keys not required) |
| status | enum: `pending`, `completed` | |
| created_at | timestamptz | |

## Naming conventions (apply consistently — do not mix styles)

- Table names: `snake_case`, plural (`tickets`, not `Ticket` or `ticket`).
- All monetary values stored as **integer cents** (`price_cents`), never float dollars.
- All timestamps `timestamptz`, UTC.
- Every tenant-scoped table has a direct `tenant_id` column, even where it could be
  inferred through a join (e.g., `sales.tenant_id` could technically be derived via
  `location_id`) — this is intentional, for query simplicity and to make the
  multi-tenancy filter in `01_ARCHITECTURE.md` a single, consistent `WHERE tenant_id = ?`
  everywhere.
