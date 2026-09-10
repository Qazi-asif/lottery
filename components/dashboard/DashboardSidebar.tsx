"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import type { UserRole } from "@prisma/client";
import type { PlanFeatures } from "@/lib/plan-features";

type NavItem = {
  href: string;
  label: string;
  roles: UserRole[];
  feature?: keyof PlanFeatures;
};

const ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", roles: ["tenant_owner", "location_manager"] },
  { href: "/dashboard/scan", label: "Scan", roles: ["tenant_owner", "location_manager", "cashier"] },
  {
    href: "/dashboard/inventory",
    label: "Inventory",
    roles: ["tenant_owner", "location_manager"],
    feature: "inventory",
  },
  {
    href: "/dashboard/sales",
    label: "Sales",
    roles: ["tenant_owner", "location_manager"],
    feature: "commission_reports",
  },
  {
    href: "/dashboard/display",
    label: "Display",
    roles: ["tenant_owner", "location_manager"],
    feature: "display",
  },
  { href: "/dashboard/team", label: "Team", roles: ["tenant_owner"] },
  { href: "/dashboard/billing", label: "Billing", roles: ["tenant_owner"] },
];

export function DashboardSidebar({
  role,
  features,
  billingRestricted,
  name,
}: {
  role: UserRole;
  features: PlanFeatures;
  billingRestricted: boolean;
  name: string;
}) {
  const pathname = usePathname();
  const items = billingRestricted
    ? ITEMS.filter((item) => item.href === "/dashboard/billing")
    : ITEMS.filter((item) => {
        if (!item.roles.includes(role)) return false;
        if (item.feature && !features[item.feature]) return false;
        return true;
      });

  return (
    <aside className="flex w-[260px] shrink-0 flex-col bg-ink text-bg">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="font-serif text-xl text-bg">ScratchCrest</p>
        <p className="mt-2 text-small text-gold-soft">{name}</p>
      </div>
      <nav className="flex-1 py-4" aria-label="Dashboard">
        {items.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block border-l-2 px-6 py-3 text-body transition-colors ${
                active
                  ? "border-gold bg-white/5 text-bg"
                  : "border-transparent text-white/70 hover:text-bg"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-6">
        <SignOutButton />
      </div>
    </aside>
  );
}
