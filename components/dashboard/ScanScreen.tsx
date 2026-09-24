"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { DashboardNotice, DashboardPage } from "@/components/dashboard/DashboardPage";
import { formatCents } from "@/lib/format";

type Location = { id: string; name: string };
type ScanResult = {
  gameName: string;
  price: number;
  ticket: { ticketNumber: number; barcodeValue: string };
};

export function ScanScreen({ locations }: { locations: Location[] }) {
  const [locationId, setLocationId] = useState(locations[0]?.id ?? "");
  const [buffer, setBuffer] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [last, setLast] = useState<ScanResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [locationId]);

  async function submitBarcode(barcodeValue: string) {
    const value = barcodeValue.trim();
    if (!value || !locationId) {
      setError("Paste a barcode from the pack, then click Sell ticket.");
      return;
    }
    setError(null);
    setMessage(null);

    const response = await fetch("/api/tickets/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barcodeValue: value, locationId }),
    });
    const data = await response.json();

    if (!response.ok) {
      setLast(null);
      setError(data.error?.message ?? "Scan failed");
      return;
    }

    setLast(data as ScanResult);
    setMessage(
      `${data.gameName} sold for ${formatCents(data.price)}. Remaining tickets and Sales both update.`,
    );
    setBuffer("");
  }

  function onSell(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitBarcode(buffer);
  }

  async function onPayout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Math.round(Number(form.get("amount")) * 100);
    const response = await fetch("/api/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locationId,
        amountPaidCents: amount,
        ticketId: null,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Payout failed");
      return;
    }
    setLast(null);
    setMessage(
      `Prize payout recorded: ${formatCents(amount)}. This is not a sale — inventory does not change.`,
    );
  }

  return (
    <DashboardPage
      title="Scan to sell"
      description="Sell a ticket with the barcode box. Prize payout is only for cashing a winner — it does not reduce inventory."
    >
      <div className="max-w-xl space-y-8">
        <label>
          Location
          <select
            value={locationId}
            onChange={(event) => setLocationId(event.target.value)}
            className="mt-1.5 w-full"
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>

        <form
          onSubmit={onSell}
          className="rounded-lg border border-border bg-sheet px-5 py-5"
        >
          <h2 className="font-display text-base font-semibold">Sell a ticket</h2>
          <p className="mt-1 text-small text-ink-soft">
            Copy a barcode from Inventory → View pack, paste it here, then click
            Sell ticket (or press Enter).
          </p>
          <label className="mt-4 block">
            Barcode
            <input
              ref={inputRef}
              value={buffer}
              onChange={(event) => setBuffer(event.target.value)}
              autoComplete="off"
              className="mt-1.5 w-full font-mono text-lg"
              placeholder="Paste barcode from the pack"
            />
          </label>
          <button
            type="submit"
            className="mt-4 inline-flex h-10 items-center rounded-md bg-ink px-4 text-small font-medium text-paper hover:bg-ink-deep"
          >
            Sell ticket
          </button>
        </form>

        {last ? (
          <div className="rounded-lg border border-border bg-sheet px-5 py-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-success">
              Sold
            </p>
            <p className="mt-2 font-display text-xl font-semibold">{last.gameName}</p>
            <p className="mt-1 text-small text-ink-soft">
              Ticket {last.ticket.ticketNumber} · {formatCents(last.price)}
            </p>
            <p className="mt-2 font-mono text-[10px] text-ink-faint">
              {last.ticket.barcodeValue}
            </p>
          </div>
        ) : null}

        {message ? <DashboardNotice tone="ok">{message}</DashboardNotice> : null}
        {error ? <DashboardNotice>{error}</DashboardNotice> : null}

        <form
          onSubmit={onPayout}
          className="rounded-lg border border-dashed border-border bg-paper-2/40 px-5 py-5"
        >
          <h2 className="font-display text-base font-semibold">
            Prize payout (not a sale)
          </h2>
          <p className="mt-1 text-small text-ink-soft">
            Use this only when you pay a customer for a winning ticket. It does
            not mark a ticket sold and will not appear under Sales.
          </p>
          <label className="mt-4 block">
            Amount paid (dollars)
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              required
              className="mt-1.5 w-full"
            />
          </label>
          <button
            type="submit"
            className="mt-4 inline-flex h-10 items-center rounded-md border border-border bg-sheet px-4 text-small font-medium hover:bg-paper-2"
          >
            Record payout
          </button>
        </form>
      </div>
    </DashboardPage>
  );
}
