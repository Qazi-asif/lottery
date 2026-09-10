import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  assertLocationAccess,
  requireFeature,
  requireRoleAtLeast,
} from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

const GROUP_BY = ["day", "week", "month", "game", "location"] as const;
type GroupBy = (typeof GROUP_BY)[number];

export async function GET(request: NextRequest) {
  try {
    const ctx = await requireRoleAtLeast("location_manager");
    requireFeature(ctx, "commission_reports");

    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId") ?? undefined;
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const groupBy = (searchParams.get("groupBy") ?? "day") as GroupBy;

    if (!GROUP_BY.includes(groupBy)) {
      throw new ApiError("VALIDATION_ERROR", "Invalid groupBy value", 400);
    }

    if (locationId) {
      assertLocationAccess(ctx, locationId);
    }

    const db = requirePrisma();
    const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();

    const locationFilter =
      locationId
        ? Prisma.sql`AND s.location_id = ${locationId}::uuid`
        : ctx.locationIds && ctx.locationIds.length > 0
          ? Prisma.sql`AND s.location_id IN (${Prisma.join(ctx.locationIds.map((id) => Prisma.sql`${id}::uuid`))})`
          : ctx.locationIds
            ? Prisma.sql`AND FALSE`
            : Prisma.sql``;

    const bucket =
      groupBy === "game"
        ? Prisma.sql`g.name`
        : groupBy === "location"
          ? Prisma.sql`l.name`
          : groupBy === "week"
            ? Prisma.sql`to_char(date_trunc('week', s.sold_at), 'YYYY-"W"IW')`
            : groupBy === "month"
              ? Prisma.sql`to_char(date_trunc('month', s.sold_at), 'YYYY-MM')`
              : Prisma.sql`to_char(s.sold_at, 'YYYY-MM-DD')`;

    const rows = await db.$queryRaw<
      Array<{
        bucket: string;
        ticket_count: bigint;
        sales_cents: bigint;
        commission_cents: bigint;
      }>
    >(Prisma.sql`
      SELECT ${bucket} AS bucket,
             COUNT(*)::bigint AS ticket_count,
             COALESCE(SUM(s.price_cents), 0)::bigint AS sales_cents,
             COALESCE(SUM(s.commission_earned_cents), 0)::bigint AS commission_cents
      FROM sales s
      INNER JOIN games g ON g.id = s.game_id
      INNER JOIN locations l ON l.id = s.location_id
      WHERE s.tenant_id = ${ctx.tenantId}::uuid
        AND s.sold_at >= ${fromDate}
        AND s.sold_at <= ${toDate}
        ${locationFilter}
      GROUP BY 1
      ORDER BY 1 ASC
    `);

    return jsonOk({
      groupBy,
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
      totals: rows.reduce(
        (acc, row) => ({
          ticketCount: acc.ticketCount + Number(row.ticket_count),
          salesCents: acc.salesCents + Number(row.sales_cents),
          commissionCents: acc.commissionCents + Number(row.commission_cents),
        }),
        { ticketCount: 0, salesCents: 0, commissionCents: 0 },
      ),
      rows: rows.map((row) => ({
        bucket: row.bucket,
        ticketCount: Number(row.ticket_count),
        salesCents: Number(row.sales_cents),
        commissionCents: Number(row.commission_cents),
      })),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
