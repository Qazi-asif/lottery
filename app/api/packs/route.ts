import { NextRequest } from "next/server";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  assertLocationAccess,
  requireActiveBilling,
  requireAuth,
  requireFeature,
  requireRole,
} from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const ctx = await requireAuth();
    requireFeature(ctx, "inventory");
    const db = requirePrisma();
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId") ?? undefined;
    const status = searchParams.get("status") as
      | "received"
      | "activated"
      | "closed"
      | null;

    if (locationId) {
      assertLocationAccess(ctx, locationId);
    }

    const packs = await db.pack.findMany({
      where: {
        tenantId: ctx.tenantId,
        ...(locationId ? { locationId } : {}),
        ...(ctx.locationIds ? { locationId: { in: ctx.locationIds } } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        game: true,
        location: true,
        _count: { select: { tickets: { where: { status: "in_stock" } } } },
      },
      orderBy: { receivedAt: "desc" },
    });

    return jsonOk({
      packs: packs.map((pack) => ({
        ...pack,
        remainingTickets: pack._count.tickets,
      })),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await requireRole("tenant_owner", "location_manager");
    requireActiveBilling(ctx);
    requireFeature(ctx, "inventory");

    const body = (await request.json()) as {
      locationId?: string;
      gameId?: string;
      packNumber?: string;
    };

    const locationId = body.locationId?.trim();
    const gameId = body.gameId?.trim();
    const packNumber = body.packNumber?.trim();

    if (!locationId || !gameId || !packNumber) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "locationId, gameId, and packNumber are required",
        400,
      );
    }

    assertLocationAccess(ctx, locationId);
    const db = requirePrisma();

    const location = await db.location.findFirst({
      where: { id: locationId, tenantId: ctx.tenantId },
    });
    if (!location) {
      throw new ApiError("TENANT_MISMATCH", "Location not found for this account", 403);
    }

    const game = await db.game.findUnique({ where: { id: gameId } });
    if (!game?.active) {
      throw new ApiError("VALIDATION_ERROR", "Game is not available", 400);
    }

    const pack = await db.pack.create({
      data: {
        tenantId: ctx.tenantId,
        locationId,
        gameId,
        packNumber,
        ticketCount: game.ticketsPerPack,
        status: "received",
        receivedAt: new Date(),
      },
    });

    return jsonOk({ pack }, 201);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
