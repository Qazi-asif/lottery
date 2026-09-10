# Project Overview — ScratchCrest

> **How to use this blueprint set:** These files are the single source of truth for
> this project. When building with Cursor or any AI coding agent, always reference
> these files first. Never invent table names, field names, endpoint paths, or
> business rules that aren't defined here — if something is missing, add it to the
> relevant file *before* writing code that depends on it. Every other blueprint file
> assumes the entities and terms defined in `02_DATABASE_SCHEMA.md` — do not rename
> them ad hoc in code.

## File index

| File | Purpose |
|---|---|
| `00_OVERVIEW.md` | This file — product vision, roles, glossary |
| `01_ARCHITECTURE.md` | Tech stack, folder structure, system diagram |
| `02_DATABASE_SCHEMA.md` | Full DB schema (source of truth for all table/field names) |
| `03_API_SPEC.md` | REST endpoint contracts |
| `04_AUTH_AND_BILLING.md` | Signup, Stripe, subscription, plan-gating logic |
| `05_FEATURES_ROADMAP.md` | MVP vs Phase 2/3 feature scope |
| `.cursorrules` | Instructions Cursor reads automatically on every request |
| `supabase/README.md` | Supabase project, connection strings, and SQL Editor steps |

## What this product is

A multi-tenant SaaS platform sold to Texas lottery scratch-ticket retailers
(convenience stores, gas stations). Each retailer ("tenant") gets:

1. **Inventory management** — track scratch-ticket packs and individual tickets,
   scan-to-sell via barcode scanner, real-time stock counts.
2. **Sales & commission tracking** — every sale logged, commission and cashing-bonus
   revenue calculated automatically.
3. **In-store digital display** — a TV/LED screen showing available games, prices,
   and (once licensed) official game info, replacing static plastic dispensers.
4. **Multi-location support** — one tenant can operate many store locations under
   one account, with role-based access per location.

This is sold as a subscription SaaS product (marketing site → signup → payment →
dashboard), **not** built as a one-off for a single client. Design every part of the
system multi-tenant from day one — do not hardcode assumptions about a single store
or a single owner.

## Roles (used throughout the schema and API spec)

| Role | Scope | Can do |
|---|---|---|
| `platform_admin` | Cross-tenant | Manage all tenants, plans, billing issues. Internal use only — never exposed to customers. |
| `tenant_owner` | One tenant, all its locations | Full access: billing, add/remove locations, add/remove users, all reports. |
| `location_manager` | One tenant, one or more assigned locations | Manage inventory, view sales/commission reports for their location(s). Cannot change billing. |
| `cashier` | One tenant, one location | Scan-to-sell screen only. Cannot view financial reports or settings. |

## Glossary — use these exact terms in code, comments, and variable names

- **Tenant** — a customer account (a retailer business, which may own multiple stores).
- **Location** — one physical store belonging to a tenant.
- **Game** — a lottery game as defined by Texas Lottery (e.g., "Break the Bank", $2).
  Global reference data, not tenant-specific.
- **Pack** — a physical pack/book of tickets for one game, received at one location.
- **Ticket** — one individual scratch ticket within a pack, uniquely identified by
  game number + pack number + ticket number, encoded in its barcode.
- **Sale** — the event of a ticket being scanned and sold to a customer.
- **Prize payout** — the event of a retailer cashing a winning ticket for a customer.
- **Commission** — revenue the retailer earns on ticket sales (percentage of price).
- **Cashing bonus** — revenue the retailer earns for validating/paying a winning ticket.

## Non-negotiable constraints (see prior legal research for full detail)

- Do **not** hardcode or hard-embed official Texas Lottery trademarked artwork,
  logos, or game images anywhere in the display module unless a licensing flag
  (`tenant.artwork_license_approved = true`) is explicitly set. Default all display
  rendering to plain-text/generic-design mode.
- Never store raw payment card data. All card handling goes through Stripe
  Elements/Checkout — the app never sees a raw card number (see `04_AUTH_AND_BILLING.md`).
