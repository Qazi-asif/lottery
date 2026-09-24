# Design System — ScratchCrest

> **Revision note:** this file replaces three earlier directions — the "vivid
> launch" look (electric gradients, radial glow meshes), the flat slate-card
> revision, and the all-dark "retail hardware" revision that followed it.
>
> Every one of those put the marketing site on a dark canvas, and every one of
> them ended up reading as a template: uniform dark boxes, one accent colour,
> no texture, no voice. The brand is now **printed paper and one real screen**.

## Brand feel

ScratchCrest sells software for a business made of paper: pack invoices, ticket
books, receipt tape, shift sheets. So the site is **paper** — warm cream stock,
ink-black type in a serif with actual character, a single loud vermilion, and
gold reserved for money. Texture is real: grain in the stock, halftone dots,
perforation lines, torn receipt edges.

The page walks **bright to dark on purpose**: cream hero, vermilion ticker,
bronze scratch band, cream features, ink display section, cream operations,
ink CTA, near-black footer. The in-store TV board is the same printed-ticket
object as the marketing preview — cream stock, kraft tray, full-bleed faces —
not a second dark product.

The test for any new element: **would a designer have drawn this, or did a
utility-class default produce it?** If the answer is the second one, it goes.

## Two palettes, on purpose

### Paper — marketing site, dashboard, auth

| Token | Hex | Usage |
|---|---|---|
| `--color-paper` | `#FFF8EE` | Page canvas — bright uncoated stock |
| `--color-paper-2` | `#F7EAD4` | Alternating sections, kraft bands |
| `--color-paper-3` | `#ECD9B8` | Recessed wells, table headers |
| `--color-sheet` | `#FFFFFF` | Raised cards — the sheet laid on the stock |
| `--color-ink` | `#191510` | Headlines, figures. Warm near-black, never `#000` |
| `--color-ink-soft` | `#5B5343` | Body copy |
| `--color-ink-faint` | `#8E8471` | Labels, captions, metadata |
| `--color-rule` | `#E8D8B8` | Hairlines |
| `--color-rule-strong` | `#D4BC90` | Perforations, dot screens, dashed tears |
| `--color-flag` | `#F03D14` | **The one loud colour.** Buttons, the ticker, inverted tickets |
| `--color-flag-deep` | `#C42D0A` | Hover on flag fills |
| `--color-foil` | `#C4920A` | Money on paper: top prizes, gold tickets |
| `--color-money` | `#0C8F5E` | Commission, confirmations, healthy stock |
| `--color-navy` | `#1B3A6B` | Ticket hue |
| `--color-violet` | `#5B2C8B` | Ticket hue |
| `--color-teal` | `#0E7C7B` | Ticket hue |
| `--color-bronze` | `#2C2214` | The foil-scratch band |

### Screen — the `/display` TV board

The live board uses the **paper palette**, not a leftover dark POS shell.
`--color-paper` canvas, `--color-paper-2` kraft tray, ticket faces from
`priceFace()` in `lib/display-style.ts`. Night dims the stock and the faces;
high-contrast uses ink tickets on cream. The same helper feeds `TicketWall`,
so the marketing preview cannot drift from the store screen.

`--color-app` / `--color-elevated` remain for ink marketing sections (CTA,
footer) only — they are not the TV.

**Colour rules**

- Vermilion is a **fill or a 2px rule**, never a wash behind body copy, and
  never two loud fills adjacent.
- Gold is an **ink colour on figures** and a hairline on small badges. Never a
  large fill — that reads cheap instantly.
- Green means money that exists (commission, stock on hand). It is not a
  decorative accent.
- No gradient meshes, no radial glows, no gradient-filled text, no coloured
  shadows. Shadows are warm brown-black and soft, because paper sits on paper.

## Texture

Four utilities in `app/globals.css`, all subtle enough that they register as
material rather than decoration:

| Utility | What it is |
|---|---|
| `.paper-grain` | Fractal-noise SVG at 3.5% over the canvas colour. Applied once on the marketing wrapper. |
| `.dots` | 14px halftone dot screen in `--color-rule-strong`. Kraft bands only. |
| `.hatch` | 45° hairline hatch. The ink CTA block only. |
| `.stub` | Ticket perforation: a dashed vertical rule 1.75rem in from the left edge with punched half-circle notches top and bottom. Set `--notch` to whatever colour sits behind the card. |

## Surfaces

| Utility | What it is |
|---|---|
| `.sheet` | White card on stock: warm dual-layer shadow, no border needed. The default container. |
| `.lift` | Hover: `-3px` rise and a deeper shadow over 180ms. Cards that link somewhere get this; static cards do not. |
| `.well` | Recessed: `--color-paper-3` with a soft inset top shadow. Table headers, figure readouts. |
| `.screen` | Ink marketing blocks (CTA, footer). Not the live TV. |
| `.receipt` | Thermal-tape readout: white sheet, dashed rows, `TearEdge` toothed bottom. |

Radius: `rounded-lg` cards, `rounded-sm` chips and stamps, `rounded-full` only on
dots and pills that are genuinely pill-shaped. Never `rounded-2xl`/`3xl`.

## Typography

| Role | Font | Notes |
|---|---|---|
| Display, headlines, game titles | **Fraunces** | `font-display`. Variable, with the `SOFT`, `WONK`, and `opsz` axes loaded |
| UI, body copy | **Inter** | `font-sans` |
| **All numerals** | **JetBrains Mono** | `font-mono tabular-nums` — mandatory |

Fraunces is the voice. It is a high-contrast serif with a **`WONK` axis** that
swaps in angled, slightly irregular terminals — the reason it reads as drawn by
a person. Headlines use `.wonk`, which sets `opsz 120, SOFT 30, WONK 1`.

- Hero: `text-hero` (`clamp(2.75rem, 6.5vw, 5.25rem)`), weight 600, tracking
  `-0.025em`, leading `0.98`. Big and tight — the headline is the art.
- Section headlines: `text-h2`, weight 600, `.wonk`.
- Eyebrows: `font-mono text-[10px] uppercase tracking-[0.2em] text-flag`.
- **`font-mono tabular-nums` is mandatory** on prices, counts, game numbers, top
  prizes, percentages, and anything that updates in place. Where a unit or word
  sits inside a numeric element, mark it `font-sans`.

## Slot architecture (the board)

Two renderings, one language.

**Live TV** (`/display`) and **marketing preview** (`TicketWall`) are the same
object: cream stock, kraft tray, full-bleed price-tier tickets with a dashed
perforation, Fraunces `.wonk` title, and a handwritten `HOT` / `NEW` / `LAST`.
Faces come from `priceFace()` in `lib/display-style.ts`. Night uses a duskier
tray and dimmer faces; high-contrast uses ink tickets. The live board
spotlights one ticket at a time; the preview does the same on sample games.

Live TV keeps `vw`/`vh` type and the landscape/portrait column counts so it
reads at aisle distance. Marketing `TicketWall` sizes columns with
`grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))]`.

Never invent a top prize or jackpot on the live board. Omit the row.

## Marketing component patterns

- **Ticket cards** (pillars, assurances). Cream sheet with a coloured stub, or a
  full-bleed invert in crimson / gold / emerald / navy / violet / teal. Every
  other card inverts. Slight rotation, straightens on hover. This is the page's
  signature — a printed pack, not a UI panel.
- **Ticker crawl** (`Marquee`). Ink strip under the hero, mono uppercase, items
  separated by vermilion diamonds, duplicated track, paused on hover, hidden
  from assistive tech on the duplicate.
- **Scratch-off** (`ScratchCard`). A canvas of silver latex over a gold figure,
  erased by pointer drag with `destination-out`, auto-revealing past 55%
  cleared. Always ships with a real `<button>` reveal alternative — a
  drag-only interaction is not accessible — and auto-reveals under
  `prefers-reduced-motion`.
- **Count-up figures** (`CountUp`). Stat-bar figures only, and only because
  those are explicitly placeholder marketing numbers. **Never** count up a
  figure read off live data: stock counts, commission, or anything on the board.
- **Timeline** (how-it-works). Numbered ink discs on a dashed connector rule
  that draws itself on scroll. Not four boxes in a row.
- **Comparison matrix.** One sheet, hairline-split columns, our column on a
  vermilion top rule with a `--color-flag-wash` tint and gold check discs.
- **Receipt readout** (calculator). `.receipt` with dashed rows, right-aligned
  mono figures, one oversized net figure, and a toothed `TearEdge` bottom.
- **Photo frames.** White sheet with a generous bottom margin like a print, and
  an alternating `±1.5deg` rotation in galleries. Straightened on hover.
- **Range inputs.** Styled globally: 5px track filled to the thumb via a
  `--range-progress` custom property set inline from component state, with a
  round ink thumb and a vermilion fill.

## Dashboard

The authenticated `/dashboard` is a **quiet work surface**, not the marketing
site and not the TV. Same paper tokens, smaller voice:

- Cream canvas, white sheet sidebar, hairline rules. No ticket hues, no wonk,
  no gold fills. Vermilion is only the active-nav icon.
- One page chrome: `DashboardPage` title (Fraunces 1.65rem) + one-line Inter
  description, left-aligned, `max-w-6xl` content.
- Tables: mono uppercase headers, left text, right-aligned `.num` money/counts.
- Nav is a collapsible sheet (`w-60` / `w-[4.5rem]`), grouped Work / Reports /
  Store, persisted in `localStorage`. Role and plan gates stay in `nav-items.ts`.
- Tab changes use `dash-enter` (220ms fade-up). Reduced-motion turns it off.

## Motion

Motion is allowed to be charming here — it was too austere before — but it is
still never decorative on data.

| Animation | Where |
|---|---|
| `fade-up`, `mask-wipe`, `scale-in` | `Reveal` variants, staggered by 60–80ms |
| `draw` | The hand-drawn underline under the hero keyword, and the timeline rule |
| `marquee` | The vermilion ticker crawl, 22s linear |
| `float` | Decorative hero tickets |
| `pop` | Ticket cards arriving on a slight rotate |
| `count-up` | Stat figures on first view |
| `live-pulse` | The live dot |
| `foil` | A slow highlight sweep across gold prize badges |
| `lift` | Card hover |
| `dash-enter` | Dashboard tab change — 220ms fade-up, reduced-motion off |

Everything sits inside `@media (prefers-reduced-motion: reduce)` overrides, and
the scratch canvas, marquee, and count-ups all have static fallbacks.

## TV display layout

The `/display/[locationId]` route must hold up unattended:

- Target 1080p and 4K in both `landscape` and `portrait` (the `layout` field on
  `display_configs`).
- Landscape: `auto-fit` columns at `minmax(max(16rem, 18%), 1fr)` — at most
  five across, stretching to fill when a store has fewer games. Portrait: the
  same idea at `30%` (at most three), inside a `max-w-[1600px]` container.
- Type and padding scale in `vw`/`vh` with `clamp()`. Price floor 1.75rem,
  ceiling 4.25rem.
- Persistent header and footer. The shell is `h-screen overflow-hidden` so
  tickets stretch to fill the leftover tray — a TV must not scroll. An empty
  board still renders both chrome rows.

## Open data gaps

These are design requirements the schema cannot satisfy yet. **Do not fake
them** — every one is a number a customer or retailer would act on.

| Element | Status |
|---|---|
| Top prize | Read best-effort from the nullable `games.prizes_remaining_data` JSON via `readTopPrizeCents()`. That column has no agreed shape and the seed never populates it, so the row is omitted rather than filled with a placeholder. Needs a documented shape (or a dedicated `top_prize_cents` column) in `instructions/02_DATABASE_SCHEMA.md` first. |
| Terminal number | No field exists on `display_configs`. The live board shows `LIVE` with no number; the marketing strip's designation is chrome. Needs a `terminal_label` column if it should be real. |
| Draw-game jackpots | No draw-game data source exists anywhere in the schema. The live board deliberately renders no ticker. Wiring one up needs an official feed — a store must never show a stale or invented jackpot. |

## Still off-limits

- **Official Texas Lottery artwork, logos, or game names** unless
  `tenant.artwork_license_approved === true`. Marketing previews use invented
  game names, top prizes, and jackpot figures. This is a legal constraint and
  outranks any visual preference.
- Claims that scratch outcomes are predictable.
- Unsubstantiated statistics or testimonials — the placeholder stat, quote, and
  scratch-reveal figures must be replaced with verified numbers before launch.
