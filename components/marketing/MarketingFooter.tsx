import Link from "next/link";
import { Logo } from "@/components/marketing/Logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/signup", label: "Start free" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "For retailers",
    links: [
      { href: "/features#display", label: "In-store display" },
      { href: "/features#inventory", label: "Inventory & scan" },
      { href: "/pricing", label: "Plans" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="bg-ink-deep">
      <div className="mx-auto max-w-marketing px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo tone="paper" />
            <p className="mt-5 text-[15px] leading-relaxed text-paper-2/65">
              Inventory, scan-to-sell, commission, and a live in-store display for
              Texas scratch-ticket retailers. No plastic bins, no hardware kit.
            </p>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foil-light">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-paper-2/70 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Oversized wordmark: the sign-off, set in the brand's own voice. */}
        <p
          className="wonk mt-16 select-none font-display text-[clamp(3rem,11vw,9rem)] font-semibold leading-[0.85] tracking-[-0.04em] text-white/[0.06]"
          aria-hidden
        >
          ScratchCrest
        </p>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-paper-2/50">
            © 2026 ScratchCrest. All rights reserved.
          </p>
          <p className="text-[13px] text-paper-2/50">
            Built for Texas lottery retailers ·{" "}
            <span className="font-mono tabular-nums">18+</span> only
          </p>
        </div>
      </div>
    </footer>
  );
}
