import { redirect } from "next/navigation";
import { BillingPortalButton } from "@/components/dashboard/BillingPortalButton";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { getPermissionContext } from "@/lib/permissions";
import { getPrisma } from "@/lib/prisma";

export default async function BillingPage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.role !== "tenant_owner") redirect("/dashboard");

  const db = getPrisma();
  if (!db) redirect("/login");

  const subscription = await db.subscription
    .findFirst({
      where: { tenantId: ctx.tenantId },
      orderBy: { createdAt: "desc" },
      include: { plan: { select: { name: true } } },
    })
    .catch((error) => {
      console.error("Billing page query failed:", error);
      return null;
    });

  return (
    <DashboardPage
      title="Billing"
      description="Plan changes and payment methods are handled in Stripe's customer portal."
    >
      <div className="max-w-lg rounded-lg border border-border bg-sheet px-5 py-5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          {subscription?.status ?? "none"}
        </p>
        <p className="mt-2 font-display text-xl font-semibold">{subscription?.plan.name ?? "No plan"}</p>
        {subscription ? (
          <p className="mt-2 text-small text-ink-soft">
            Current period ends {subscription.currentPeriodEnd.toLocaleDateString("en-US")}
          </p>
        ) : null}
        <div className="mt-5">
          <BillingPortalButton />
        </div>
      </div>
    </DashboardPage>
  );
}
