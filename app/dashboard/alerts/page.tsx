import { redirect } from "next/navigation";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { getPermissionContext } from "@/lib/permissions";
import { asDate, requirePrisma } from "@/lib/prisma";

export default async function AlertsPage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.billingRestricted) redirect("/dashboard/billing");
  if (ctx.role === "cashier") redirect("/dashboard/sell");
  if (!ctx.features.alerts) redirect("/dashboard");

  const db = requirePrisma();
  const settings = await db.settings.findUnique({
    where: { tenantId: ctx.tenantId },
  });
  const threshold = settings?.lowStockThreshold ?? 10;
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const locationScope = ctx.locationIds
    ? { locationId: { in: ctx.locationIds } }
    : {};

  const packs = await db.pack.findMany({
    where: { tenantId: ctx.tenantId, status: "activated", ...locationScope },
    include: {
      game: true,
      location: { select: { name: true } },
      _count: { select: { tickets: { where: { status: "in_stock" } } } },
    },
  });

  const salesLast7 = await db.sale.groupBy({
    by: ["gameId", "locationId"],
    where: { tenantId: ctx.tenantId, soldAt: { gte: since }, ...locationScope },
    _count: true,
  });
  const soldMap = new Map(
    salesLast7.map((row) => [`${row.gameId}:${row.locationId}`, row._count]),
  );

  const lowStock = packs
    .filter((pack) => pack._count.tickets < threshold)
    .map((pack) => {
      const sold7 = soldMap.get(`${pack.gameId}:${pack.locationId}`) ?? 0;
      return {
        id: pack.id,
        gameName: pack.game.name,
        locationName: pack.location.name,
        remaining: pack._count.tickets,
        soldLast7Days: sold7,
        daysOfStock: sold7 > 0 ? (pack._count.tickets / (sold7 / 7)).toFixed(1) : "—",
      };
    });

  const overdue = packs
    .filter((pack) => {
      const officialCloseAt = asDate(
        pack.game && "officialCloseAt" in pack.game
          ? pack.game.officialCloseAt
          : undefined,
      );
      return (
        officialCloseAt !== null &&
        officialCloseAt.getTime() < Date.now() &&
        pack._count.tickets > 0
      );
    })
    .map((pack) => {
      const officialCloseAt = asDate(
        pack.game && "officialCloseAt" in pack.game
          ? pack.game.officialCloseAt
          : undefined,
      );
      return {
        id: pack.id,
        gameName: pack.game.name,
        locationName: pack.location.name,
        close: officialCloseAt?.toLocaleDateString("en-US") ?? "",
      };
    });

  const employeeSales = await db.sale.groupBy({
    by: ["soldByUserId", "locationId"],
    where: { tenantId: ctx.tenantId, soldAt: { gte: since }, ...locationScope },
    _count: true,
  });
  const byLocation = new Map<string, number[]>();
  for (const row of employeeSales) {
    const list = byLocation.get(row.locationId) ?? [];
    list.push(row._count);
    byLocation.set(row.locationId, list);
  }
  const users = await db.user.findMany({
    where: { tenantId: ctx.tenantId },
    select: { id: true, name: true },
  });
  const names = new Map(users.map((user) => [user.id, user.name]));
  const anomalies = employeeSales
    .filter((row) => {
      const counts = byLocation.get(row.locationId) ?? [];
      if (counts.length < 2) return false;
      const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
      return row._count > avg * 2.5 && row._count >= 20;
    })
      .map((row) => ({
        id: row.soldByUserId,
        name: names.get(row.soldByUserId) ?? "Unknown",
        scans: row._count,
      }));

  return (
    <DashboardPage
      title="Alerts"
      description="Reorder by remaining tickets and sell-through. Overdue games are still on the counter after their official close date. Scan flags compare cashiers at the same store — not game odds."
    >
      <section>
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-base font-semibold text-ink">Low stock</h2>
          <p className="text-small text-ink-faint">Threshold: {threshold} tickets</p>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-sheet">
          <table>
            <thead className="border-b border-border bg-paper-2/60">
              <tr>
                <th>Game</th>
                <th>Location</th>
                <th className="num">Left</th>
                <th className="num">Sold / 7d</th>
                <th className="num">Days of stock</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-ink-soft">No packs below threshold.</td>
                </tr>
              ) : (
                lowStock.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-b-0">
                    <td>{row.gameName}</td>
                    <td>{row.locationName}</td>
                    <td className="num">{row.remaining}</td>
                    <td className="num">{row.soldLast7Days}</td>
                    <td className="num">{row.daysOfStock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-base font-semibold text-ink">Past official close date</h2>
        <div className="overflow-hidden rounded-lg border border-border bg-sheet">
          <table>
            <thead className="border-b border-border bg-paper-2/60">
              <tr>
                <th>Game</th>
                <th>Location</th>
                <th>Closed</th>
              </tr>
            </thead>
            <tbody>
              {overdue.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-ink-soft">No overdue active games.</td>
                </tr>
              ) : (
                overdue.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-b-0">
                    <td>{row.gameName}</td>
                    <td>{row.locationName}</td>
                    <td>{row.close}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-base font-semibold text-ink">Scan volume flags</h2>
        <div className="overflow-hidden rounded-lg border border-border bg-sheet">
          <table>
            <thead className="border-b border-border bg-paper-2/60">
              <tr>
                <th>Cashier</th>
                <th className="num">Scans / 7d</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-ink-soft">No unusual scan volumes this week.</td>
                </tr>
              ) : (
                anomalies.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-b-0">
                    <td>{row.name}</td>
                    <td className="num">{row.scans}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardPage>
  );
}
