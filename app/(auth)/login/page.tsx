"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/marketing/Button";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      }),
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(data.error?.message ?? "Unable to sign in");
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
        Sign in
      </p>
      <h1 className="mt-3 font-serif text-h2 font-semibold">Welcome back</h1>
      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        <label className="block text-small text-ink-soft">
          Email
          <input name="email" type="email" required className={fieldClass} />
        </label>
        <label className="block text-small text-ink-soft">
          Password
          <input name="password" type="password" required className={fieldClass} />
        </label>
        {error ? <p className="text-small text-error">{error}</p> : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
        <a href="/forgot-password" className="block text-center text-small text-ink-soft">
          Forgot password
        </a>
      </form>
    </div>
  );
}
