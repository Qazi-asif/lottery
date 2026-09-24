import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getPermissionContext } from "@/lib/permissions";
import DashboardLoading from "./loading";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getPermissionContext();
  if (!ctx) {
    redirect("/login");
  }

  return (
    <DashboardShell
      role={ctx.role}
      features={ctx.features}
      billingRestricted={ctx.billingRestricted}
      name={ctx.name}
    >
      <Suspense fallback={<DashboardLoading />}>{children}</Suspense>
    </DashboardShell>
  );
}
