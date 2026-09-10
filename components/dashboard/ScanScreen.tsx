"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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
    if (!value || !locationId) return;
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
    setMessage(`${data.gameName} sold for ${formatCents(data.price)}`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = buffer;
      setBuffer("");
      void submitBarcode(value);
    }
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
    setMessage(`Prize payout recorded: ${formatCents(amount)}`);
  }

  return (
    <div>
      <h1 className="font-serif text-h2 font-semibold">Scan to sell</h1>
      <p className="mt-2 max-w-xl text-body text-ink-soft">
        USB and Bluetooth scanners type into this field and send Enter. Keep this
        page focused while selling.
      </p>

      <div className="mt-8 max-w-xl space-y-5">
        <label className="block text-small text-ink-soft">
          Location
          <select
            value={locationId}
            onChange={(event) => setLocationId(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-ink"
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-small text-ink-soft">
          Barcode
          <input
            ref={inputRef}
            value={buffer}
            onChange={(event) => setBuffer(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-3 font-sans text-h3 text-ink outline-none focus:border-gold"
            placeholder="Scan ticket"
          />
        </label>

        {last ? (
          <div className="rounded-lg border border-border bg-bg-secondary p-6">
            <p className="text-small uppercase tracking-wide text-success">Sold</p>
            <p className="mt-2 font-serif text-h3">{last.gameName}</p>
            <p className="mt-1 text-body text-ink-soft">
              Ticket {last.ticket.ticketNumber} · {formatCents(last.price)}
            </p>
          </div>
        ) : null}

        {message ? <p className="text-small text-success">{message}</p> : null}
        {error ? <p className="text-small text-error">{error}</p> : null}

        <form
          onSubmit={onPayout}
          className="rounded-lg border border-border bg-bg-secondary p-6"
        >
          <h2 className="font-serif text-h3">Prize payout</h2>
          <label className="mt-4 block text-small text-ink-soft">
            Amount paid (dollars)
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              required
              className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-ink"
            />
          </label>
          <button
            type="submit"
            className="mt-4 rounded-lg border border-ink px-4 py-2 text-small"
          >
            Record payout
          </button>
        </form>
      </div>
    </div>
  );
}
