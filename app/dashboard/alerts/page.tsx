import { redirect } from "next/navigation";
import { getPermissionContext } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export default async function AlertsPage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.billingRestricted) redirect("/dashboard/billing");
  if (ctx.role === "cashier") redirect("/dashboard/scan");
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
      game: { select: { name: true, gameNumber: true, officialCloseAt: true } },
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
    .filter(
      (pack) =>
        pack.game.officialCloseAt &&
        pack.game.officialCloseAt.getTime() < Date.now() &&
        pack._count.tickets > 0,
    )
    .map((pack) => ({
      id: pack.id,
      gameName: pack.game.name,
      locationName: pack.location.name,
      close: pack.game.officialCloseAt!.toLocaleDateString("en-US"),
    }));

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
    <div>
      <h1 className="font-serif text-h2 font-semibold">Alerts</h1>
      <p className="mt-2 text-body text-ink-soft">
        Reorder by remaining tickets and sell-through. Overdue games are still on
        the counter after their official close date. Scan flags compare cashiers at
        the same store — not game odds.
      </p>

      <section className="mt-10">
        <h2 className="font-serif text-h3">Low stock</h2>
        <p className="mt-1 text-small text-ink-soft">Threshold: {threshold} tickets</p>
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
          {lowStock.length === 0 ? (
            <li className="px-4 py-3 text-ink-soft">No packs below threshold.</li>
          ) : (
            lowStock.map((row) => (
              <li key={row.id} className="px-4 py-3">
                {row.gameName} · {row.locationName} · {row.remaining} left · {row.soldLast7Days} sold / 7d · ~{row.daysOfStock} days of stock
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-h3">Past official close date</h2>
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
          {overdue.length === 0 ? (
            <li className="px-4 py-3 text-ink-soft">No overdue active games.</li>
          ) : (
            overdue.map((row) => (
              <li key={row.id} className="px-4 py-3">
                {row.gameName} · {row.locationName} · closed {row.close}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-h3">Scan volume flags</h2>
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
          {anomalies.length === 0 ? (
            <li className="px-4 py-3 text-ink-soft">No unusual scan volumes this week.</li>
          ) : (
            anomalies.map((row) => (
              <li key={row.id} className="px-4 py-3">
                {row.name} scanned {row.scans} tickets in 7 days (well above store average).
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
