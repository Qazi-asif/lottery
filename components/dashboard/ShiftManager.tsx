"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardNotice, DashboardPage } from "@/components/dashboard/DashboardPage";
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
    <DashboardPage
      title="Shift cash"
      description="Expected drawer is ticket sales minus prize payouts while the shift is open."
    >
      {error ? <DashboardNotice>{error}</DashboardNotice> : null}

      <form onSubmit={openShift} className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-sheet p-5">
        <label className="min-w-[12rem] flex-1">
          Location
          <select name="locationId" className="mt-1.5 w-full">
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-small font-medium text-paper hover:bg-ink-deep"
        >
          Open shift
        </button>
      </form>

      {open.map((shift) => (
        <form
          key={shift.id}
          onSubmit={closeShift}
          className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-sheet p-5"
        >
          <input type="hidden" name="shiftId" value={shift.id} />
          <p className="min-w-[12rem] flex-1 text-small">
            Open at {shift.location.name} · {shift.openedBy.name}
          </p>
          <label>
            Actual drawer ($)
            <input
              name="actual"
              type="number"
              min="0"
              step="0.01"
              required
              className="mt-1.5 block"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-10 items-center rounded-md border border-border px-4 text-small font-medium hover:bg-paper-2"
          >
            Close shift
          </button>
        </form>
      ))}

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-sheet">
        <table>
          <thead className="border-b border-border bg-paper-2/60">
            <tr>
              <th>Location</th>
              <th>Status</th>
              <th className="num">Expected</th>
              <th className="num">Actual</th>
              <th className="num">Variance</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id} className="border-b border-border last:border-b-0">
                <td>{shift.location.name}</td>
                <td>{shift.status}</td>
                <td className="num">{formatCents(shift.expectedCents)}</td>
                <td className="num">{shift.actualCents === null ? "—" : formatCents(shift.actualCents)}</td>
                <td className="num">{shift.varianceCents === null ? "—" : formatCents(shift.varianceCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPage>
  );
}
