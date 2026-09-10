"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/marketing/Button";

export default function ForgotPasswordPage() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(form.get("email") ?? "") }),
    });
    setPending(false);
    setDone(true);
  }

  return (
    <div>
      <p className="text-small font-medium uppercase tracking-[0.2em] text-gold">
        Account
      </p>
      <h1 className="mt-3 font-serif text-h2 font-semibold">Reset password</h1>
      <p className="mt-3 text-body text-ink-soft">
        If an account exists, we send a one-time set-password link. We never email a
        password.
      </p>
      {done ? (
        <p className="mt-10 text-body text-success">
          If that email is on file, a reset link is on its way (or in the server log
          during local development).
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <label className="block text-small text-ink-soft">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-body text-ink outline-none focus:border-gold"
            />
          </label>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </div>
  );
}
