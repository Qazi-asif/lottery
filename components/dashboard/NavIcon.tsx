import type { NavIcon as NavIconName } from "@/components/dashboard/nav-items";

const PATH: Record<NavIconName, string> = {
  overview: "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z",
  scan: "M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M4 17v2a1 1 0 0 0 1 1h2M17 20h2a1 1 0 0 0 1-1v-2M8 12h8",
  inventory: "M4 7.5 12 4l8 3.5v9L12 20l-8-3.5zM12 11.5V20M4 7.5l8 4 8-4",
  sales: "M4 16l4-4 3 3 9-9M14 6h6v6",
  alerts: "M12 4a6 6 0 0 1 6 6c0 5 2 6 2 6H4s2-1 2-6a6 6 0 0 1 6-6zM10 20h4",
  shifts: "M12 7v5l3 2M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z",
  compare: "M6 18V9M12 18V6M18 18v-7",
  display: "M3 6h18v10H3zM8 20h8M12 16v4",
  team: "M16 19v-1.5a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3V19M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 19v-1.2a2.5 2.5 0 0 0-2-2.45M16.5 6.2a2.5 2.5 0 0 1 0 4.6",
  settings:
    "M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM12 3.5v2M12 18.5v2M4.9 7.1l1.4 1.4M17.7 15.5l1.4 1.4M3.5 12h2M18.5 12h2M4.9 16.9l1.4-1.4M17.7 8.5l1.4-1.4",
  billing: "M4 7h16v10H4zM4 11h16",
};

export function NavIcon({ name }: { name: NavIconName }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={PATH[name]} />
    </svg>
  );
}
