"use client";

import { signOut } from "next-auth/react";

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      title={compact ? "Sign out" : undefined}
      className={
        compact
          ? "inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-soft hover:bg-paper-2 hover:text-ink"
          : "text-small text-ink-soft transition-colors hover:text-ink"
      }
    >
      {compact ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M6 3H3.5A1.5 1.5 0 0 0 2 4.5v7A1.5 1.5 0 0 0 3.5 13H6M10 11l3-3-3-3M13 8H6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        "Sign out"
      )}
    </button>
  );
}
