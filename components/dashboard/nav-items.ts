import type { UserRole } from "@prisma/client";
import type { PlanFeatures } from "@/lib/plan-features";

export type NavIcon =
  | "overview"
  | "sell"
  | "inventory"
  | "sales"
  | "alerts"
  | "shifts"
  | "compare"
  | "display"
  | "team"
  | "settings"
  | "billing"
  | "help";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
  roles: UserRole[];
  feature?: keyof PlanFeatures;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "work",
    label: "Work",
    items: [
      { href: "/dashboard", label: "Overview", icon: "overview", roles: ["tenant_owner", "location_manager"] },
      { href: "/dashboard/sell", label: "Sell", icon: "sell", roles: ["tenant_owner", "location_manager", "cashier"] },
      {
        href: "/dashboard/help",
        label: "Help",
        icon: "help",
        roles: ["tenant_owner", "location_manager", "cashier"],
      },
      {
        href: "/dashboard/inventory",
        label: "Inventory",
        icon: "inventory",
        roles: ["tenant_owner", "location_manager"],
        feature: "inventory",
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    items: [
      {
        href: "/dashboard/sales",
        label: "Sales",
        icon: "sales",
        roles: ["tenant_owner", "location_manager"],
        feature: "commission_reports",
      },
      {
        href: "/dashboard/alerts",
        label: "Alerts",
        icon: "alerts",
        roles: ["tenant_owner", "location_manager"],
        feature: "alerts",
      },
      {
        href: "/dashboard/shifts",
        label: "Shifts",
        icon: "shifts",
        roles: ["tenant_owner", "location_manager"],
        feature: "cash_reconciliation",
      },
      {
        href: "/dashboard/compare",
        label: "Compare",
        icon: "compare",
        roles: ["tenant_owner"],
        feature: "multi_location",
      },
    ],
  },
  {
    id: "store",
    label: "Store",
    items: [
      {
        href: "/dashboard/display",
        label: "Display",
        icon: "display",
        roles: ["tenant_owner", "location_manager"],
        feature: "display",
      },
      { href: "/dashboard/team", label: "Team", icon: "team", roles: ["tenant_owner"] },
      { href: "/dashboard/settings", label: "Settings", icon: "settings", roles: ["tenant_owner"] },
      { href: "/dashboard/billing", label: "Billing", icon: "billing", roles: ["tenant_owner"] },
    ],
  },
];

export function isNavActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}

export const ROLE_LABEL: Record<UserRole, string> = {
  tenant_owner: "Owner",
  location_manager: "Manager",
  cashier: "Cashier",
};
