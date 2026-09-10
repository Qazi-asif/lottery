# Features Roadmap

> Build in this order. Do not start Phase 2 work before Phase 1 is functional
> end-to-end (signup → payment → inventory → scan-to-sell → basic report) — a
> working thin slice beats a wide half-built surface.

## Phase 1 — MVP

- [x] Marketing site: home, pricing (pulled from `plans` table), features page
- [x] Signup form → Stripe Checkout → webhook → password-set email
- [x] Login / dashboard shell with role-based nav
- [x] Locations CRUD (`tenant_owner`)
- [x] Games reference table (seeded by platform admin, read-only to tenants)
- [x] Packs: receive + activate (auto-generates tickets)
- [x] Scan-to-sell screen (`cashier` role) with keyboard-wedge barcode listener
- [x] Sales log + basic commission dashboard (`location_manager`+)
- [x] Generic/plain-text in-store display (`/display/[locationId]`) — no official
      artwork, respects `artwork_license_approved` flag defaulting to false
- [x] User invite flow for `location_manager` / `cashier`
- [x] Stripe Customer Portal link on Billing page

## Phase 2 — Differentiation (beat lotterydisplay.com's gaps)

- [x] Cash reconciliation per shift (expected vs. actual drawer count)
- [x] Low-stock / reorder alerts based on real sell-through velocity
- [x] Per-employee sold/scanned anomaly flags
- [x] Auto-alert when a game is still active past its official closing date
- [x] Multi-location comparison dashboard for `tenant_owner`
- [x] Pack transfer between locations
- [x] Bilingual (English/Spanish) display mode
- [x] Referral program (matches/beats competitor's $50 referral)

## Phase 3 — Scale & platform maturity

- [ ] Official artwork licensing integration (once TDLR permission secured) —
      toggle `artwork_license_approved` per tenant
- [ ] POS system integrations (plug-in mode vs. standalone)
- [ ] Accounting export (QuickBooks-style) for commission reconciliation
- [ ] White-label option for reselling agencies/distributors
- [ ] Offline resilience for scan-to-sell + display during internet outages
- [ ] Platform admin panel (manage all tenants, plans, support)

## Explicitly out of scope (do not build)

- Anything suggesting scratch-ticket outcomes are predictable from past sales —
  no "best odds" gambling-recommendation features. See prior legal research.
- Storing raw payment card numbers anywhere in this codebase.
- Emailing plaintext passwords (see `04_AUTH_AND_BILLING.md`).
