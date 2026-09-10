import { redirect } from "next/navigation";
import { ShiftManager } from "@/components/dashboard/ShiftManager";
import { getPermissionContext, locationWhere } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export default async function ShiftsPage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.billingRestricted) redirect("/dashboard/billing");
  if (ctx.role === "cashier") redirect("/dashboard/scan");
  if (!ctx.features.cash_reconciliation) redirect("/dashboard");

  const db = requirePrisma();
  const [locations, shifts] = await Promise.all([
    db.location.findMany({
      where: locationWhere(ctx),
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    db.shiftReconciliation.findMany({
      where: {
        tenantId: ctx.tenantId,
        ...(ctx.locationIds ? { locationId: { in: ctx.locationIds } } : {}),
      },
      include: {
        location: { select: { name: true } },
        openedBy: { select: { name: true } },
      },
      orderBy: { openedAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <ShiftManager
      locations={locations}
      shifts={shifts.map((shift) => ({
        ...shift,
        openedAt: shift.openedAt.toISOString(),
        closedAt: shift.closedAt?.toISOString() ?? null,
      }))}
    />
  );
}
