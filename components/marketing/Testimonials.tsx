import { Reveal } from "@/components/marketing/Reveal";

/**
 * Operational outcomes — not attributed quotes.
 * Replace with signed retailer testimonials (name, store type, location, date)
 * before treating this as social proof.
 */
const OUTCOMES = [
  {
    title: "Easier tracking",
    body: "Keep ticket information organized and easy to review, instead of reconstructing the day from paper.",
    stub: "bg-flag",
    tilt: "-rotate-[0.8deg]",
  },
  {
    title: "Faster decisions",
    body: "See what is moving and what needs attention before the rush — not after a customer asks.",
    stub: "bg-flag",
    tilt: "rotate-[0.5deg]",
  },
  {
    title: "Clearer displays",
    body: "Put relevant ticket information in front of customers so the wall does the explaining.",
    stub: "bg-flag",
    tilt: "-rotate-[0.4deg]",
  },
];

export function Testimonials() {
  return (
    <section className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-marketing px-6">
        <Reveal>
          <p className="flex items-center gap-3">
            <span className="h-0.5 w-6 bg-flag" aria-hidden />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-flag">
              At the counter
            </span>
          </p>
          <h2 className="wonk mt-4 max-w-2xl font-display text-h2 font-semibold tracking-[-0.02em] text-ink">
            Less guesswork. More visibility.
          </h2>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
            These are the operational improvements ScratchCrest is built to
            deliver. Retailer stories with name, store, and date will live here
            once we have permission to publish them.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {OUTCOMES.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <article
                className={`sheet stub lift flex h-full flex-col rounded-lg py-6 pl-5 pr-6 transition-transform hover:rotate-0 ${item.tilt}`}
                style={{ ["--stub" as string]: "1.35rem" }}
              >
                <span
                  className={`absolute left-2.5 top-6 h-10 w-1 rounded-full ${item.stub}`}
                  aria-hidden
                />
                <h3 className="wonk font-display text-[22px] font-semibold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
