import { NextRequest } from "next/server";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  assertLocationAccess,
  requireActiveBilling,
  requireFeature,
  requireRoleAtLeast,
} from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const ctx = await requireRoleAtLeast("location_manager");
    requireFeature(ctx, "cash_reconciliation");
    const locationId = new URL(request.url).searchParams.get("locationId") ?? undefined;
    if (locationId) {
      assertLocationAccess(ctx, locationId);
    }
    const db = requirePrisma();
    const shifts = await db.shiftReconciliation.findMany({
      where: {
        tenantId: ctx.tenantId,
        ...(locationId ? { locationId } : {}),
        ...(ctx.locationIds ? { locationId: { in: ctx.locationIds } } : {}),
      },
      include: {
        location: { select: { name: true } },
        openedBy: { select: { name: true } },
      },
      orderBy: { openedAt: "desc" },
      take: 50,
    });
    return jsonOk({ shifts });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await requireRoleAtLeast("location_manager");
    requireActiveBilling(ctx);
    requireFeature(ctx, "cash_reconciliation");
    const body = (await request.json()) as { locationId?: string };
    const locationId = body.locationId?.trim();
    if (!locationId) {
      throw new ApiError("VALIDATION_ERROR", "locationId is required", 400);
    }
    assertLocationAccess(ctx, locationId);
    const db = requirePrisma();
    const location = await db.location.findFirst({
      where: { id: locationId, tenantId: ctx.tenantId, active: true },
    });
    if (!location) {
      throw new ApiError("TENANT_MISMATCH", "Location not found for this account", 403);
    }
    const open = await db.shiftReconciliation.findFirst({
      where: { tenantId: ctx.tenantId, locationId, status: "open" },
    });
    if (open) {
      throw new ApiError("VALIDATION_ERROR", "This location already has an open shift", 409);
    }
    const shift = await db.shiftReconciliation.create({
      data: {
        tenantId: ctx.tenantId,
        locationId,
        openedByUserId: ctx.userId,
        openedAt: new Date(),
        status: "open",
      },
    });
    return jsonOk({ shift }, 201);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
