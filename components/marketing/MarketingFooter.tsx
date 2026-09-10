import Link from "next/link";
import { Logo } from "@/components/marketing/Logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/signup", label: "Get started" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="bg-ink text-bg">
      <div className="mx-auto max-w-marketing px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo inverted />
            <p className="mt-5 text-body leading-relaxed text-white/60">
              The professional operating system for Texas scratch-ticket
              retailers — inventory, scan-to-sell, commission, and in-store
              display.
            </p>
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-small uppercase tracking-[0.16em] text-gold">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body text-white/70 transition-colors hover:text-bg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-white/45">
            © {new Date().getFullYear()} ScratchCrest. All rights reserved.
          </p>
          <p className="text-small text-white/45">Built for Texas lottery retailers.</p>
        </div>
      </div>
    </footer>
  );
}
