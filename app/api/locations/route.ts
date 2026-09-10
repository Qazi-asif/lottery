import { NextRequest } from "next/server";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  locationWhere,
  requireActiveBilling,
  requireAuth,
  requireFeature,
  requireRole,
} from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ctx = await requireAuth();
    const db = requirePrisma();
    const locations = await db.location.findMany({
      where: locationWhere(ctx),
      orderBy: { name: "asc" },
    });
    return jsonOk({ locations });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await requireRole("tenant_owner");
    requireActiveBilling(ctx);

    const body = (await request.json()) as {
      name?: string;
      address?: string;
      city?: string;
      state?: string;
      zip?: string;
    };

    const name = body.name?.trim();
    const address = body.address?.trim();
    const city = body.city?.trim();
    const state = (body.state?.trim() || "TX").toUpperCase();
    const zip = body.zip?.trim();

    if (!name || !address || !city || !zip) {
      throw new ApiError("VALIDATION_ERROR", "Name, address, city, and zip are required", 400);
    }

    const db = requirePrisma();
    const existingCount = await db.location.count({
      where: { tenantId: ctx.tenantId },
    });
    if (existingCount >= 1) {
      requireFeature(ctx, "multi_location");
    }

    const location = await db.location.create({
      data: {
        tenantId: ctx.tenantId,
        name,
        address,
        city,
        state,
        zip,
      },
    });

    return jsonOk({ location }, 201);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
