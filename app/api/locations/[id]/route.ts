import { NextRequest } from "next/server";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  requireActiveBilling,
  requireAuth,
  requireRole,
} from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await requireAuth();
    const { id } = await context.params;
    const db = requirePrisma();
    const location = await db.location.findFirst({
      where: { id, tenantId: ctx.tenantId },
    });
    if (!location) {
      throw new ApiError("NOT_FOUND", "Location not found", 404);
    }
    if (ctx.locationIds && !ctx.locationIds.includes(id)) {
      throw new ApiError("TENANT_MISMATCH", "Location is not assigned to this user", 403);
    }
    return jsonOk({ location });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await requireRole("tenant_owner");
    requireActiveBilling(ctx);
    const { id } = await context.params;
    const body = (await request.json()) as {
      name?: string;
      address?: string;
      city?: string;
      state?: string;
      zip?: string;
      active?: boolean;
    };
    const db = requirePrisma();
    const existing = await db.location.findFirst({
      where: { id, tenantId: ctx.tenantId },
    });
    if (!existing) {
      throw new ApiError("NOT_FOUND", "Location not found", 404);
    }
    const location = await db.location.update({
      where: { id },
      data: {
        ...(body.name?.trim() ? { name: body.name.trim() } : {}),
        ...(body.address?.trim() ? { address: body.address.trim() } : {}),
        ...(body.city?.trim() ? { city: body.city.trim() } : {}),
        ...(body.state?.trim() ? { state: body.state.trim().toUpperCase() } : {}),
        ...(body.zip?.trim() ? { zip: body.zip.trim() } : {}),
        ...(typeof body.active === "boolean" ? { active: body.active } : {}),
      },
    });
    return jsonOk({ location });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
