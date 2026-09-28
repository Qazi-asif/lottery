"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { formatCents } from "@/lib/format";

type PackRow = {
  id: string;
  remainingTickets: number;
  game: {
    id: string;
    name: string;
    gameNumber: string;
    priceCents: number;
  };
};

export type GameTile = {
  gameId: string;
  gameNumber: string;
  name: string;
  priceCents: number;
  remaining: number;
};

const PRESETS = [1, 2, 5, 10] as const;

function groupTiles(packs: PackRow[]): GameTile[] {
  const map = new Map<string, GameTile>();
  for (const pack of packs) {
    const current = map.get(pack.game.id);
    if (current) {
      current.remaining += pack.remainingTickets;
      continue;
    }
    map.set(pack.game.id, {
      gameId: pack.game.id,
      gameNumber: pack.game.gameNumber,
      name: pack.game.name,
      priceCents: pack.game.priceCents,
      remaining: pack.remainingTickets,
    });
  }
  return [...map.values()].filter((tile) => tile.remaining > 0);
}

export function QuickSaleGrid({
  locationId,
  onSold,
  onError,
}: {
  locationId: string;
  onSold: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [packs, setPacks] = useState<PackRow[]>([]);
  const [sort, setSort] = useState<"price" | "name">("price");
  const [picked, setPicked] = useState<GameTile | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [busy, setBusy] = useState(false);
  const pausePoll = useRef(false);
  pausePoll.current = Boolean(picked) || busy;

  async function load() {
    if (!locationId) return;
    const response = await fetch(
      `/api/packs?locationId=${encodeURIComponent(locationId)}&status=activated`,
    );
    const data = await response.json();
    if (!response.ok) {
      onError(data.error?.message ?? "Could not load activated packs");
      return;
    }
    setPacks((data.packs ?? []) as PackRow[]);
  }

  useEffect(() => {
    void load();
    const id = window.setInterval(() => {
      if (pausePoll.current) return;
      void load();
    }, 20000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  const tiles = useMemo(() => {
    const rows = groupTiles(packs);
    return rows.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (a.priceCents !== b.priceCents) return a.priceCents - b.priceCents;
      return a.name.localeCompare(b.name);
    });
  }, [packs, sort]);

  function openTile(tile: GameTile) {
    setPicked(tile);
    setQuantity(0);
  }

  function addQty(n: number) {
    if (!picked) return;
    setQuantity((current) => Math.min(picked.remaining, current + n));
  }

  async function confirm(event: FormEvent) {
    event.preventDefault();
    if (!picked || busy) return;
    const qty = Math.floor(quantity);
    if (qty < 1) {
      onError("Enter how many tickets to sell.");
      return;
    }
    if (qty > picked.remaining) {
      onError(`Only ${picked.remaining} left for ${picked.name}.`);
      return;
    }

    setBusy(true);
    onError("");
    const response = await fetch("/api/tickets/quick-sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locationId,
        gameId: picked.gameId,
        quantity: qty,
      }),
    });
    const data = await response.json();
    setBusy(false);

    if (!response.ok) {
      onError(data.error?.message ?? "Sale failed");
      void load();
      return;
    }

    setPicked(null);
    setQuantity(0);
    void load();
    onSold(
      `${data.quantity} × ${data.gameName} sold for ${formatCents(data.totalCents)}. ${data.remaining} left.`,
    );
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold">Games</h2>
          <p className="mt-1 text-small text-ink-soft">
            Tap a game, add quantity, then confirm. Remaining comes from
            activated packs at this store.
          </p>
        </div>
        <div className="inline-flex rounded-md border border-border bg-sheet p-1">
          {(
            [
              ["price", "By price"],
              ["name", "By name"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSort(key)}
              className={`rounded-sm px-3 py-1.5 text-small ${
                sort === key
                  ? "bg-paper-2 font-medium text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tiles.length === 0 ? (
        <p className="mt-5 rounded-lg border border-border bg-sheet px-5 py-8 text-center text-small text-ink-soft">
          No activated packs at this location. Receive and activate a pack in
          Inventory first.
        </p>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {tiles.map((tile) => (
            <li key={tile.gameId}>
              <button
                type="button"
                onClick={() => openTile(tile)}
                className="flex min-h-[8.5rem] w-full flex-col items-start rounded-lg border border-border bg-sheet px-4 py-4 text-left hover:bg-paper-2"
              >
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                  {tile.gameNumber}
                </span>
                <span className="mt-1 font-display text-lg font-semibold leading-tight">
                  {tile.name}
                </span>
                <span className="mt-auto pt-3 font-mono text-xl font-semibold tabular-nums">
                  {formatCents(tile.priceCents)}
                </span>
                <span className="mt-1 text-small text-ink-soft">
                  {tile.remaining} remaining
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {picked ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
          <form
            onSubmit={confirm}
            className="w-full max-w-md rounded-lg border border-border bg-sheet p-5 shadow-modal"
          >
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
              {picked.gameNumber}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold">{picked.name}</h3>
            <p className="mt-1 text-small text-ink-soft">
              {formatCents(picked.priceCents)} each · {picked.remaining} in stock
            </p>

            <div className="mt-5 grid grid-cols-4 gap-2">
              {PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => addQty(n)}
                  className="min-h-12 rounded-md border border-border bg-paper-2 text-base font-semibold hover:bg-paper-3"
                >
                  +{n}
                </button>
              ))}
            </div>

            <label className="mt-4 block">
              Quantity
              <input
                type="number"
                min={0}
                max={picked.remaining}
                value={quantity}
                onChange={(event) =>
                  setQuantity(Number(event.target.value) || 0)
                }
                className="mt-1.5 w-full font-mono text-lg"
              />
            </label>
            <p className="mt-2 font-mono text-small tabular-nums text-ink-soft">
              Total {formatCents(picked.priceCents * Math.max(0, quantity))}
            </p>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setPicked(null)}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-border bg-sheet text-small font-medium hover:bg-paper-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy || quantity < 1}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-ink px-4 text-small font-medium text-paper hover:bg-ink-deep disabled:opacity-60"
              >
                {busy ? "Selling…" : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
