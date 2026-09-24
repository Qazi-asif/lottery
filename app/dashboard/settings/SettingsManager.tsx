"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardNotice, DashboardPage } from "@/components/dashboard/DashboardPage";
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
    <DashboardPage
      title="Settings"
      description="Commission snapshots on new sales use these rates. Existing sales stay as stored."
    >
      {error ? <DashboardNotice>{error}</DashboardNotice> : null}
      {message ? <DashboardNotice tone="ok">{message}</DashboardNotice> : null}

      <form onSubmit={saveTenant} className="grid max-w-lg gap-4 rounded-lg border border-border bg-sheet p-5">
        <h2 className="font-display text-base font-semibold">Business</h2>
        <label>
          Business name
          <input name="businessName" required defaultValue={tenant.businessName} className="mt-1.5 w-full" />
        </label>
        <label>
          Owner name
          <input name="ownerName" required defaultValue={tenant.ownerName} className="mt-1.5 w-full" />
        </label>
        <label>
          Owner phone
          <input name="ownerPhone" required defaultValue={tenant.ownerPhone} className="mt-1.5 w-full" />
        </label>
        <button
          type="submit"
          className="inline-flex h-10 w-fit items-center rounded-md bg-ink px-4 text-small font-medium text-paper hover:bg-ink-deep"
        >
          Save profile
        </button>
      </form>

      <form onSubmit={saveSettings} className="mt-6 grid max-w-lg gap-4 rounded-lg border border-border bg-sheet p-5">
        <h2 className="font-display text-base font-semibold">Rates</h2>
        <label>
          Commission %
          <input
            name="commissionRate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            defaultValue={settings.commissionRate * 100}
            className="mt-1.5 w-full"
          />
        </label>
        <label>
          Cashing bonus %
          <input
            name="cashingBonusRate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            defaultValue={settings.cashingBonusRate * 100}
            className="mt-1.5 w-full"
          />
        </label>
        <label>
          Low-stock threshold (tickets)
          <input
            name="lowStockThreshold"
            type="number"
            min="0"
            step="1"
            defaultValue={settings.lowStockThreshold}
            className="mt-1.5 w-full"
          />
        </label>
        <button
          type="submit"
          className="inline-flex h-10 w-fit items-center rounded-md bg-ink px-4 text-small font-medium text-paper hover:bg-ink-deep"
        >
          Save rates
        </button>
      </form>

      {canRefer ? (
        <section className="mt-6 max-w-lg">
          <h2 className="font-display text-base font-semibold">Referrals</h2>
          <p className="mt-2 text-small text-ink-soft">
            Your code: <span className="font-mono text-ink">{referralCode ?? "generating…"}</span>
            . Credit is {formatCents(5000)} when a referred store completes signup.
          </p>
          <form onSubmit={refer} className="mt-4 flex gap-3">
            <input name="email" type="email" required placeholder="Retailer email" className="flex-1" />
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-md border border-border px-4 text-small font-medium hover:bg-paper-2"
            >
              Record
            </button>
          </form>
          <div className="mt-4 overflow-hidden rounded-lg border border-border bg-sheet">
            <table>
              <thead className="border-b border-border bg-paper-2/60">
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th className="num">Credit</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-b-0">
                    <td>{row.referredEmail}</td>
                    <td>{row.status}</td>
                    <td className="num">{formatCents(row.creditCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </DashboardPage>
  );
}
