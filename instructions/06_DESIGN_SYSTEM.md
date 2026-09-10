# Design System — ScratchCrest

> Applies to the marketing site and the dashboard. The in-store TV display
> (`/display/[locationId]`) uses its own theming system (tenant-customizable per
> `display_configs.theme`) and is NOT bound by this file — that surface is meant to
> be bright and eye-catching for customers, not restrained and premium.

## Brand feel

Premium, trustworthy, understated — closer to a private banking or luxury
SaaS product than a typical convenience-store tech vendor. Retailers are used to
cheap plastic dispensers and clunky terminal software; the brand should visually
signal "this is the professional-grade option."

## Color palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Primary background |
| `--color-bg-secondary` | `#F7F6F3` | Section backgrounds, cards (warm off-white, not cold gray) |
| `--color-ink` | `#0B0B0C` | Primary text, headers, dark sections |
| `--color-ink-soft` | `#3A3A3C` | Secondary/body text |
| `--color-gold` | `#B8912F` | Accent only — CTAs, active states, dividers, icons |
| `--color-gold-soft` | `#D9C48B` | Hover states, subtle highlights, borders |
| `--color-border` | `#E5E3DD` | Hairline borders on white |
| `--color-success` | `#2F6B4F` | Muted green, not neon — sale confirmations |
| `--color-error` | `#8C2F2F` | Muted red — errors, alerts |

**Gold discipline rule:** gold is an accent, not a background color. Never use gold
as a large fill area (buttons can be gold-bordered-on-white or black-with-gold-text,
but avoid solid gold blocks — it reads cheap, not premium, at scale). The premium
feel comes from restraint: mostly white/black with gold used sparingly for
emphasis (CTA buttons, active nav state, icons, dividers, the logo mark).

## Typography

| Role | Font | Notes |
|---|---|---|
| Headings | A refined serif (e.g. "Fraunces" or "Playfair Display" via Google Fonts) | Serif headings are what signal "premium" vs. the generic SaaS sans-serif look everyone else uses |
| Body / UI | A clean grotesque sans (e.g. "Inter" or "Neue Montreal") | Keep dashboard/functional UI legible and fast to scan — don't use the serif in dense data tables |
| Scale | 1.25 modular scale | h1 40px / h2 32px / h3 24px / body 16px / small 14px |

## Spacing & layout

- Generous whitespace — premium brands under-fill, not over-fill. Minimum 24px
  padding on cards, 80–120px vertical rhythm between marketing site sections.
- Max content width 1200px on marketing pages; dashboard uses full-width with a
  fixed 260px sidebar.
- Border radius: 8px on cards/buttons (soft, not sharp; not overly rounded/playful).
- Shadows: near-none. A 1px hairline border (`--color-border`) does more premium
  work than a drop shadow. Reserve shadow for modals/dropdowns only, and keep it
  subtle (`0 4px 24px rgba(0,0,0,0.08)`).

## Components

- **Buttons (primary):** black background, white text, on hover gold border appears
  (`transition: border-color 0.2s`). No large gold fills.
- **Buttons (secondary):** white/transparent background, black border, black text.
- **Nav (marketing site):** white background, black text, gold underline on active/
  hover state only.
- **Dashboard sidebar:** `--color-ink` (near-black) background, white text, gold
  left-border indicator on the active route — this is the one place a darker gold
  presence is appropriate, since it's a persistent UI element, not a page-level fill.
- **Cards:** `--color-bg-secondary`, hairline border, no shadow at rest.
- **Data tables (dashboard):** white background, `--color-border` row dividers,
  gold used only for the sort-active column indicator.
- **Logo mark:** simple geometric mark suggestive of a ticket/seal shape, gold on
  black or black on white — never full-color, never a gradient.

## What to avoid

- Neon or saturated casino-style colors (red/yellow/green flashing) anywhere on the
  marketing site or dashboard — that's the "cheap lottery vendor" look this brand is
  explicitly positioned against. Save vibrant color for the in-store display only,
  where it's a separate, deliberately eye-catching surface.
- Stock photography of scratch tickets/cash/confetti — use clean product screenshots
  and abstract geometric/pattern imagery instead.
- Drop shadows, gradients, glassmorphism — none of these read as "premium" in 2026;
  flat, high-contrast, generously spaced design does.

## Tailwind config seed

```js
// tailwind.config.ts — colors block
colors: {
  bg: '#FFFFFF',
  'bg-secondary': '#F7F6F3',
  ink: '#0B0B0C',
  'ink-soft': '#3A3A3C',
  gold: '#B8912F',
  'gold-soft': '#D9C48B',
  border: '#E5E3DD',
  success: '#2F6B4F',
  error: '#8C2F2F',
}
```
