"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type PackRow = {
  id: string;
  packNumber: string;
  status: string;
  ticketCount: number;
  remainingTickets: number;
  game: { name: string; gameNumber: string };
  location: { name: string };
};

type Game = { id: string; name: string; gameNumber: string; ticketsPerPack: number };
type Location = { id: string; name: string };

export function InventoryManager({
  packs,
  games,
  locations,
}: {
  packs: PackRow[];
  games: Game[];
  locations: Location[];
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

  return (
    <div>
      <h1 className="font-serif text-h2 font-semibold">Inventory</h1>
      <p className="mt-2 text-body text-ink-soft">
        Receive a pack, then activate it to generate every ticket barcode at once.
      </p>

      <form
        onSubmit={receivePack}
        className="mt-8 grid gap-4 rounded-lg border border-border bg-bg-secondary p-6 md:grid-cols-4"
      >
        <select name="locationId" required className="rounded-lg border border-border bg-bg px-3 py-2">
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
        <select name="gameId" required className="rounded-lg border border-border bg-bg px-3 py-2">
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.gameNumber} · {game.name}
            </option>
          ))}
        </select>
        <input
          name="packNumber"
          required
          placeholder="Pack number"
          className="rounded-lg border border-border bg-bg px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-lg border-2 border-transparent bg-ink px-4 py-2 text-bg hover:border-gold"
        >
          Receive pack
        </button>
      </form>

      {error ? <p className="mt-4 text-small text-error">{error}</p> : null}

      <div className="mt-10 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left">
          <thead className="border-b border-border bg-bg-secondary">
            <tr>
              {["Pack", "Game", "Location", "Status", "Remaining", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-small font-medium text-ink-soft">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {packs.map((pack) => (
              <tr key={pack.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-4">{pack.packNumber}</td>
                <td className="px-4 py-4">
                  {pack.game.gameNumber} · {pack.game.name}
                </td>
                <td className="px-4 py-4">{pack.location.name}</td>
                <td className="px-4 py-4">{pack.status}</td>
                <td className="px-4 py-4">
                  {pack.status === "received"
                    ? pack.ticketCount
                    : pack.remainingTickets}
                </td>
                <td className="px-4 py-4">
                  {pack.status === "received" ? (
                    <button
                      type="button"
                      onClick={() => activate(pack.id)}
                      className="text-small text-ink underline decoration-gold underline-offset-4"
                    >
                      Activate
                    </button>
                  ) : (
                    <a
                      href={`/dashboard/inventory/packs/${pack.id}`}
                      className="text-small text-ink underline decoration-gold underline-offset-4"
                    >
                      View
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
