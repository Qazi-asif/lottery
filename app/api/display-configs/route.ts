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

const LANGUAGES = ["en", "es", "bilingual"] as const;
const LAYOUTS = ["landscape", "portrait"] as const;

export async function GET(request: NextRequest) {
  try {
    const ctx = await requireAuth();
    requireFeature(ctx, "display");
    const locationId = new URL(request.url).searchParams.get("locationId");
    if (!locationId) {
      throw new ApiError("VALIDATION_ERROR", "locationId is required", 400);
    }
    assertLocationAccess(ctx, locationId);
    const db = requirePrisma();
    const config = await db.displayConfig.findFirst({
      where: { locationId, location: { tenantId: ctx.tenantId } },
    });
    return jsonOk({ config });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const ctx = await requireRole("tenant_owner", "location_manager");
    requireActiveBilling(ctx);
    requireFeature(ctx, "display");
    const body = (await request.json()) as {
      locationId?: string;
      layout?: "landscape" | "portrait";
      theme?: string;
      binAssignments?: Record<string, string>;
      showWinners?: boolean;
      language?: string;
    };
    const locationId = body.locationId?.trim();
    if (!locationId) {
      throw new ApiError("VALIDATION_ERROR", "locationId is required", 400);
    }
    assertLocationAccess(ctx, locationId);
    if (body.layout && !LAYOUTS.includes(body.layout)) {
      throw new ApiError("VALIDATION_ERROR", "Invalid layout", 400);
    }
    if (body.language && !LANGUAGES.includes(body.language as (typeof LANGUAGES)[number])) {
      throw new ApiError("VALIDATION_ERROR", "language must be en, es, or bilingual", 400);
    }

    const db = requirePrisma();
    const location = await db.location.findFirst({
      where: { id: locationId, tenantId: ctx.tenantId },
    });
    if (!location) {
      throw new ApiError("TENANT_MISMATCH", "Location not found for this account", 403);
    }

    const existing = await db.displayConfig.findFirst({
      where: { locationId },
    });
    const data = {
      layout: body.layout ?? existing?.layout ?? "landscape",
      theme: body.theme?.trim() || existing?.theme || "plain",
      binAssignments: body.binAssignments ?? existing?.binAssignments ?? {},
      showWinners: body.showWinners ?? existing?.showWinners ?? true,
      language: body.language ?? existing?.language ?? "en",
    };

    const config = existing
      ? await db.displayConfig.update({ where: { id: existing.id }, data })
      : await db.displayConfig.create({
          data: { locationId, ...data },
        });

    return jsonOk({ config });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
