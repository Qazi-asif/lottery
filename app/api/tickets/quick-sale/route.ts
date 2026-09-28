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
import { closeEmptyPacks } from "@/lib/sell-tickets";

const MAX_QUANTITY = 100;

export async function POST(request: NextRequest) {
  try {
    const ctx = await requireRoleAtLeast("cashier");
    requireActiveBilling(ctx);
    requireFeature(ctx, "inventory");

    const body = (await request.json()) as {
      locationId?: string;
      gameId?: string;
      quantity?: number;
    };
    const locationId = body.locationId?.trim();
    const gameId = body.gameId?.trim();
    const quantity = Number(body.quantity);

    if (!locationId || !gameId) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "locationId, gameId, and quantity are required",
        400,
      );
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new ApiError(
        "VALIDATION_ERROR",
        `quantity must be a whole number from 1 to ${MAX_QUANTITY}`,
        400,
      );
    }

    assertLocationAccess(ctx, locationId);
    const db = requirePrisma();

    const result = await db.$transaction(
      async (tx) => {
        const rows = await tx.$queryRaw<
          Array<{
            id: string;
            pack_id: string;
            ticket_number: number;
            barcode_value: string;
            game_id: string;
            game_name: string;
            price_cents: number;
          }>
        >(Prisma.sql`
          SELECT t.id, t.pack_id, t.ticket_number, t.barcode_value,
                 g.id AS game_id, g.name AS game_name, g.price_cents
          FROM tickets t
          INNER JOIN packs p ON p.id = t.pack_id
          INNER JOIN games g ON g.id = p.game_id
          WHERE g.id = ${gameId}::uuid
            AND p.location_id = ${locationId}::uuid
            AND p.tenant_id = ${ctx.tenantId}::uuid
            AND p.status = 'activated'
            AND t.status = 'in_stock'
          ORDER BY p.activated_at ASC NULLS LAST, t.ticket_number ASC
          LIMIT ${quantity}
          FOR UPDATE OF t
        `);

        if (rows.length === 0) {
          throw new ApiError(
            "NOT_FOUND",
            "No activated tickets for this game at this location",
            404,
          );
        }
        if (rows.length < quantity) {
          throw new ApiError(
            "INSUFFICIENT_STOCK",
            `Only ${rows.length} ticket${rows.length === 1 ? "" : "s"} left on activated packs`,
            409,
          );
        }

        const settings = await tx.settings.findUnique({
          where: { tenantId: ctx.tenantId },
        });
        const commissionRate = settings ? Number(settings.commissionRate) : 0.05;
        const soldAt = new Date();
        const ids = rows.map((row) => row.id);
        const packIds = [...new Set(rows.map((row) => row.pack_id))];

        await tx.ticket.updateMany({
          where: { id: { in: ids } },
          data: {
            status: "sold",
            soldAt,
            soldByUserId: ctx.userId,
          },
        });

        await tx.sale.createMany({
          data: rows.map((row) => ({
            tenantId: ctx.tenantId,
            locationId,
            ticketId: row.id,
            gameId: row.game_id,
            priceCents: row.price_cents,
            commissionRate,
            commissionEarnedCents: Math.round(row.price_cents * commissionRate),
            soldByUserId: ctx.userId,
            soldAt,
          })),
        });

        await closeEmptyPacks(tx, packIds, soldAt);

        const remainingRows = await tx.$queryRaw<Array<{ count: bigint }>>(
          Prisma.sql`
            SELECT COUNT(*)::bigint AS count
            FROM tickets t
            INNER JOIN packs p ON p.id = t.pack_id
            WHERE p.tenant_id = ${ctx.tenantId}::uuid
              AND p.location_id = ${locationId}::uuid
              AND p.game_id = ${gameId}::uuid
              AND p.status = 'activated'
              AND t.status = 'in_stock'
          `,
        );
        const remaining = Number(remainingRows[0]?.count ?? 0);
        const priceCents = rows[0].price_cents;

        return {
          gameName: rows[0].game_name,
          priceCents,
          quantity: rows.length,
          totalCents: priceCents * rows.length,
          remaining,
          tickets: rows.map((row) => ({
            ticketNumber: row.ticket_number,
            barcodeValue: row.barcode_value,
          })),
        };
      },
      { maxWait: 10_000, timeout: 20_000 },
    );

    return jsonOk(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
