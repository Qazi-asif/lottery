"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardNotice, DashboardPage } from "@/components/dashboard/DashboardPage";

type Location = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  active: boolean;
};
type Member = { id: string; email: string; name: string; role: string };

export function TeamManager({
  locations,
  members,
}: {
  locations: Location[];
  members: Member[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const locationIds = form.getAll("locationIds").map(String);
    const response = await fetch("/api/users/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(form.get("email") ?? ""),
        role: String(form.get("role") ?? ""),
        locationIds,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Invite failed");
      setMessage(null);
      return;
    }
    setError(null);
    setMessage("Invite sent. They will receive a set-password link.");
    event.currentTarget.reset();
    router.refresh();
  }

  async function addLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") ?? ""),
        address: String(form.get("address") ?? ""),
        city: String(form.get("city") ?? ""),
        state: String(form.get("state") ?? "TX"),
        zip: String(form.get("zip") ?? ""),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Could not add location");
      return;
    }
    setError(null);
    event.currentTarget.reset();
    router.refresh();
  }

  async function patchLocation(id: string, payload: Record<string, unknown>) {
    const response = await fetch(`/api/locations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.message ?? "Could not update location");
      return;
    }
    setError(null);
    router.refresh();
  }

  return (
    <DashboardPage
      title="Team & locations"
      description="Invites use the same one-time set-password link as signup."
    >
      {error ? <DashboardNotice>{error}</DashboardNotice> : null}
      {message ? <DashboardNotice tone="ok">{message}</DashboardNotice> : null}

      <form onSubmit={invite} className="space-y-4 rounded-lg border border-border bg-sheet p-5">
        <h2 className="font-display text-base font-semibold">Invite user</h2>
        <label>
          Email
          <input name="email" type="email" required placeholder="Email" className="mt-1.5 w-full" />
        </label>
        <label>
          Role
          <select name="role" className="mt-1.5 w-full">
            <option value="location_manager">Location manager</option>
            <option value="cashier">Cashier</option>
          </select>
        </label>
        <fieldset className="space-y-2">
          <legend className="text-small text-ink-soft">Locations</legend>
          {locations.map((location) => (
            <label key={location.id} className="flex items-center gap-2">
              <input type="checkbox" name="locationIds" value={location.id} />
              {location.name}
            </label>
          ))}
        </fieldset>
        <button
          type="submit"
          className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-small font-medium text-paper hover:bg-ink-deep"
        >
          Send invite
        </button>
      </form>

      <form
        onSubmit={addLocation}
        className="mt-6 grid gap-3 rounded-lg border border-border bg-sheet p-5 md:grid-cols-2"
      >
        <h2 className="font-display text-base font-semibold md:col-span-2">Add location</h2>
        <label>
          Name
          <input name="name" required placeholder="Name" className="mt-1.5 w-full" />
        </label>
        <label>
          Address
          <input name="address" required placeholder="Address" className="mt-1.5 w-full" />
        </label>
        <label>
          City
          <input name="city" required placeholder="City" className="mt-1.5 w-full" />
        </label>
        <label>
          State
          <input name="state" defaultValue="TX" className="mt-1.5 w-full" />
        </label>
        <label>
          ZIP
          <input name="zip" required placeholder="ZIP" className="mt-1.5 w-full" />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="inline-flex h-10 items-center rounded-md border border-border px-4 text-small font-medium hover:bg-paper-2"
          >
            Save location
          </button>
        </div>
      </form>

      <ul className="mt-6 space-y-3">
        {locations.map((location) => (
          <li key={location.id} className="rounded-lg border border-border bg-sheet p-5">
            <form
              className="grid gap-3 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                void patchLocation(location.id, {
                  name: String(form.get("name") ?? ""),
                  address: String(form.get("address") ?? ""),
                  city: String(form.get("city") ?? ""),
                  state: String(form.get("state") ?? "TX"),
                  zip: String(form.get("zip") ?? ""),
                });
              }}
            >
              <label>
                Name
                <input name="name" required defaultValue={location.name} className="mt-1.5 w-full" />
              </label>
              <label>
                Address
                <input name="address" required defaultValue={location.address} className="mt-1.5 w-full" />
              </label>
              <label>
                City
                <input name="city" required defaultValue={location.city} className="mt-1.5 w-full" />
              </label>
              <label>
                State
                <input name="state" defaultValue={location.state} className="mt-1.5 w-full" />
              </label>
              <label>
                ZIP
                <input name="zip" required defaultValue={location.zip} className="mt-1.5 w-full" />
              </label>
              <div className="flex flex-wrap items-end gap-3">
                <button
                  type="submit"
                  className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-small font-medium text-paper hover:bg-ink-deep"
                >
                  Save location
                </button>
                <button
                  type="button"
                  onClick={() => patchLocation(location.id, { active: !location.active })}
                  className="inline-flex h-10 items-center rounded-md border border-border px-4 text-small font-medium hover:bg-paper-2"
                >
                  {location.active ? "Deactivate" : "Reactivate"}
                </button>
              </div>
            </form>
          </li>
        ))}
      </ul>

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-sheet">
        <table>
          <thead className="border-b border-border bg-paper-2/60">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-border last:border-b-0">
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td className="text-ink-soft">{member.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPage>
  );
}
