import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
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

    const existingForPack = await db.ticket.count({
      where: { packId: pack.id },
    });
    if (existingForPack > 0) {
      const activated = await db.pack.update({
        where: { id: pack.id },
        data: { status: "activated", activatedAt: new Date() },
      });
      return jsonOk({ pack: activated, ticketsCreated: 0 });
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

    const clash = await db.ticket.findFirst({
      where: { barcodeValue: { in: tickets.map((row) => row.barcodeValue) } },
      select: { barcodeValue: true },
    });
    if (clash) {
      throw new ApiError(
        "VALIDATION_ERROR",
        `Pack number ${pack.packNumber} is already used for ${pack.game.gameNumber}. Receive this pack again with a different pack number.`,
        409,
      );
    }

    const activated = await db.$transaction(
      async (tx) => {
        await tx.ticket.createMany({ data: tickets });
        return tx.pack.update({
          where: { id: pack.id },
          data: { status: "activated", activatedAt: new Date() },
        });
      },
      { maxWait: 10_000, timeout: 20_000 },
    );

    return jsonOk({ pack: activated, ticketsCreated: tickets.length });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return apiErrorResponse(
        new ApiError(
          "VALIDATION_ERROR",
          "This pack number already has tickets for that game. Enter a different pack number.",
          409,
        ),
      );
    }
    return apiErrorResponse(error);
  }
}
