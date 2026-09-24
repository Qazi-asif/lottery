const ITEMS = [
  ["No hardware kit", "Use the TV and scanner you own", "bg-foil"],
  ["Live in 20 minutes", "Stripe checkout, no sales call", "bg-flag"],
  ["Ticket-level stock", "The same ticket can't sell twice", "bg-money"],
  ["Texas-ready", "English / Spanish display", "bg-navy"],
];

export function ProofBar() {
  return (
    <div className="border-y border-rule bg-paper-2">
      <div className="mx-auto grid max-w-marketing grid-cols-1 gap-y-5 px-6 py-7 sm:grid-cols-2 md:grid-cols-4">
        {ITEMS.map(([label, detail, dot], i) => (
          <div
            key={label}
            // Dashed cell dividers rather than borders on boxes: the row reads as
            // one printed strip with columns, not four cards.
            className={`flex gap-3 md:pl-6 ${
              i > 0 ? "md:border-l md:border-dashed md:border-rule-strong" : ""
            }`}
          >
            <span
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${dot}`}
              aria-hidden
            >
              <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1.5 6.5l3 3 6-6"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-ink">{label}</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">
                {detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
