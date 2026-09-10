import { NextRequest } from "next/server";
import { apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  assertLocationAccess,
  requireAuth,
  requireFeature,
} from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const ctx = await requireAuth();
    requireFeature(ctx, "inventory");

    const locationId = new URL(request.url).searchParams.get("locationId") ?? undefined;
    if (locationId) {
      assertLocationAccess(ctx, locationId);
    }

    const db = requirePrisma();
    const settings = await db.settings.findUnique({
      where: { tenantId: ctx.tenantId },
    });
    const threshold = settings?.lowStockThreshold ?? 10;

    const packs = await db.pack.findMany({
      where: {
        tenantId: ctx.tenantId,
        status: "activated",
        ...(locationId ? { locationId } : {}),
        ...(ctx.locationIds ? { locationId: { in: ctx.locationIds } } : {}),
      },
      include: {
        game: true,
        location: true,
        _count: { select: { tickets: { where: { status: "in_stock" } } } },
      },
    });

    const lowStock = packs.filter((pack) => pack._count.tickets < threshold);

    return jsonOk({
      threshold,
      packs: lowStock.map((pack) => ({
        ...pack,
        remainingTickets: pack._count.tickets,
      })),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
