import Link from "next/link";
import { Logo } from "@/components/marketing/Logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#display", label: "Displays" },
      { href: "/#reporting", label: "Reporting" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/signup", label: "Book a demo" },
      { href: "/pricing", label: "Pricing" },
      { href: "/login", label: "Sign in" },
    ],
  },
  {
    title: "For retailers",
    links: [
      { href: "/features#display", label: "In-store display" },
      { href: "/features#inventory", label: "Smart POS & inventory" },
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
            <Logo />
            <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
              Smarter visibility for scratch ticket retailers. A live ticket
              board on any TV and a touch-screen smart POS — inventory, sales,
              and commission in one login. No hardware kit.
            </p>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-flag">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p
          className="wonk mt-16 select-none font-display text-[clamp(3rem,11vw,9rem)] font-semibold leading-[0.85] tracking-[-0.04em] text-white/[0.06]"
          aria-hidden
        >
          ScratchCrest
        </p>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-ink-faint">
            © 2026 ScratchCrest. All rights reserved.
          </p>
          <p className="text-[13px] text-ink-faint">
            Built for Texas lottery retailers ·{" "}
            <span className="font-mono tabular-nums">18+</span> only
          </p>
        </div>
      </div>
    </footer>
  );
}
