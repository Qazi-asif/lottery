import { NextRequest } from "next/server";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  assertLocationAccess,
  requireActiveBilling,
  requireFeature,
  requireRoleAtLeast,
} from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await requireRoleAtLeast("location_manager");
    requireActiveBilling(ctx);
    requireFeature(ctx, "cash_reconciliation");
    const { id } = await context.params;
    const body = (await request.json()) as { actualCents?: number };
    if (typeof body.actualCents !== "number" || body.actualCents < 0) {
      throw new ApiError("VALIDATION_ERROR", "actualCents is required", 400);
    }

    const db = requirePrisma();
    const shift = await db.shiftReconciliation.findFirst({
      where: { id, tenantId: ctx.tenantId, status: "open" },
    });
    if (!shift) {
      throw new ApiError("NOT_FOUND", "Open shift not found", 404);
    }
    assertLocationAccess(ctx, shift.locationId);

    const closedAt = new Date();
    const [sales, payouts] = await Promise.all([
      db.sale.aggregate({
        where: {
          tenantId: ctx.tenantId,
          locationId: shift.locationId,
          soldAt: { gte: shift.openedAt, lte: closedAt },
        },
        _sum: { priceCents: true },
      }),
      db.prizePayout.aggregate({
        where: {
          tenantId: ctx.tenantId,
          locationId: shift.locationId,
          paidAt: { gte: shift.openedAt, lte: closedAt },
        },
        _sum: { amountPaidCents: true },
      }),
    ]);

    const expectedCents =
      (sales._sum.priceCents ?? 0) - (payouts._sum.amountPaidCents ?? 0);
    const actualCents = Math.round(body.actualCents);
    const varianceCents = actualCents - expectedCents;

    const updated = await db.shiftReconciliation.update({
      where: { id: shift.id },
      data: {
        status: "closed",
        closedAt,
        closedByUserId: ctx.userId,
        expectedCents,
        actualCents,
        varianceCents,
      },
    });

    return jsonOk({ shift: updated });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
