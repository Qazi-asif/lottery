import { Reveal } from "@/components/marketing/Reveal";

const ROWS = [
  {
    label: "How you start",
    them: "Fill a form. Wait for a sales call. Send photos of your boxes.",
    us: "Pick a plan, pay on Stripe, set a password. Scanning today.",
  },
  {
    label: "Hardware",
    them: "Refurbished PC or Fire Stick kit. TV not included. Not refundable.",
    us: "The TV and scanner you already own. No kit, no remote-login box.",
  },
  {
    label: "What the screen does",
    them: "A ticket wall. Inventory and theft tools cost extra or are “coming soon.”",
    us: "Display plus ticket-level inventory, commission, shifts, alerts, and roles.",
  },
  {
    label: "Double-sell protection",
    them: "Sales tracking, if your plan includes it.",
    us: "Every barcode is unique and a locked database row blocks the second scan.",
  },
  {
    label: "Your team",
    them: "Add managers to stores.",
    us: "Owner, location manager, cashier — each sees only their job.",
  },
  {
    label: "Language",
    them: "English-first storefront.",
    us: "English, Spanish, or both on the in-store display.",
  },
];

function Check() {
  return (
    <span
      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-money"
      aria-hidden
    >
      <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
        <path
          d="M1.5 6.5l3 3 6-6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Dash() {
  return (
    <span
      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-rule-strong"
      aria-hidden
    >
      <svg className="h-2.5 w-2.5 text-ink-faint" viewBox="0 0 12 12" fill="none">
        <path d="M2 6h8" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function CompareSection() {
  return (
    <section className="border-y border-rule bg-paper-2 py-20 sm:py-24">
      <div className="mx-auto max-w-marketing px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="flex items-center gap-3">
              <span className="h-0.5 w-6 bg-flag" aria-hidden />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-flag">
                The difference
              </span>
            </p>
            <h2 className="wonk mt-4 font-display text-h2 font-semibold tracking-[-0.02em] text-ink">
              They sell you a television. We run your counter.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
              Digital lottery screens are everywhere now. An operating system for
              packs, tickets, people, and money is not.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="sheet mt-12 overflow-hidden rounded-lg">
            <div className="grid md:grid-cols-[0.8fr_1.1fr_1.1fr]">
              {/* Header. Our column is marked by a vermilion top rule and a wash
                  that continues down every cell beneath it. */}
              <div className="hidden border-b border-rule px-6 py-4 md:block" />
              <div className="hidden border-b border-l border-rule px-6 py-4 md:block">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                  Typical display vendor
                </p>
              </div>
              <div className="hidden border-b border-l border-t-2 border-rule border-t-flag bg-flag-wash px-6 py-4 md:block">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-flag">
                  ScratchCrest
                </p>
              </div>

              {ROWS.map((row) => (
                <div key={row.label} className="contents">
                  <div className="border-t border-rule px-6 py-5 md:border-b md:border-t-0">
                    <p className="wonk font-display text-[16px] font-semibold text-ink">
                      {row.label}
                    </p>
                  </div>

                  <div className="border-rule px-6 pb-4 md:border-b md:border-l md:py-5">
                    <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint md:hidden">
                      Typical vendor
                    </p>
                    <div className="flex gap-3">
                      <Dash />
                      <p className="text-[14.5px] leading-relaxed text-ink-faint">
                        {row.them}
                      </p>
                    </div>
                  </div>

                  <div className="border-rule bg-flag-wash px-6 py-5 md:border-b md:border-l">
                    <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-flag md:hidden">
                      ScratchCrest
                    </p>
                    <div className="flex gap-3">
                      <Check />
                      <p className="text-[14.5px] leading-relaxed text-ink">
                        {row.us}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
