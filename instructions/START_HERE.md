# START HERE — Copy-Paste This Into Cursor

> Instructions for you (not for Cursor): open the `lottery` folder in Cursor.
> Confirm `.cursorrules` sits at the folder ROOT (`lottery/.cursorrules`), not
> inside `instructions/` — Cursor only auto-reads it from the root. Then open a
> new Cursor Chat (Cmd/Ctrl+L) and paste everything in the box below as your
> first message.

---

**COPY FROM HERE:**

```
Read every file in /instructions/ before writing any code:
00_OVERVIEW.md, 01_ARCHITECTURE.md, 02_DATABASE_SCHEMA.md, 03_API_SPEC.md,
04_AUTH_AND_BILLING.md, 05_FEATURES_ROADMAP.md, 06_DESIGN_SYSTEM.md.

These files are the single source of truth for this project — a multi-tenant
SaaS called ScratchCrest for Texas lottery scratch-ticket retailers. Do not
invent table names, field names, API routes, roles, or business rules that
aren't defined in these files. If something is genuinely missing from the
spec, stop and ask me rather than guessing.

Build in this order, and confirm each step works before moving to the next —
I want to review and run the app locally after each stage, not receive the
whole thing at once:

STAGE 1 — Project scaffold
- Initialize a Next.js 15 (App Router) + TypeScript project with Tailwind CSS.
- Set up Prisma with a local PostgreSQL connection (I'll provide DATABASE_URL).
- Create prisma/schema.prisma matching instructions/02_DATABASE_SCHEMA.md exactly.
- Apply the Tailwind color/typography config from instructions/06_DESIGN_SYSTEM.md.
- Run the migration and confirm the database tables are created correctly.
- Stop here and let me review before continuing.

STAGE 2 — Marketing site
- Build the public marketing site per instructions/01_ARCHITECTURE.md folder
  structure: home page, /pricing (pulling plan data from the `plans` table),
  /features.
- Apply instructions/06_DESIGN_SYSTEM.md fully — this needs to look premium,
  not like a default Tailwind template. Use the serif/sans font pairing, the
  gold-as-accent-only rule, generous whitespace.
- Seed the `plans` table with the four tiers (Lite/Essential/Smart/Premium)
  so the pricing page has real data to render.
- Stop here and let me review before continuing.

STAGE 3 — Auth & billing
- Implement the signup form → Stripe Checkout flow exactly as described in
  instructions/04_AUTH_AND_BILLING.md, including the metadata pass-through.
- Implement /api/webhooks/stripe per instructions/03_API_SPEC.md.
- Implement the set-password token flow — do NOT implement plaintext password
  emailing under any circumstances, even if it seems simpler.
- Use Stripe TEST MODE keys for now (I'll provide them).
- Stop here and let me review before continuing.

STAGE 4 — Dashboard shell & roles
- Build the authenticated /dashboard layout with role-based sidebar nav per
  the four roles in instructions/00_OVERVIEW.md.
- Implement lib/permissions.ts as the single shared tenant/role-check helper
  described in instructions/01_ARCHITECTURE.md — every dashboard API route
  must use it, not reimplement its own check.
- Stop here and let me review before continuing.

STAGE 5 — Inventory & scan-to-sell
- Implement locations, games (seed with 5-10 sample games for testing), packs
  (receive + activate with bulk ticket generation), and the scan-to-sell
  endpoint exactly per instructions/03_API_SPEC.md, including the
  already-sold conflict check.
- Build the cashier-facing scan screen with a barcode keyboard-wedge listener.
- Stop here and let me review before continuing.

STAGE 6 — Sales, commission & display
- Build the sales/commission reporting dashboard.
- Build the public /display/[locationId] read-only page in generic/plain-text
  mode (artwork_license_approved defaults false — do not render any placeholder
  official artwork).

After each stage, tell me exactly what you built, what I need to configure
(env vars, Stripe dashboard setup, etc.) to test it myself, and wait for my
confirmation before starting the next stage.
```

**COPY TO HERE.**

---

## Before you paste this, have ready:

- A Supabase project (free tier is fine) and its pooled `DATABASE_URL` plus
  `DIRECT_URL` (see `supabase/README.md` and `.env.example`).
- A Stripe account in **test mode** — test publishable/secret keys from the Stripe
  Dashboard.
- Node.js installed locally (Cursor will tell you if it's missing).

## After Stage 1 completes, sanity-check yourself before moving on:

- [ ] Does `prisma/schema.prisma` actually match `instructions/02_DATABASE_SCHEMA.md`
      field-for-field? Open both side by side once.
- [ ] Did Cursor create any table/field NOT in the spec? If so, either update the
      spec file to match (if it's a good addition) or ask Cursor to remove it —
      don't let undocumented drift accumulate silently.
