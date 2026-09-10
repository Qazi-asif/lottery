import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { getPermissionContext } from "@/lib/permissions";

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
    <div className="flex min-h-screen bg-bg">
      <DashboardSidebar
        role={ctx.role}
        features={ctx.features}
        billingRestricted={ctx.billingRestricted}
        name={ctx.name}
      />
      <div className="min-w-0 flex-1">
        {ctx.billingRestricted ? (
          <div className="border-b border-border bg-bg-secondary px-8 py-3 text-small text-ink-soft">
            Your subscription needs attention. Billing is the only area available
            until you reactivate.
          </div>
        ) : null}
        <div className="px-8 py-10">{children}</div>
      </div>
    </div>
  );
}
