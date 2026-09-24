"use client";

import { useState } from "react";

export function BillingPortalButton() {
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setError(null);
    const response = await fetch("/api/billing/portal", { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Unable to open billing portal");
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div>
      <button
        type="button"
        onClick={openPortal}
        className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-small font-medium text-paper hover:bg-ink-deep"
      >
        Manage billing
      </button>
      {error ? <p className="mt-3 text-small text-error">{error}</p> : null}
    </div>
  );
}
