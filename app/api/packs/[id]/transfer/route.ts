import { NextRequest } from "next/server";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  assertLocationAccess,
  requireActiveBilling,
  requireFeature,
  requireRole,
} from "@/lib/permissions";
import { asAppDb, requirePrisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await requireRole("tenant_owner", "location_manager");
    requireActiveBilling(ctx);
    requireFeature(ctx, "pack_transfer");
    const { id } = await context.params;
    const body = (await request.json()) as { toLocationId?: string };
    const toLocationId = body.toLocationId?.trim();
    if (!toLocationId) {
      throw new ApiError("VALIDATION_ERROR", "toLocationId is required", 400);
    }
    assertLocationAccess(ctx, toLocationId);

    const db = requirePrisma();
    const pack = await db.pack.findFirst({
      where: { id, tenantId: ctx.tenantId },
    });
    if (!pack) {
      throw new ApiError("NOT_FOUND", "Pack not found", 404);
    }
    assertLocationAccess(ctx, pack.locationId);
    if (pack.status === "closed") {
      throw new ApiError("VALIDATION_ERROR", "Closed packs cannot be transferred", 400);
    }
    if (pack.locationId === toLocationId) {
      throw new ApiError("VALIDATION_ERROR", "Pack is already at that location", 400);
    }

    const destination = await db.location.findFirst({
      where: { id: toLocationId, tenantId: ctx.tenantId, active: true },
    });
    if (!destination) {
      throw new ApiError("TENANT_MISMATCH", "Destination location is not in this account", 403);
    }

    const fromLocationId = pack.locationId;
    const updated = await db.$transaction(async (tx) => {
      const next = await tx.pack.update({
        where: { id: pack.id },
        data: { locationId: toLocationId },
      });
      await asAppDb(tx).packTransfer.create({
        data: {
          tenantId: ctx.tenantId,
          packId: pack.id,
          fromLocationId,
          toLocationId,
          transferredByUserId: ctx.userId,
          transferredAt: new Date(),
        },
      });
      return next;
    });

    return jsonOk({ pack: updated });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
