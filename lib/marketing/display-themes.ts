import type { BadgeKind, DisplayThemeId } from "@/lib/display-style";

/**
 * Marketing-only sample content for the in-store display preview.
 *
 * Game names, top prizes, and jackpot figures here are invented. Official Texas
 * Lottery artwork, logos, and game names are never used in marketing, and never
 * in the real display module unless `tenant.artwork_license_approved === true`
 * (see instructions/06_DESIGN_SYSTEM.md).
 */

export type SampleGame = {
  gameNumber: string;
  name: string;
  priceCents: number;
  topPrizeCents: number;
  remaining: number;
  bin?: string;
  badge?: BadgeKind;
};

export const SAMPLE_GAMES: SampleGame[] = [
  { gameNumber: "2418", name: "Lone Star Gold", priceCents: 1000, topPrizeCents: 25_000_000, remaining: 42, bin: "1", badge: "hot" },
  { gameNumber: "2402", name: "Triple Cash Bar", priceCents: 500, topPrizeCents: 10_000_000, remaining: 7, bin: "2", badge: "ending" },
  { gameNumber: "2431", name: "Neon Nights", priceCents: 200, topPrizeCents: 3_000_000, remaining: 118, bin: "3", badge: "new" },
  { gameNumber: "2388", name: "Bluebonnet Bonus", priceCents: 500, topPrizeCents: 7_500_000, remaining: 64, bin: "4" },
  { gameNumber: "2440", name: "Big Rig Riches", priceCents: 2000, topPrizeCents: 100_000_000, remaining: 19, bin: "5", badge: "hot" },
  { gameNumber: "2350", name: "Sunrise Sevens", priceCents: 100, topPrizeCents: 1_000_000, remaining: 203, bin: "6" },
  { gameNumber: "2427", name: "Midnight Multiplier", priceCents: 1000, topPrizeCents: 30_000_000, remaining: 9, bin: "7", badge: "ending" },
  { gameNumber: "2371", name: "Cactus Jackpot", priceCents: 200, topPrizeCents: 2_500_000, remaining: 87, bin: "8" },
  { gameNumber: "2409", name: "Boot Scootin' Bucks", priceCents: 500, topPrizeCents: 5_000_000, remaining: 51, bin: "9", badge: "new" },
  { gameNumber: "2363", name: "Coastal Cash", priceCents: 100, topPrizeCents: 750_000, remaining: 164, bin: "10" },
  { gameNumber: "2445", name: "Pecan Payday", priceCents: 3000, topPrizeCents: 300_000_000, remaining: 12, bin: "11", badge: "hot" },
  { gameNumber: "2415", name: "Rodeo Riches", priceCents: 1000, topPrizeCents: 20_000_000, remaining: 73, bin: "12" },
];

/**
 * Illustrative draw-game figures for the preview ticker only.
 *
 * ScratchCrest has no draw-game data source: there is no jackpot field anywhere
 * in prisma/schema.prisma, so the live board at /display deliberately does not
 * render a jackpot ticker. Wiring one up for real needs an official feed —
 * a store must never show customers a stale or invented jackpot.
 */
export type SampleJackpot = {
  game: string;
  amountCents: number;
  drawLabel: string;
};

export const SAMPLE_JACKPOTS: SampleJackpot[] = [
  { game: "Powerball", amountCents: 41_200_000_000, drawLabel: "Wed" },
  { game: "Mega Millions", amountCents: 28_700_000_000, drawLabel: "Fri" },
];

export type DisplayMode = {
  id: DisplayThemeId;
  name: string;
  blurb: string;
};

/** The three modes actually offered in the dashboard display settings. */
export const DISPLAY_MODES: DisplayMode[] = [
  {
    id: "plain",
    name: "Standard",
    blurb: "Printed tickets on kraft stock. The default for most stores.",
  },
  {
    id: "night",
    name: "Night",
    blurb: "Dimmed for overnight hours so the screen isn't the brightest thing in the store.",
  },
  {
    id: "high_contrast",
    name: "High contrast",
    blurb: "Ink tickets on cream stock for maximum legibility at distance.",
  },
];
