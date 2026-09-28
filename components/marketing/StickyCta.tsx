"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Floating bar rather than a full-bleed strip: it stays out of the way of the
 * page it's sitting on and reads as an object, not a browser chrome bolt-on.
 */
export function StickyCta() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="pointer-events-auto flex w-full max-w-2xl items-center gap-4 rounded-full bg-ink-deep py-2 pl-6 pr-2 ring-1 ring-white/10 shadow-[0_18px_44px_-16px_rgb(0_0_0/0.7)]">
        <p className="hidden min-w-0 flex-1 truncate text-[13.5px] text-ink-soft sm:block">
          <span className="font-medium text-ink">
            Put a smarter ticket wall in the store.
          </span>{" "}
          No hardware kit.
        </p>

        <div className="flex flex-1 items-center gap-2 sm:flex-none">
          <Link
            href="/signup"
            className="flex-1 rounded-full bg-flag px-5 py-2.5 text-center text-[13.5px] font-medium text-white transition-colors hover:bg-flag-deep sm:flex-none"
          >
            Book a demo
          </Link>
          <Link
            href="/pricing"
            className="rounded-full px-4 py-2.5 text-[13.5px] font-medium text-ink-soft transition-colors hover:bg-white/10 hover:text-ink"
          >
            Pricing
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-white/10 hover:text-ink"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M1 1l8 8M9 1L1 9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
