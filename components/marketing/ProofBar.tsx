const ITEMS = [
  ["Live ticket information", "Games, prices, and counts on the wall", "bg-flag"],
  ["Clear inventory visibility", "Ticket-level stock at every store", "bg-flag"],
  ["Simple store management", "Touch POS, shifts, and roles", "bg-flag"],
  ["Actionable sales insights", "What moved, what to restock", "bg-flag"],
];

export function ProofBar() {
  return (
    <div className="border-y border-rule bg-paper-2">
      <div className="mx-auto grid max-w-marketing grid-cols-1 gap-y-5 px-6 py-7 sm:grid-cols-2 md:grid-cols-4">
        {ITEMS.map(([label, detail, dot], i) => (
          <div
            key={label}
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
