"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const ITEMS: FaqItem[] = [
  {
    question: "Where do I start after login?",
    answer:
      "Owners and managers land on Overview. Cashiers go straight to Sell. Add a store in Settings if you do not have one yet, then receive a pack in Inventory, activate it, and sell from the touch grid. Open Display to get the TV URL for that store.",
  },
  {
    question: "How do I sell a ticket?",
    answer:
      "Open Sell. Pick the store if you have more than one. Tap a live game, set quantity (it starts at 0 — Confirm stays off until you choose at least 1), then confirm. The sale is recorded, stock drops, and the in-store TV updates. This is a touch POS, not a barcode scan screen.",
  },
  {
    question: "Why is Confirm disabled?",
    answer:
      "Quantity starts at zero on purpose so a tap does not sell a ticket by accident. Use the presets or type a number of 1 or more, then Confirm.",
  },
  {
    question: "What is the difference between receive and activate?",
    answer:
      "Receive logs that a physical pack arrived at a store. Activate creates every ticket in that pack, puts the game on Sell and on the TV, and starts live counts. You cannot sell from a pack that is only received.",
  },
  {
    question: "Activate failed with a duplicate pack or barcode error.",
    answer:
      "Pack numbers cannot be reused for the same game. If that pack was already activated, receive and activate a new pack number. The error is a 409 conflict, not a crash — pick a different pack number and try again.",
  },
  {
    question: "How do tickets decrease?",
    answer:
      "Only a confirmed sale on Sell reduces in-stock tickets. Prize payouts (cashing a winner) are not sales and do not reduce pack quantity.",
  },
  {
    question: "Where do I see what sold?",
    answer:
      "Sales lists each sale with time, game, pack, store, tickets, price, commission, and who sold it. Filter by store and date. Commission is locked in at sale time.",
  },
  {
    question: "A payout showed up but inventory did not drop.",
    answer:
      "A payout is cashing a winning ticket for a customer. That is not a sale. Use Sell to record tickets leaving the pack. Use payouts only for winners you cash.",
  },
  {
    question: "How do I put the board on the TV?",
    answer:
      "Open Display, copy the store's display URL, and open it in the TV browser (or a stick/laptop on HDMI). Pick mode, language (English and/or Spanish), and landscape or portrait. Counts follow Sell. Official Texas Lottery artwork stays off until artwork licensing is approved on the account.",
  },
  {
    question: "Who can see what?",
    answer:
      "Cashiers only get Sell (and this Help page). Managers get inventory and reports for stores you assign them. Owners get billing, team, every location, and Compare when the plan includes multi-location.",
  },
  {
    question: "How do shifts work?",
    answer:
      "Open a shift when the drawer opens. Close it when you count out. Sales and payouts during the shift are what you reconcile against cash. Gaps show at close, not a week later.",
  },
  {
    question: "What do Alerts mean?",
    answer:
      "Low stock uses your Settings threshold. Overdue games are still active after the official close date. Unusual sell volume flags an employee far above the store average for the last 7 days. Alerts do not tell you which games are \"luckier.\"",
  },
  {
    question: "Can I move a pack to another store?",
    answer:
      "Yes, if your plan includes pack transfer. From Inventory, transfer the pack to the location that needs it. The receiving store then sells it; the TV there will show it after it is activated at that location.",
  },
  {
    question: "How do I add a cashier or manager?",
    answer:
      "Owners use Team to invite people. They set a password from a one-time email link — ScratchCrest never emails a plaintext password. Assign managers the stores they can see.",
  },
  {
    question: "Where do I change plan or card?",
    answer:
      "Billing opens Stripe's customer portal. Cards never touch ScratchCrest. If the subscription is past due or canceled, the dashboard stays on Billing until you reactivate.",
  },
  {
    question: "How does the $50 referral work?",
    answer:
      "Owners find the referral code in Settings (when the plan includes referrals). When another retailer subscribes with it, credit posts to both accounts.",
  },
];

export function DashboardHelp() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-border bg-sheet">
      {ITEMS.map((item, i) => {
        const expanded = open === i;
        return (
          <div
            key={item.question}
            className={i > 0 ? "border-t border-border" : ""}
          >
            <h2>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-display text-[1.05rem] font-semibold tracking-tight text-ink">
                  {item.question}
                </span>
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border text-ink-soft ${
                    expanded ? "bg-paper-2 text-flag" : ""
                  }`}
                  aria-hidden
                >
                  {expanded ? "−" : "+"}
                </span>
              </button>
            </h2>
            {expanded ? (
              <p className="px-5 pb-5 text-small leading-relaxed text-ink-soft">
                {item.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
