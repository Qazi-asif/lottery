"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardPane } from "@/components/dashboard/DashboardPane";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import type { UserRole } from "@prisma/client";
import type { PlanFeatures } from "@/lib/plan-features";

const STORAGE_KEY = "scratchcrest.nav-open";

export function DashboardShell({
  role,
  features,
  billingRestricted,
  name,
  children,
}: {
  role: UserRole;
  features: PlanFeatures;
  billingRestricted: boolean;
  name: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "0") setOpen(false);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
  }, [open]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <div className="dash flex h-screen overflow-hidden bg-paper text-ink">
      <div className="hidden h-full lg:block">
        <DashboardSidebar
          role={role}
          features={features}
          billingRestricted={billingRestricted}
          name={name}
          open={open}
          onToggle={() => setOpen((value) => !value)}
        />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/30"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-60 shadow-modal">
            <DashboardSidebar
              role={role}
              features={features}
              billingRestricted={billingRestricted}
              name={name}
              open
              onToggle={() => setMobileOpen(false)}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-sheet px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink hover:bg-paper-2"
            aria-label="Open navigation"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M3 5h12M3 9h12M3 13h12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <p className="font-display text-base font-semibold tracking-tight">ScratchCrest</p>
        </header>

        {billingRestricted ? (
          <div className="border-b border-border bg-flag-wash px-6 py-2.5 text-small text-ink">
            Your subscription needs attention. Billing is the only area available
            until you reactivate.
          </div>
        ) : null}

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <DashboardPane>{children}</DashboardPane>
          </div>
        </main>
      </div>
    </div>
  );
}
