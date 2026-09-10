"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Button } from "@/components/marketing/Button";

function SignupForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "smart";
  const billing = searchParams.get("billing") === "annual" ? "annual" : "monthly";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      businessName: String(form.get("businessName") ?? ""),
      ownerName: String(form.get("ownerName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      storeAddress: String(form.get("storeAddress") ?? ""),
      city: String(form.get("city") ?? ""),
      state: String(form.get("state") ?? "TX"),
      zip: String(form.get("zip") ?? ""),
      referralCode: String(form.get("referralCode") ?? ""),
      plan,
      billing,
    };

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(data.error?.message ?? "Unable to start checkout");
      return;
    }

    window.location.href = data.checkoutUrl;
  }

  const fieldClass =
    "mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-body text-ink outline-none focus:border-gold";

  return (
    <div>
      <p className="text-small font-medium uppercase tracking-[0.2em] text-gold">
        Get started
      </p>
      <h1 className="mt-3 font-serif text-h2 font-semibold">Start your subscription</h1>
      <p className="mt-3 text-body text-ink-soft">
        Choose {plan} ({billing}). You will set a password after payment — we never
        collect one here.
      </p>

      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        {[
          ["businessName", "Business name", "text"],
          ["ownerName", "Owner name", "text"],
          ["email", "Email", "email"],
          ["phone", "Phone", "tel"],
          ["storeAddress", "Store address", "text"],
          ["city", "City", "text"],
          ["state", "State", "text"],
          ["zip", "ZIP", "text"],
          ["referralCode", "Referral code (optional)", "text"],
        ].map(([name, label, type]) => (
          <label key={name} className="block text-small text-ink-soft">
            {label}
            <input
              name={name}
              type={type}
              required={name !== "referralCode"}
              defaultValue={name === "state" ? "TX" : ""}
              className={fieldClass}
            />
          </label>
        ))}

        {error ? <p className="text-small text-error">{error}</p> : null}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Redirecting…" : "Continue to payment"}
        </Button>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
