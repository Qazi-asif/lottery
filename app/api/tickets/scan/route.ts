import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  assertLocationAccess,
  requireActiveBilling,
  requireFeature,
  requireRoleAtLeast,
} from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const ctx = await requireRoleAtLeast("cashier");
    requireActiveBilling(ctx);
    requireFeature(ctx, "inventory");

    const body = (await request.json()) as {
      barcodeValue?: string;
      locationId?: string;
    };
    const barcodeValue = body.barcodeValue?.trim();
    const locationId = body.locationId?.trim();

    if (!barcodeValue || !locationId) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "barcodeValue and locationId are required",
        400,
      );
    }

    assertLocationAccess(ctx, locationId);
    const db = requirePrisma();

    const result = await db.$transaction(async (tx) => {
      const rows = await tx.$queryRaw<
        Array<{
          id: string;
          status: string;
          pack_id: string;
          ticket_number: number;
          barcode_value: string;
          game_id: string;
          game_name: string;
          price_cents: number;
          pack_status: string;
        }>
      >(Prisma.sql`
        SELECT t.id, t.status, t.pack_id, t.ticket_number, t.barcode_value,
               g.id AS game_id, g.name AS game_name, g.price_cents,
               p.status AS pack_status
        FROM tickets t
        INNER JOIN packs p ON p.id = t.pack_id
        INNER JOIN games g ON g.id = p.game_id
        WHERE t.barcode_value = ${barcodeValue}
          AND p.location_id = ${locationId}::uuid
          AND p.tenant_id = ${ctx.tenantId}::uuid
        FOR UPDATE OF t
      `);

      const row = rows[0];
      if (!row) {
        throw new ApiError("NOT_FOUND", "Ticket not found at this location", 404);
      }
      if (row.pack_status !== "activated") {
        throw new ApiError("PACK_NOT_ACTIVATED", "This pack is not activated", 409);
      }
      if (row.status !== "in_stock") {
        throw new ApiError("TICKET_ALREADY_SOLD", "This ticket has already been sold", 409);
      }

      const settings = await tx.settings.findUnique({
        where: { tenantId: ctx.tenantId },
      });
      const commissionRate = settings ? Number(settings.commissionRate) : 0.05;
      const commissionEarnedCents = Math.round(row.price_cents * commissionRate);
      const soldAt = new Date();

      const ticket = await tx.ticket.update({
        where: { id: row.id },
        data: {
          status: "sold",
          soldAt,
          soldByUserId: ctx.userId,
        },
      });

      const sale = await tx.sale.create({
        data: {
          tenantId: ctx.tenantId,
          locationId,
          ticketId: ticket.id,
          gameId: row.game_id,
          priceCents: row.price_cents,
          commissionRate,
          commissionEarnedCents,
          soldByUserId: ctx.userId,
          soldAt,
        },
      });

      const remaining = await tx.ticket.count({
        where: { packId: row.pack_id, status: "in_stock" },
      });
      if (remaining === 0) {
        await tx.pack.update({
          where: { id: row.pack_id },
          data: { status: "closed", closedAt: soldAt },
        });
      }

      return {
        ticket,
        sale,
        gameName: row.game_name,
        price: row.price_cents,
      };
    });

    return jsonOk(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
