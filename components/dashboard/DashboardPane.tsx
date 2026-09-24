"use client";

import { usePathname } from "next/navigation";

export function DashboardPane({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="dash-enter">
      {children}
    </div>
  );
}
