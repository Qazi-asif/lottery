"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-small text-white/70 transition-colors hover:text-gold"
    >
      Sign out
    </button>
  );
}
