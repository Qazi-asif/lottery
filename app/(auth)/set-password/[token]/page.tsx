"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/marketing/Button";

export default function SetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (password !== confirm) {
      setPending(false);
      setError("Passwords do not match");
      return;
    }

    const response = await fetch("/api/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token: params.token, password }),
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(data.error?.message ?? "Unable to set password");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const fieldClass =
    "mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-body text-ink outline-none focus:border-gold";

  return (
    <div>
      <p className="text-small font-medium uppercase tracking-[0.2em] text-gold">
        Account setup
      </p>
      <h1 className="mt-3 font-serif text-h2 font-semibold">Set your password</h1>
      <p className="mt-3 text-body text-ink-soft">
        This one-time link expires in 24 hours and cannot be reused.
      </p>
      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        <label className="block text-small text-ink-soft">
          Password
          <input
            name="password"
            type="password"
            minLength={8}
            required
            className={fieldClass}
          />
        </label>
        <label className="block text-small text-ink-soft">
          Confirm password
          <input
            name="confirm"
            type="password"
            minLength={8}
            required
            className={fieldClass}
          />
        </label>
        {error ? <p className="text-small text-error">{error}</p> : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Saving…" : "Save password and continue"}
        </Button>
      </form>
    </div>
  );
}
