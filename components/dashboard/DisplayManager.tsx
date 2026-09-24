"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardNotice, DashboardPage } from "@/components/dashboard/DashboardPage";

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
    <DashboardPage
      title="In-store display"
      description="Theme, language, and bin mapping for the TV screen. Official artwork stays off until licensing is approved."
    >
      {error ? <DashboardNotice>{error}</DashboardNotice> : null}

      <form onSubmit={save} className="space-y-4 rounded-lg border border-border bg-sheet p-5">
        <label>
          Location
          <select name="locationId" defaultValue={selected?.id} className="mt-1.5 w-full">
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 md:grid-cols-3">
          <label>
            Layout
            <select name="layout" defaultValue={selected?.config?.layout ?? "landscape"} className="mt-1.5 w-full">
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </label>
          <label>
            Theme
            <select name="theme" defaultValue={selected?.config?.theme ?? "plain"} className="mt-1.5 w-full">
              <option value="plain">Plain</option>
              <option value="high_contrast">High contrast</option>
              <option value="night">Night</option>
            </select>
          </label>
          <label>
            Language
            <select name="language" defaultValue={selected?.config?.language ?? "en"} className="mt-1.5 w-full">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="bilingual">English / Spanish</option>
            </select>
          </label>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="showWinners" defaultChecked={selected?.config?.showWinners ?? true} />
          Show remaining ticket counts
        </label>
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((bin) => (
            <label key={bin}>
              Bin {bin}
              <select
                name={`bin-${bin}`}
                defaultValue={selected?.config?.binAssignments?.[String(bin)] ?? ""}
                className="mt-1.5 w-full"
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
        <button
          type="submit"
          className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-small font-medium text-paper hover:bg-ink-deep"
        >
          Save display
        </button>
      </form>

      <ul className="mt-8 space-y-3">
        {locations.map((location) => (
          <li
            key={location.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-border bg-sheet px-5 py-4"
          >
            <div className="min-w-0">
              <p className="font-display text-base font-semibold">{location.name}</p>
              <p className="text-small text-ink-soft">
                {location.city}, {location.state}
              </p>
            </div>
            <Link
              href={`/display/${location.id}`}
              target="_blank"
              className="inline-flex h-10 shrink-0 items-center rounded-md border border-border px-4 text-small font-medium hover:bg-paper-2"
            >
              Open display
            </Link>
          </li>
        ))}
      </ul>
    </DashboardPage>
  );
}
