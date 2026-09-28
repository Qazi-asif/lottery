"use client";

import { useState } from "react";
import { DashboardNotice, DashboardPage } from "@/components/dashboard/DashboardPage";
import { QuickSaleGrid } from "@/components/dashboard/QuickSaleGrid";

type Location = { id: string; name: string };

export function SellScreen({ locations }: { locations: Location[] }) {
  const [locationId, setLocationId] = useState(locations[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <DashboardPage
      title="Sell"
      description="Tap a game, choose how many, and confirm. Remaining counts come from activated packs."
    >
      <div className="space-y-8">
        <label className="block max-w-xl">
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

        {message ? <DashboardNotice tone="ok">{message}</DashboardNotice> : null}
        {error ? <DashboardNotice>{error}</DashboardNotice> : null}

        {locationId ? (
          <QuickSaleGrid
            locationId={locationId}
            onSold={(text) => {
              setError(null);
              setMessage(text);
            }}
            onError={(text) => {
              if (text) setError(text);
              else setError(null);
            }}
          />
        ) : null}
      </div>
    </DashboardPage>
  );
}
