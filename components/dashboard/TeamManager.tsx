"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
    <div>
      <h1 className="font-serif text-h2 font-semibold">Team & locations</h1>
      <p className="mt-2 text-body text-ink-soft">
        Invites use the same one-time set-password link as signup.
      </p>
      {error ? <p className="mt-4 text-small text-error">{error}</p> : null}
      {message ? <p className="mt-4 text-small text-success">{message}</p> : null}

      <form
        onSubmit={invite}
        className="mt-8 space-y-4 rounded-lg border border-border bg-bg-secondary p-6"
      >
        <h2 className="font-serif text-h3">Invite user</h2>
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2"
        />
        <select name="role" className="w-full rounded-lg border border-border bg-bg px-3 py-2">
          <option value="location_manager">Location manager</option>
          <option value="cashier">Cashier</option>
        </select>
        <fieldset className="space-y-2">
          <legend className="text-small text-ink-soft">Locations</legend>
          {locations.map((location) => (
            <label key={location.id} className="flex items-center gap-2 text-small">
              <input type="checkbox" name="locationIds" value={location.id} />
              {location.name}
            </label>
          ))}
        </fieldset>
        <button
          type="submit"
          className="rounded-lg border-2 border-transparent bg-ink px-4 py-2 text-bg hover:border-gold"
        >
          Send invite
        </button>
      </form>

      <form
        onSubmit={addLocation}
        className="mt-8 grid gap-3 rounded-lg border border-border bg-bg-secondary p-6 md:grid-cols-2"
      >
        <h2 className="font-serif text-h3 md:col-span-2">Add location</h2>
        <input name="name" required placeholder="Name" className="rounded-lg border border-border bg-bg px-3 py-2" />
        <input name="address" required placeholder="Address" className="rounded-lg border border-border bg-bg px-3 py-2" />
        <input name="city" required placeholder="City" className="rounded-lg border border-border bg-bg px-3 py-2" />
        <input name="state" defaultValue="TX" className="rounded-lg border border-border bg-bg px-3 py-2" />
        <input name="zip" required placeholder="ZIP" className="rounded-lg border border-border bg-bg px-3 py-2" />
        <button
          type="submit"
          className="rounded-lg border border-ink px-4 py-2"
        >
          Save location
        </button>
      </form>

      <ul className="mt-8 space-y-4">
        {locations.map((location) => (
          <li
            key={location.id}
            className="rounded-lg border border-border bg-bg-secondary p-6"
          >
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
              <input
                name="name"
                required
                defaultValue={location.name}
                className="rounded-lg border border-border bg-bg px-3 py-2"
              />
              <input
                name="address"
                required
                defaultValue={location.address}
                className="rounded-lg border border-border bg-bg px-3 py-2"
              />
              <input
                name="city"
                required
                defaultValue={location.city}
                className="rounded-lg border border-border bg-bg px-3 py-2"
              />
              <input
                name="state"
                defaultValue={location.state}
                className="rounded-lg border border-border bg-bg px-3 py-2"
              />
              <input
                name="zip"
                required
                defaultValue={location.zip}
                className="rounded-lg border border-border bg-bg px-3 py-2"
              />
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="rounded-lg border-2 border-transparent bg-ink px-4 py-2 text-bg hover:border-gold">
                  Save location
                </button>
                <button
                  type="button"
                  onClick={() => patchLocation(location.id, { active: !location.active })}
                  className="rounded-lg border border-ink px-4 py-2 text-small"
                >
                  {location.active ? "Deactivate" : "Reactivate"}
                </button>
              </div>
            </form>
          </li>
        ))}
      </ul>

      <ul className="mt-8 divide-y divide-border rounded-lg border border-border">
        {members.map((member) => (
          <li key={member.id} className="flex justify-between px-4 py-3 text-body">
            <span>{member.name} · {member.email}</span>
            <span className="text-ink-soft">{member.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
