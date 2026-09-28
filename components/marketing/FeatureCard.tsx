/** Which part of the product a card belongs to. Drives a default ticket hue. */
export type FeatureTone = "inventory" | "display" | "operations";

/** Printed lottery-ticket colours — not UI chrome. */
export type TicketHue =
  | "crimson"
  | "gold"
  | "emerald"
  | "navy"
  | "violet"
  | "teal";

const TONE_TO_HUE: Record<FeatureTone, TicketHue> = {
  inventory: "emerald",
  display: "crimson",
  operations: "gold",
};

const HUES: Record<
  TicketHue,
  { stub: string; index: string; invert: string; invertIndex: string }
> = {
  crimson: {
    stub: "bg-flag",
    index: "text-flag",
    invert: "bg-flag text-white",
    invertIndex: "text-white/80",
  },
  gold: {
    stub: "bg-foil",
    index: "text-foil",
    invert: "bg-foil text-ink",
    invertIndex: "text-ink/70",
  },
  emerald: {
    stub: "bg-money",
    index: "text-money",
    invert: "bg-money text-white",
    invertIndex: "text-white/80",
  },
  navy: {
    stub: "bg-navy",
    index: "text-navy",
    invert: "bg-navy text-white",
    invertIndex: "text-white/70",
  },
  violet: {
    stub: "bg-violet",
    index: "text-violet",
    invert: "bg-violet text-white",
    invertIndex: "text-white/70",
  },
  teal: {
    stub: "bg-teal",
    index: "text-teal",
    invert: "bg-teal text-white",
    invertIndex: "text-white/80",
  },
};

type FeatureCardProps = {
  title: string;
  description: string;
  index: string;
  tone?: FeatureTone;
  hue?: TicketHue;
  /** Saturated fill instead of a cream sheet — every other ticket on a wall. */
  invert?: boolean;
  /** Colour sitting behind the card, so the perforation notches punch cleanly. */
  notch?: string;
  tilt?: string;
};

/**
 * A printed ticket, not a UI panel. Cream body with a coloured stub, or a
 * full-bleed invert. The perforation is the same on both.
 */
export function FeatureCard({
  title,
  description,
  index,
  tone = "operations",
  hue,
  invert = false,
  notch = "var(--color-paper)",
  tilt = "",
}: FeatureCardProps) {
  const h = HUES[hue ?? TONE_TO_HUE[tone]];

  return (
    <article
      className={`stub lift flex h-full flex-col rounded-lg py-5 pl-5 pr-6 transition-transform hover:rotate-0 ${
        invert
          ? `stub-light ticket ${h.invert}`
          : "sheet"
      } ${tilt}`}
      style={{ ["--notch" as string]: notch, ["--stub" as string]: "3.25rem" }}
    >
      <div className="flex gap-6">
        <span
          className={`w-6 shrink-0 font-mono text-[13px] font-bold tabular-nums ${
            invert ? h.invertIndex : h.index
          }`}
        >
          {index}
        </span>

        <div className="min-w-0">
          <span
            className={`block h-1 w-8 rounded-full ${invert ? "bg-current/40" : h.stub}`}
            aria-hidden
          />
          <h3
            className={`wonk mt-3 font-display text-[19px] font-semibold leading-snug tracking-tight ${
              invert ? "" : "text-ink"
            }`}
          >
            {title}
          </h3>
          <p
            className={`mt-2 text-[14.5px] leading-relaxed ${
              invert ? "opacity-85" : "text-ink-soft"
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}
