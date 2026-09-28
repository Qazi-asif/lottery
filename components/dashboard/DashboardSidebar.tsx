"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/dashboard/NavIcon";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import {
  NAV_GROUPS,
  ROLE_LABEL,
  isNavActive,
  type NavItem,
} from "@/components/dashboard/nav-items";
import type { UserRole } from "@prisma/client";
import type { PlanFeatures } from "@/lib/plan-features";

export function DashboardSidebar({
  role,
  features,
  billingRestricted,
  name,
  open,
  onToggle,
  onNavigate,
}: {
  role: UserRole;
  features: PlanFeatures;
  billingRestricted: boolean;
  name: string;
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const visible = (item: NavItem) => {
    if (billingRestricted) {
      return item.href === "/dashboard/billing" || item.href === "/dashboard/help";
    }
    if (!item.roles.includes(role)) return false;
    if (item.feature && !features[item.feature]) return false;
    return true;
  };

  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter(visible),
  })).filter((group) => group.items.length > 0);

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-border bg-sheet text-ink transition-[width] duration-200 ease-out ${
        open ? "w-60" : "w-[4.5rem]"
      }`}
    >
      <div
        className={`flex h-14 shrink-0 items-center border-b border-border ${
          open ? "justify-between px-4" : "justify-center px-2"
        }`}
      >
        {open ? (
          <Link href="/dashboard" className="truncate font-display text-[1.05rem] font-semibold tracking-tight">
            ScratchCrest
          </Link>
        ) : (
          <span className="font-display text-base font-semibold" aria-hidden>
            S
          </span>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="hidden h-8 w-8 items-center justify-center rounded-md text-ink-soft hover:bg-paper-2 hover:text-ink lg:inline-flex"
          aria-expanded={open}
          aria-label={open ? "Collapse navigation" : "Open navigation"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d={open ? "M10 3.5 5.5 8 10 12.5" : "M6 3.5 10.5 8 6 12.5"}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Dashboard">
        {groups.map((group) => (
          <div key={group.id} className={open ? "mb-4" : "mb-2"}>
            {open ? (
              <p className="px-2 pb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                {group.label}
              </p>
            ) : null}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch
                      title={open ? undefined : item.label}
                      onClick={onNavigate}
                      className={`flex items-center rounded-md text-small transition-colors duration-150 ${
                        open ? "gap-3 px-2.5 py-2" : "justify-center px-0 py-2.5"
                      } ${
                        active
                          ? "bg-paper-2 font-medium text-ink"
                          : "text-ink-soft hover:bg-paper hover:text-ink"
                      }`}
                    >
                      <span className={active ? "text-flag" : "text-ink-faint"}>
                        <NavIcon name={item.icon} />
                      </span>
                      {open ? <span className="truncate">{item.label}</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div
        className={`shrink-0 border-t border-border ${
          open ? "px-4 py-3" : "px-2 py-3"
        }`}
      >
        {open ? (
          <>
            <p className="truncate text-small font-medium text-ink">{name}</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              {ROLE_LABEL[role]}
            </p>
            <div className="mt-3">
              <SignOutButton />
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <SignOutButton compact />
          </div>
        )}
      </div>
    </aside>
  );
}
