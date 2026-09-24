import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { formatCents } from "@/lib/format";
import { getPermissionContext } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export default async function DashboardHomePage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.billingRestricted) redirect("/dashboard/billing");
  if (ctx.role === "cashier") redirect("/dashboard/scan");

  const db = requirePrisma();
  const [locationCount, packCount, sales] = await Promise.all([
    db.location.count({
      where:
        ctx.locationIds === null
          ? { tenantId: ctx.tenantId }
          : { tenantId: ctx.tenantId, id: { in: ctx.locationIds } },
    }),
    db.pack.count({
      where: {
        tenantId: ctx.tenantId,
        status: "activated",
        ...(ctx.locationIds ? { locationId: { in: ctx.locationIds } } : {}),
      },
    }),
    db.sale.aggregate({
      where: {
        tenantId: ctx.tenantId,
        ...(ctx.locationIds ? { locationId: { in: ctx.locationIds } } : {}),
      },
      _sum: { priceCents: true, commissionEarnedCents: true },
      _count: true,
    }),
  ]);

  const counts = [
    ["Locations", String(locationCount)],
    ["Active packs", String(packCount)],
    ["Tickets sold", String(sales._count)],
  ];
  const money = [
    ["Gross sales", formatCents(sales._sum.priceCents ?? 0)],
    ["Commission earned", formatCents(sales._sum.commissionEarnedCents ?? 0)],
  ];

  return (
    <DashboardPage
      title="Overview"
      description="Inventory, sales, and display for your locations."
      actions={
        <Link
          href="/dashboard/scan"
          className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-small font-medium text-paper hover:bg-ink-deep"
        >
          Open scan
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {counts.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-sheet px-5 py-4">
            <p className="text-small text-ink-soft">{label}</p>
            <p className="mt-2 font-mono text-[1.5rem] font-semibold tabular-nums tracking-tight text-ink">
              {value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {money.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-sheet px-5 py-4">
            <p className="text-small text-ink-soft">{label}</p>
            <p className="mt-2 font-mono text-[1.5rem] font-semibold tabular-nums tracking-tight text-ink">
              {value}
            </p>
          </div>
        ))}
      </div>
    </DashboardPage>
  );
}
