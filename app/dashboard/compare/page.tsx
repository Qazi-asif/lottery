import { redirect } from "next/navigation";
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
    <div>
      <h1 className="font-serif text-h2 font-semibold">Location comparison</h1>
      <p className="mt-2 text-body text-ink-soft">Last 30 days of sales by store.</p>
      <div className="mt-10 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left">
          <thead className="border-b border-border bg-bg-secondary">
            <tr>
              {["Location", "Tickets", "Sales", "Commission"].map((h) => (
                <th key={h} className="px-4 py-3 text-small font-medium text-ink-soft">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => {
              const row = byId.get(location.id);
              return (
                <tr key={location.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">{location.name}</td>
                  <td className="px-4 py-3">{row?._count ?? 0}</td>
                  <td className="px-4 py-3">{formatCents(row?._sum.priceCents ?? 0)}</td>
                  <td className="px-4 py-3">
                    {formatCents(row?._sum.commissionEarnedCents ?? 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
