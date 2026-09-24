"use client";

import { useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="sheet divide-y divide-dashed divide-rule-strong overflow-hidden rounded-lg">
      {items.map((item, i) => {
        const expanded = open === i;

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                className="group flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-paper-2/60"
              >
                <span
                  className={`wonk font-display text-[17.5px] font-semibold tracking-tight transition-colors ${
                    expanded ? "text-flag" : "text-ink group-hover:text-flag"
                  }`}
                >
                  {item.question}
                </span>
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-200 ${
                    expanded
                      ? "rotate-45 border-flag bg-flag text-white"
                      : "border-rule-strong text-ink-soft group-hover:border-ink/40"
                  }`}
                  aria-hidden
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1v10M1 6h10"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>

            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 pr-14 text-[15px] leading-relaxed text-ink-soft">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
