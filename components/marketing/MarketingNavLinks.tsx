"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/marketing/Button";

const links = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

export function MarketingNavLinks() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-end gap-6 md:justify-between md:pl-12">
      <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative py-1 text-[15px] font-medium transition-colors ${
                active ? "text-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              {link.label}
              {/* Vermilion rule grows from the left on hover, sits full-width
                  when the page is current. */}
              <span
                className={`absolute -bottom-0.5 left-0 h-0.5 bg-flag transition-all duration-200 ${
                  active ? "w-full" : "w-0 group-hover:w-full"
                }`}
                aria-hidden
              />
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-1">
        <Link
          href="/login"
          className="hidden rounded-full px-4 py-2 text-[15px] font-medium text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink sm:inline-block"
        >
          Sign in
        </Link>
        {/* Wrapped rather than given `hidden` directly: Button's base class
            already sets inline-flex, which would win over the display utility. */}
        <span className="hidden sm:block">
          <Button href="/signup" className="px-5 py-2.5 text-sm">
            Start free
          </Button>
        </span>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rule-strong text-ink transition-colors hover:bg-ink/[0.06] md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <span aria-hidden className="flex flex-col gap-[3px]">
            <span className="block h-0.5 w-4 rounded-full bg-current" />
            <span className="block h-0.5 w-4 rounded-full bg-current" />
            <span className="block h-0.5 w-4 rounded-full bg-current" />
          </span>
        </button>
      </div>

      {open ? (
        <nav
          className="absolute left-0 right-0 top-full border-b border-rule bg-paper px-6 py-5 shadow-[0_18px_40px_-24px_rgb(58_40_16/0.4)] md:hidden"
          aria-label="Mobile"
        >
          <div className="mx-auto flex max-w-marketing flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-[15px] font-medium text-ink hover:bg-paper-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-[15px] font-medium text-ink hover:bg-paper-2"
            >
              Sign in
            </Link>
            <Button href="/signup" className="mt-3 w-full">
              Start free
            </Button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
