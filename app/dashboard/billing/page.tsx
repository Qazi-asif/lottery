import { redirect } from "next/navigation";
import { BillingPortalButton } from "@/components/dashboard/BillingPortalButton";
import { getPermissionContext } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export default async function BillingPage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.role !== "tenant_owner") redirect("/dashboard");

  const db = requirePrisma();
  const subscription = await db.subscription.findFirst({
    where: { tenantId: ctx.tenantId },
    orderBy: { createdAt: "desc" },
    include: { plan: { select: { name: true } } },
  });

  return (
    <div>
      <h1 className="font-serif text-h2 font-semibold">Billing</h1>
      <p className="mt-2 text-body text-ink-soft">
        Plan changes and payment methods are handled in Stripe&apos;s customer portal.
      </p>

      <div className="mt-8 max-w-lg rounded-lg border border-border bg-bg-secondary p-6">
        <p className="text-small uppercase tracking-wide text-gold">{subscription?.status}</p>
        <p className="mt-2 font-serif text-h3">{subscription?.plan.name ?? "No plan"}</p>
        {subscription ? (
          <p className="mt-2 text-small text-ink-soft">
            Current period ends{" "}
            {subscription.currentPeriodEnd.toLocaleDateString("en-US")}
          </p>
        ) : null}
      </div>

      <div className="mt-8">
        <BillingPortalButton />
      </div>
    </div>
  );
}
