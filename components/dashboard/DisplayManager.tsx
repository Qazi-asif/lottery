"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LocationRow = {
  id: string;
  name: string;
  city: string;
  state: string;
  config: {
    layout: string;
    theme: string;
    showWinners: boolean;
    language: string;
    binAssignments: Record<string, string>;
  } | null;
};

type Game = { id: string; name: string; gameNumber: string };

export function DisplayManager({
  locations,
  games,
}: {
  locations: LocationRow[];
  games: Game[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const selected = locations[0];

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const locationId = String(form.get("locationId") ?? "");
    const bins: Record<string, string> = {};
    for (const [key, value] of form.entries()) {
      if (key.startsWith("bin-") && String(value)) {
        bins[key.replace("bin-", "")] = String(value);
      }
    }
    const response = await fetch("/api/display-configs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locationId,
        layout: String(form.get("layout") ?? "landscape"),
        theme: String(form.get("theme") ?? "plain"),
        language: String(form.get("language") ?? "en"),
        showWinners: form.get("showWinners") === "on",
        binAssignments: bins,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Could not save display");
      return;
    }
    setError(null);
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-serif text-h2 font-semibold">In-store display</h1>
      <p className="mt-2 max-w-2xl text-body text-ink-soft">
        Theme, language, and bin mapping for the TV screen. Official artwork stays
        off until licensing is approved.
      </p>
      {error ? <p className="mt-4 text-small text-error">{error}</p> : null}

      <form onSubmit={save} className="mt-8 space-y-4 rounded-lg border border-border bg-bg-secondary p-6">
        <select name="locationId" defaultValue={selected?.id} className="w-full rounded-lg border border-border bg-bg px-3 py-2">
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
        <div className="grid gap-4 md:grid-cols-3">
          <select name="layout" defaultValue={selected?.config?.layout ?? "landscape"} className="rounded-lg border border-border bg-bg px-3 py-2">
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
          </select>
          <select name="theme" defaultValue={selected?.config?.theme ?? "plain"} className="rounded-lg border border-border bg-bg px-3 py-2">
            <option value="plain">Plain</option>
            <option value="high_contrast">High contrast</option>
            <option value="night">Night</option>
          </select>
          <select name="language" defaultValue={selected?.config?.language ?? "en"} className="rounded-lg border border-border bg-bg px-3 py-2">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="bilingual">English / Spanish</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-small">
          <input type="checkbox" name="showWinners" defaultChecked={selected?.config?.showWinners ?? true} />
          Show winners area
        </label>
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((bin) => (
            <label key={bin} className="block text-small text-ink-soft">
              Bin {bin}
              <select
                name={`bin-${bin}`}
                defaultValue={selected?.config?.binAssignments?.[String(bin)] ?? ""}
                className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2"
              >
                <option value="">Unassigned</option>
                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.gameNumber} · {game.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <button type="submit" className="rounded-lg border-2 border-transparent bg-ink px-4 py-2 text-bg hover:border-gold">
          Save display
        </button>
      </form>

      <ul className="mt-8 space-y-4">
        {locations.map((location) => (
          <li
            key={location.id}
            className="flex items-center justify-between rounded-lg border border-border bg-bg-secondary p-6"
          >
            <div>
              <p className="font-serif text-h3">{location.name}</p>
              <p className="text-small text-ink-soft">
                {location.city}, {location.state}
              </p>
            </div>
            <Link
              href={`/display/${location.id}`}
              target="_blank"
              className="rounded-lg border border-ink px-4 py-2 text-small"
            >
              Open display
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
