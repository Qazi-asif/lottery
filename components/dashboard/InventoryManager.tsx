"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardNotice, DashboardPage } from "@/components/dashboard/DashboardPage";

type PackRow = {
  id: string;
  packNumber: string;
  status: string;
  ticketCount: number;
  remainingTickets: number;
  locationId: string;
  game: { name: string; gameNumber: string };
  location: { name: string };
};

type Game = { id: string; name: string; gameNumber: string; ticketsPerPack: number };
type Location = { id: string; name: string };

export function InventoryManager({
  packs,
  games,
  locations,
  canTransfer,
}: {
  packs: PackRow[];
  games: Game[];
  locations: Location[];
  canTransfer: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function receivePack(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/packs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locationId: String(form.get("locationId") ?? ""),
        gameId: String(form.get("gameId") ?? ""),
        packNumber: String(form.get("packNumber") ?? ""),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Could not receive pack");
      return;
    }
    setError(null);
    event.currentTarget.reset();
    router.refresh();
  }

  async function activate(id: string) {
    const response = await fetch(`/api/packs/${id}/activate`, { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Could not activate pack");
      return;
    }
    setError(null);
    router.refresh();
  }

  async function transfer(packId: string, toLocationId: string) {
    const response = await fetch(`/api/packs/${packId}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toLocationId }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Could not transfer pack");
      return;
    }
    setError(null);
    router.refresh();
  }

  return (
    <DashboardPage
      title="Inventory"
      description="Receive a pack, then activate it to generate every ticket barcode at once."
    >
      <form
        onSubmit={receivePack}
        className="grid items-end gap-3 rounded-lg border border-border bg-sheet p-5 md:grid-cols-4"
      >
        <label>
          Location
          <select name="locationId" required className="mt-1.5 w-full">
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Game
          <select name="gameId" required className="mt-1.5 w-full">
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.gameNumber} · {game.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Pack number
          <input
            name="packNumber"
            required
            placeholder="Unique per game"
            className="mt-1.5 w-full"
          />
        </label>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-ink px-4 text-small font-medium text-paper hover:bg-ink-deep"
        >
          Receive pack
        </button>
      </form>

      {error ? <DashboardNotice>{error}</DashboardNotice> : null}

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-sheet">
        <table>
          <thead className="border-b border-border bg-paper-2/60">
            <tr>
              <th>Pack</th>
              <th>Game</th>
              <th>Location</th>
              <th>Status</th>
              <th className="num">Remaining</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {packs.map((pack) => (
              <tr key={pack.id} className="border-b border-border last:border-b-0">
                <td className="font-mono text-small">{pack.packNumber}</td>
                <td>
                  {pack.game.gameNumber} · {pack.game.name}
                </td>
                <td>{pack.location.name}</td>
                <td>{pack.status}</td>
                <td className="num">
                  {pack.status === "received" ? pack.ticketCount : pack.remainingTickets}
                </td>
                <td className="text-right">
                  {pack.status === "received" ? (
                    <button
                      type="button"
                      onClick={() => activate(pack.id)}
                      className="text-small font-medium text-ink underline underline-offset-4"
                    >
                      Activate
                    </button>
                  ) : (
                    <Link
                      href={`/dashboard/inventory/packs/${pack.id}`}
                      prefetch
                      className="text-small font-medium text-ink underline underline-offset-4"
                    >
                      View
                    </Link>
                  )}
                  {canTransfer && pack.status !== "closed" ? (
                    <select
                      className="mt-2 block w-full"
                      defaultValue=""
                      onChange={(event) => {
                        if (event.target.value) {
                          void transfer(pack.id, event.target.value);
                          event.target.value = "";
                        }
                      }}
                    >
                      <option value="">Transfer…</option>
                      {locations
                        .filter((location) => location.id !== pack.locationId)
                        .map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.name}
                          </option>
                        ))}
                    </select>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPage>
  );
}
