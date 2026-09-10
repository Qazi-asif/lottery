import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  requireActiveBilling,
  requireRole,
} from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ctx = await requireRole("tenant_owner");
    const db = requirePrisma();
    const settings = await db.settings.findUnique({
      where: { tenantId: ctx.tenantId },
    });
    return jsonOk({
      settings: {
        commissionRate: Number(settings?.commissionRate ?? 0.05),
        cashingBonusRate: Number(settings?.cashingBonusRate ?? 0),
        lowStockThreshold: settings?.lowStockThreshold ?? 10,
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const ctx = await requireRole("tenant_owner");
    requireActiveBilling(ctx);
    const body = (await request.json()) as {
      commissionRate?: number;
      cashingBonusRate?: number;
      lowStockThreshold?: number;
    };

    if (
      body.commissionRate !== undefined &&
      (body.commissionRate < 0 || body.commissionRate > 1)
    ) {
      throw new ApiError("VALIDATION_ERROR", "commissionRate must be between 0 and 1", 400);
    }
    if (
      body.cashingBonusRate !== undefined &&
      (body.cashingBonusRate < 0 || body.cashingBonusRate > 1)
    ) {
      throw new ApiError("VALIDATION_ERROR", "cashingBonusRate must be between 0 and 1", 400);
    }
    if (
      body.lowStockThreshold !== undefined &&
      (!Number.isInteger(body.lowStockThreshold) || body.lowStockThreshold < 0)
    ) {
      throw new ApiError("VALIDATION_ERROR", "lowStockThreshold must be a non-negative integer", 400);
    }

    const db = requirePrisma();
    const settings = await db.settings.upsert({
      where: { tenantId: ctx.tenantId },
      create: {
        tenantId: ctx.tenantId,
        commissionRate:
          body.commissionRate !== undefined
            ? new Prisma.Decimal(body.commissionRate)
            : undefined,
        cashingBonusRate:
          body.cashingBonusRate !== undefined
            ? new Prisma.Decimal(body.cashingBonusRate)
            : undefined,
        lowStockThreshold: body.lowStockThreshold,
      },
      update: {
        ...(body.commissionRate !== undefined
          ? { commissionRate: new Prisma.Decimal(body.commissionRate) }
          : {}),
        ...(body.cashingBonusRate !== undefined
          ? { cashingBonusRate: new Prisma.Decimal(body.cashingBonusRate) }
          : {}),
        ...(body.lowStockThreshold !== undefined
          ? { lowStockThreshold: body.lowStockThreshold }
          : {}),
      },
    });

    return jsonOk({
      settings: {
        commissionRate: Number(settings.commissionRate),
        cashingBonusRate: Number(settings.cashingBonusRate),
        lowStockThreshold: settings.lowStockThreshold,
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
