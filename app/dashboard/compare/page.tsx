import { redirect } from "next/navigation";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { formatCents } from "@/lib/format";
import { getPermissionContext } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export default async function ComparePage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.billingRestricted) redirect("/dashboard/billing");
  if (ctx.role !== "tenant_owner") redirect("/dashboard");
  if (!ctx.features.multi_location) redirect("/dashboard");

  const db = requirePrisma();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [locations, grouped] = await Promise.all([
    db.location.findMany({
      where: { tenantId: ctx.tenantId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    db.sale.groupBy({
      by: ["locationId"],
      where: { tenantId: ctx.tenantId, soldAt: { gte: since } },
      _sum: { priceCents: true, commissionEarnedCents: true },
      _count: true,
    }),
  ]);

  const byId = new Map(grouped.map((row) => [row.locationId, row]));

  return (
    <DashboardPage
      title="Location comparison"
      description="Last 30 days of sales by store."
    >
      <div className="overflow-hidden rounded-lg border border-border bg-sheet">
        <table>
          <thead className="border-b border-border bg-paper-2/60">
            <tr>
              <th>Location</th>
              <th className="num">Tickets</th>
              <th className="num">Sales</th>
              <th className="num">Commission</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => {
              const row = byId.get(location.id);
              return (
                <tr key={location.id} className="border-b border-border last:border-b-0">
                  <td>{location.name}</td>
                  <td className="num">{row?._count ?? 0}</td>
                  <td className="num">{formatCents(row?._sum.priceCents ?? 0)}</td>
                  <td className="num">{formatCents(row?._sum.commissionEarnedCents ?? 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardPage>
  );
}
