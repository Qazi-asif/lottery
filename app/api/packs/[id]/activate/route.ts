import { NextRequest } from "next/server";
import { ticketBarcodeValue } from "@/lib/barcode";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  assertLocationAccess,
  requireActiveBilling,
  requireFeature,
  requireRole,
} from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await requireRole("tenant_owner", "location_manager");
    requireActiveBilling(ctx);
    requireFeature(ctx, "inventory");

    const { id } = await context.params;
    const db = requirePrisma();

    const pack = await db.pack.findFirst({
      where: { id, tenantId: ctx.tenantId },
      include: { game: true },
    });

    if (!pack) {
      throw new ApiError("NOT_FOUND", "Pack not found", 404);
    }

    assertLocationAccess(ctx, pack.locationId);

    if (pack.status !== "received") {
      throw new ApiError(
        "PACK_NOT_ACTIVATED",
        "Only received packs can be activated",
        400,
      );
    }

    const tickets = Array.from({ length: pack.ticketCount }, (_, index) => {
      const ticketNumber = index + 1;
      return {
        packId: pack.id,
        ticketNumber,
        barcodeValue: ticketBarcodeValue(
          pack.game.gameNumber,
          pack.packNumber,
          ticketNumber,
        ),
        status: "in_stock" as const,
      };
    });

    const activated = await db.$transaction(async (tx) => {
      await tx.ticket.createMany({ data: tickets });
      return tx.pack.update({
        where: { id: pack.id },
        data: { status: "activated", activatedAt: new Date() },
      });
    });

    return jsonOk({ pack: activated, ticketsCreated: tickets.length });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
