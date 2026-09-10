import { redirect } from "next/navigation";
import { InventoryManager } from "@/components/dashboard/InventoryManager";
import { getPermissionContext, locationWhere } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export default async function InventoryPage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.billingRestricted) redirect("/dashboard/billing");
  if (ctx.role === "cashier") redirect("/dashboard/scan");
  if (!ctx.features.inventory) redirect("/dashboard");

  const db = requirePrisma();
  const [packs, games, locations] = await Promise.all([
    db.pack.findMany({
      where: {
        tenantId: ctx.tenantId,
        ...(ctx.locationIds ? { locationId: { in: ctx.locationIds } } : {}),
      },
      include: {
        game: true,
        location: true,
        _count: { select: { tickets: { where: { status: "in_stock" } } } },
      },
      orderBy: { receivedAt: "desc" },
    }),
    db.game.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    db.location.findMany({ where: locationWhere(ctx), orderBy: { name: "asc" } }),
  ]);

  return (
    <InventoryManager
      packs={packs.map((pack) => ({
        ...pack,
        remainingTickets: pack._count.tickets,
      }))}
      games={games}
      locations={locations}
    />
  );
}
