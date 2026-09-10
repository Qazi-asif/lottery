"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCents } from "@/lib/format";

type Settings = {
  commissionRate: number;
  cashingBonusRate: number;
  lowStockThreshold: number;
};

type Referral = {
  id: string;
  referredEmail: string;
  status: string;
  creditCents: number;
};

type TenantProfile = {
  businessName: string;
  ownerName: string;
  ownerPhone: string;
};

export function SettingsManager({
  settings,
  referralCode,
  referrals,
  canRefer,
  tenant,
}: {
  settings: Settings;
  referralCode: string | null;
  referrals: Referral[];
  canRefer: boolean;
  tenant: TenantProfile;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commissionRate: Number(form.get("commissionRate")) / 100,
        cashingBonusRate: Number(form.get("cashingBonusRate")) / 100,
        lowStockThreshold: Number(form.get("lowStockThreshold")),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Could not save settings");
      return;
    }
    setError(null);
    setMessage("Settings saved.");
    router.refresh();
  }

  async function saveTenant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/tenants", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: String(form.get("businessName") ?? ""),
        ownerName: String(form.get("ownerName") ?? ""),
        ownerPhone: String(form.get("ownerPhone") ?? ""),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Could not save business profile");
      return;
    }
    setError(null);
    setMessage("Business profile saved.");
    router.refresh();
  }

  async function refer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(form.get("email") ?? "") }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Could not record referral");
      return;
    }
    setError(null);
    setMessage("Referral recorded. $50 credit when they subscribe.");
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-serif text-h2 font-semibold">Settings</h1>
      <p className="mt-2 text-body text-ink-soft">
        Commission snapshots on new sales use these rates. Existing sales stay as stored.
      </p>
      {error ? <p className="mt-4 text-small text-error">{error}</p> : null}
      {message ? <p className="mt-4 text-small text-success">{message}</p> : null}

      <form onSubmit={saveTenant} className="mt-8 grid max-w-lg gap-4 rounded-lg border border-border bg-bg-secondary p-6">
        <h2 className="font-serif text-h3">Business</h2>
        <label className="text-small text-ink-soft">
          Business name
          <input
            name="businessName"
            required
            defaultValue={tenant.businessName}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2"
          />
        </label>
        <label className="text-small text-ink-soft">
          Owner name
          <input
            name="ownerName"
            required
            defaultValue={tenant.ownerName}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2"
          />
        </label>
        <label className="text-small text-ink-soft">
          Owner phone
          <input
            name="ownerPhone"
            required
            defaultValue={tenant.ownerPhone}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2"
          />
        </label>
        <button type="submit" className="rounded-lg border-2 border-transparent bg-ink px-4 py-2 text-bg hover:border-gold">
          Save profile
        </button>
      </form>

      <form onSubmit={saveSettings} className="mt-8 grid max-w-lg gap-4 rounded-lg border border-border bg-bg-secondary p-6">
        <label className="text-small text-ink-soft">
          Commission %
          <input
            name="commissionRate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            defaultValue={settings.commissionRate * 100}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2"
          />
        </label>
        <label className="text-small text-ink-soft">
          Cashing bonus %
          <input
            name="cashingBonusRate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            defaultValue={settings.cashingBonusRate * 100}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2"
          />
        </label>
        <label className="text-small text-ink-soft">
          Low-stock threshold (tickets)
          <input
            name="lowStockThreshold"
            type="number"
            min="0"
            step="1"
            defaultValue={settings.lowStockThreshold}
            className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2"
          />
        </label>
        <button type="submit" className="rounded-lg border-2 border-transparent bg-ink px-4 py-2 text-bg hover:border-gold">
          Save rates
        </button>
      </form>

      {canRefer ? (
      <section className="mt-10 max-w-lg">
        <h2 className="font-serif text-h3">Referrals</h2>
        <p className="mt-2 text-small text-ink-soft">
          Your code: <span className="text-ink">{referralCode ?? "generating…"}</span>
          . Credit is {formatCents(5000)} when a referred store completes signup.
        </p>
        <form onSubmit={refer} className="mt-4 flex gap-3">
          <input
            name="email"
            type="email"
            required
            placeholder="Retailer email"
            className="flex-1 rounded-lg border border-border bg-bg px-3 py-2"
          />
          <button type="submit" className="rounded-lg border border-ink px-4 py-2">
            Record
          </button>
        </form>
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
          {referrals.map((row) => (
            <li key={row.id} className="flex justify-between px-4 py-3 text-small">
              <span>{row.referredEmail}</span>
              <span className="text-ink-soft">
                {row.status} · {formatCents(row.creditCents)}
              </span>
            </li>
          ))}
        </ul>
      </section>
      ) : null}
    </div>
  );
}
