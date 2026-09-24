/**
 * Shared presentation layer for the in-store display.
 *
 * Both the live TV route (`app/display/[locationId]`) and the marketing preview
 * (`components/marketing/TicketWall`) read from here, so the screenshot a
 * retailer sees on the website is the screen they get in the store.
 *
 * Styling only — no data access, no business rules.
 * See instructions/06_DESIGN_SYSTEM.md.
 */

/** Mirrors the `theme` options offered in components/dashboard/DisplayManager. */
export type DisplayThemeId = "plain" | "night" | "high_contrast";

export function resolveDisplayTheme(value: unknown): DisplayThemeId {
  return value === "night" || value === "high_contrast" ? value : "plain";
}

/**
 * Price-tier faces: the whole ticket is the colour, the way a printed pack
 * reads from across the aisle. Steps match the industry $5 / $10 / $20 / $30+
 * set, plus the $1–$3 games Texas actually sells.
 */
export type PriceTierStyle = {
  face: string;
  faceNight: string;
};

const PRICE_TIERS: { min: number; style: PriceTierStyle }[] = [
  { min: 3000, style: { face: "bg-flag text-white", faceNight: "bg-flag-deep text-white/90" } },
  { min: 2000, style: { face: "bg-navy text-paper", faceNight: "bg-[#122544] text-paper/85" } },
  { min: 1000, style: { face: "bg-money text-white", faceNight: "bg-[#086445] text-white/90" } },
  { min: 500, style: { face: "bg-violet text-paper", faceNight: "bg-[#3d1d5f] text-paper/85" } },
  { min: 300, style: { face: "bg-[#c45a12] text-white", faceNight: "bg-[#8a3f0c] text-white/90" } },
  { min: 200, style: { face: "bg-teal text-white", faceNight: "bg-[#0a5857] text-white/90" } },
  { min: 0, style: { face: "bg-ink text-paper", faceNight: "bg-[#2a241c] text-paper/85" } },
];

export function priceTier(priceCents: number): PriceTierStyle {
  return (
    PRICE_TIERS.find((tier) => priceCents >= tier.min)?.style ??
    PRICE_TIERS[PRICE_TIERS.length - 1].style
  );
}

export function priceFace(priceCents: number, themeId: DisplayThemeId): string {
  if (themeId === "high_contrast") return "bg-ink text-paper";
  const tier = priceTier(priceCents);
  return themeId === "night" ? tier.faceNight : tier.face;
}

export type DisplayThemeStyle = {
  /** Full-bleed paper canvas. */
  shell: string;
  /** Kraft tray the tickets sit in. */
  tray: string;
  /** Dashed rules on header and footer. */
  hairline: string;
  /** Empty-state copy. */
  meta: string;
  /** Smallest labels. */
  label: string;
  /** Live word. */
  live: string;
  /** Live indicator dot. */
  dot: string;
};

export const DISPLAY_THEME_STYLES: Record<DisplayThemeId, DisplayThemeStyle> = {
  plain: {
    shell: "paper-grain bg-paper text-ink",
    tray: "bg-paper-2",
    hairline: "border-rule-strong",
    meta: "text-ink-soft",
    label: "text-ink-faint",
    live: "text-flag",
    dot: "bg-flag",
  },
  night: {
    shell: "paper-grain bg-paper-3 text-ink",
    tray: "bg-[#d8cbb4]",
    hairline: "border-[#c4b08a]",
    meta: "text-ink-soft",
    label: "text-ink-faint",
    live: "text-flag-deep",
    dot: "bg-flag-deep",
  },
  high_contrast: {
    shell: "bg-paper text-ink",
    tray: "bg-sheet",
    hairline: "border-ink/25",
    meta: "text-ink",
    label: "text-ink/70",
    live: "text-ink",
    dot: "bg-ink",
  },
};

export const BADGE_STYLES = {
  new: { label: "NEW" },
  hot: { label: "HOT" },
  ending: { label: "LAST" },
} as const;

export type BadgeKind = keyof typeof BADGE_STYLES;

/**
 * Best-effort read of a top-prize figure out of `games.prizes_remaining_data`.
 *
 * That column is documented in instructions/02_DATABASE_SCHEMA.md only as an
 * "optional cache of publicly published prize-tier data" — it is nullable, has
 * no agreed shape, and the seed does not populate it. So this accepts a couple
 * of plausible key spellings and returns null otherwise; callers must omit the
 * top-prize row rather than render a placeholder. Never invent a value here: it
 * is a number customers make spending decisions on.
 */
export function readTopPrizeCents(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const candidate = record.topPrizeCents ?? record.top_prize_cents;

  return typeof candidate === "number" && Number.isFinite(candidate) && candidate > 0
    ? Math.round(candidate)
    : null;
}
