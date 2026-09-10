import { NextRequest } from "next/server";
import { apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  assertLocationAccess,
  requireFeature,
  requireRoleAtLeast,
} from "@/lib/permissions";
import { asDate, loose, requirePrisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const ctx = await requireRoleAtLeast("location_manager");
    requireFeature(ctx, "alerts");

    const locationId = new URL(request.url).searchParams.get("locationId") ?? undefined;
    if (locationId) {
      assertLocationAccess(ctx, locationId);
    }

    const db = requirePrisma();
    const settings = await db.settings.findUnique({
      where: { tenantId: ctx.tenantId },
    });
    const threshold = settings?.lowStockThreshold ?? 10;
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const locationScope = locationId
      ? { locationId }
      : ctx.locationIds
        ? { locationId: { in: ctx.locationIds } }
        : {};

    const packs = await db.pack.findMany({
      where: {
        tenantId: ctx.tenantId,
        status: "activated",
        ...locationScope,
      },
      select: {
        id: true,
        packNumber: true,
        locationId: true,
        gameId: true,
        game: {
          select: loose({
            name: true,
            gameNumber: true,
            officialCloseAt: true,
          }),
        },
        location: { select: { name: true } },
        _count: { select: { tickets: { where: { status: "in_stock" } } } },
      },
    });

    const salesLast7 = await db.sale.groupBy({
      by: ["gameId", "locationId"],
      where: {
        tenantId: ctx.tenantId,
        soldAt: { gte: since },
        ...locationScope,
      },
      _count: true,
    });

    const velocityKey = (gameId: string, locId: string) => `${gameId}:${locId}`;
    const soldMap = new Map(
      salesLast7.map((row) => [velocityKey(row.gameId, row.locationId), row._count]),
    );

    const lowStock = packs
      .filter((pack) => pack._count.tickets < threshold)
      .map((pack) => {
        const sold7 = soldMap.get(velocityKey(pack.gameId, pack.locationId)) ?? 0;
        const remaining = pack._count.tickets;
        const daysOfStock =
          sold7 > 0 ? Number((remaining / (sold7 / 7)).toFixed(1)) : null;
        return {
          packId: pack.id,
          packNumber: pack.packNumber,
          gameName: pack.game.name,
          locationName: pack.location.name,
          remaining,
          soldLast7Days: sold7,
          daysOfStock,
        };
      });

    const overdueGames = packs
      .filter((pack) => {
        const officialCloseAt = asDate(pack.game.officialCloseAt);
        return (
          officialCloseAt !== null &&
          officialCloseAt.getTime() < Date.now() &&
          pack._count.tickets > 0
        );
      })
      .map((pack) => ({
        packId: pack.id,
        gameName: pack.game.name,
        gameNumber: pack.game.gameNumber,
        locationName: pack.location.name,
        officialCloseAt: asDate(pack.game.officialCloseAt),
        remaining: pack._count.tickets,
      }));

    const employeeSales = await db.sale.groupBy({
      by: ["soldByUserId", "locationId"],
      where: {
        tenantId: ctx.tenantId,
        soldAt: { gte: since },
        ...locationScope,
      },
      _count: true,
    });

    const byLocation = new Map<string, number[]>();
    for (const row of employeeSales) {
      const list = byLocation.get(row.locationId) ?? [];
      list.push(row._count);
      byLocation.set(row.locationId, list);
    }

    const userIds = [...new Set(employeeSales.map((row) => row.soldByUserId))];
    const users = await db.user.findMany({
      where: { id: { in: userIds }, tenantId: ctx.tenantId },
      select: { id: true, name: true },
    });
    const userName = new Map(users.map((user) => [user.id, user.name]));
    const locations = await db.location.findMany({
      where: { tenantId: ctx.tenantId },
      select: { id: true, name: true },
    });
    const locationName = new Map(locations.map((row) => [row.id, row.name]));

    const anomalies = employeeSales
      .filter((row) => {
        const counts = byLocation.get(row.locationId) ?? [];
        if (counts.length < 2) return false;
        const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
        return row._count > avg * 2.5 && row._count >= 20;
      })
      .map((row) => ({
        userId: row.soldByUserId,
        userName: userName.get(row.soldByUserId) ?? "Unknown",
        locationName: locationName.get(row.locationId) ?? "",
        scansLast7Days: row._count,
      }));

    return jsonOk({
      threshold,
      lowStock,
      overdueGames,
      anomalies,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
