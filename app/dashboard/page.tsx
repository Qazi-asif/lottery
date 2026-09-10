import Link from "next/link";
import { redirect } from "next/navigation";
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

  return (
    <div>
      <h1 className="font-serif text-h2 font-semibold">Overview</h1>
      <p className="mt-2 text-body text-ink-soft">
        Inventory, sales, and display for your locations.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          ["Locations", String(locationCount)],
          ["Active packs", String(packCount)],
          ["Tickets sold", String(sales._count)],
          ["Gross sales", formatCents(sales._sum.priceCents ?? 0)],
          ["Commission earned", formatCents(sales._sum.commissionEarnedCents ?? 0)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-bg-secondary p-6"
          >
            <p className="text-small uppercase tracking-wide text-ink-soft">{label}</p>
            <p className="mt-3 font-serif text-h3 text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/dashboard/scan"
          className="rounded-lg border-2 border-transparent bg-ink px-6 py-3 text-body font-medium text-bg transition-colors hover:border-gold"
        >
          Open scan-to-sell
        </Link>
      </div>
    </div>
  );
}
