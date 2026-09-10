"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/marketing/Logo";
import { Button } from "@/components/marketing/Button";

const links = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

export function MarketingNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg">
      <div className="mx-auto flex max-w-marketing items-center justify-between px-6 py-5">
        <Logo />

        <nav className="flex items-center gap-8" aria-label="Main">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-1 text-body text-ink transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold after:transition-all after:duration-200 hover:after:w-full ${
                  active ? "after:w-full" : "after:w-0"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="hidden text-body text-ink-soft transition-colors hover:text-ink sm:inline"
          >
            Sign in
          </Link>
          <Button href="/signup" className="px-5 py-2.5 text-small">
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}
