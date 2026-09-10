import { NextRequest } from "next/server";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  assertLocationAccess,
  requireActiveBilling,
  requireRoleAtLeast,
} from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const ctx = await requireRoleAtLeast("cashier");
    requireActiveBilling(ctx);

    const body = (await request.json()) as {
      ticketId?: string | null;
      locationId?: string;
      amountPaidCents?: number;
    };

    const locationId = body.locationId?.trim();
    const amountPaidCents = body.amountPaidCents;
    const ticketId = body.ticketId || null;

    if (!locationId || typeof amountPaidCents !== "number" || amountPaidCents < 0) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "locationId and amountPaidCents are required",
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

    if (ticketId) {
      const ticket = await db.ticket.findFirst({
        where: { id: ticketId, pack: { tenantId: ctx.tenantId } },
      });
      if (!ticket) {
        throw new ApiError("NOT_FOUND", "Ticket not found", 404);
      }
    }

    const settings = await db.settings.findUnique({
      where: { tenantId: ctx.tenantId },
    });
    const cashingBonusRate = settings ? Number(settings.cashingBonusRate) : 0;
    const cashingBonusEarnedCents = Math.round(amountPaidCents * cashingBonusRate);

    const payout = await db.prizePayout.create({
      data: {
        tenantId: ctx.tenantId,
        locationId,
        ticketId,
        amountPaidCents,
        cashingBonusRate,
        cashingBonusEarnedCents,
        paidByUserId: ctx.userId,
        paidAt: new Date(),
      },
    });

    return jsonOk({ payout }, 201);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
