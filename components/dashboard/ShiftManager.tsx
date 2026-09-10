"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCents } from "@/lib/format";

type Location = { id: string; name: string };
type Shift = {
  id: string;
  status: string;
  openedAt: string;
  closedAt: string | null;
  expectedCents: number;
  actualCents: number | null;
  varianceCents: number | null;
  location: { name: string };
  openedBy: { name: string };
};

export function ShiftManager({
  locations,
  shifts,
}: {
  locations: Location[];
  shifts: Shift[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function openShift(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locationId: String(form.get("locationId") ?? "") }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Could not open shift");
      return;
    }
    setError(null);
    router.refresh();
  }

  async function closeShift(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = String(form.get("shiftId") ?? "");
    const dollars = Number(form.get("actual") ?? 0);
    const response = await fetch(`/api/shifts/${id}/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actualCents: Math.round(dollars * 100) }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Could not close shift");
      return;
    }
    setError(null);
    router.refresh();
  }

  const open = shifts.filter((shift) => shift.status === "open");

  return (
    <div>
      <h1 className="font-serif text-h2 font-semibold">Shift cash</h1>
      <p className="mt-2 text-body text-ink-soft">
        Expected drawer is ticket sales minus prize payouts while the shift is open.
      </p>
      {error ? <p className="mt-4 text-small text-error">{error}</p> : null}

      <form onSubmit={openShift} className="mt-8 flex gap-3 rounded-lg border border-border bg-bg-secondary p-6">
        <select name="locationId" className="rounded-lg border border-border bg-bg px-3 py-2">
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg border-2 border-transparent bg-ink px-4 py-2 text-bg hover:border-gold">
          Open shift
        </button>
      </form>

      {open.map((shift) => (
        <form
          key={shift.id}
          onSubmit={closeShift}
          className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-border p-6"
        >
          <input type="hidden" name="shiftId" value={shift.id} />
          <p className="text-body">
            Open at {shift.location.name} · {shift.openedBy.name}
          </p>
          <label className="text-small text-ink-soft">
            Actual drawer ($)
            <input
              name="actual"
              type="number"
              min="0"
              step="0.01"
              required
              className="mt-2 block rounded-lg border border-border bg-bg px-3 py-2"
            />
          </label>
          <button type="submit" className="rounded-lg border border-ink px-4 py-2">
            Close shift
          </button>
        </form>
      ))}

      <div className="mt-10 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left">
          <thead className="border-b border-border bg-bg-secondary">
            <tr>
              {["Location", "Status", "Expected", "Actual", "Variance"].map((h) => (
                <th key={h} className="px-4 py-3 text-small font-medium text-ink-soft">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3">{shift.location.name}</td>
                <td className="px-4 py-3">{shift.status}</td>
                <td className="px-4 py-3">{formatCents(shift.expectedCents)}</td>
                <td className="px-4 py-3">
                  {shift.actualCents === null ? "—" : formatCents(shift.actualCents)}
                </td>
                <td className="px-4 py-3">
                  {shift.varianceCents === null ? "—" : formatCents(shift.varianceCents)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
