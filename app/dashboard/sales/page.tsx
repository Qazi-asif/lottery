import Link from "next/link";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { formatCents, formatDayInput, formatSoldAt } from "@/lib/format";
import {
  getPermissionContext,
  locationWhere,
} from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

const GROUP_KEYS = ["day", "week", "month", "game", "location"] as const;
type GroupBy = (typeof GROUP_KEYS)[number];

const GROUP_LABELS: Record<GroupBy, string> = {
  day: "Date",
  week: "Week",
  month: "Month",
  game: "Game",
  location: "Store",
};

const LOG_LIMIT = 200;

function parseGroupBy(value: string | undefined): GroupBy {
  return GROUP_KEYS.includes(value as GroupBy) ? (value as GroupBy) : "day";
}

function parseDay(value: string | undefined, fallback: Date): Date {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return fallback;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function salesHref(params: {
  groupBy: string;
  from: string;
  to: string;
  locationId?: string;
}) {
  const query = new URLSearchParams({
    groupBy: params.groupBy,
    from: params.from,
    to: params.to,
  });
  if (params.locationId) query.set("locationId", params.locationId);
  return `/dashboard/sales?${query.toString()}`;
}

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{
    groupBy?: string;
    locationId?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.billingRestricted) redirect("/dashboard/billing");
  if (ctx.role === "cashier") redirect("/dashboard/sell");
  if (!ctx.features.commission_reports) redirect("/dashboard");

  const params = await searchParams;
  const groupBy = parseGroupBy(params.groupBy);
  const today = new Date();
  const defaultFrom = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const fromDate = parseDay(params.from, defaultFrom);
  const toStart = parseDay(params.to, today);
  const toExclusive = new Date(toStart.getTime() + 24 * 60 * 60 * 1000);
  const from = formatDayInput(fromDate);
  const to = formatDayInput(toStart);

  const db = requirePrisma();
  const locations = await db.location.findMany({
    where: locationWhere(ctx),
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  const allowedIds = new Set(locations.map((location) => location.id));
  const locationId =
    params.locationId && allowedIds.has(params.locationId)
      ? params.locationId
      : undefined;

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
      ? Prisma.sql`(g.game_number || ' · ' || g.name)`
      : groupBy === "location"
        ? Prisma.sql`l.name`
        : groupBy === "week"
          ? Prisma.sql`to_char(date_trunc('week', s.sold_at), 'YYYY-"W"IW')`
          : groupBy === "month"
            ? Prisma.sql`to_char(date_trunc('month', s.sold_at), 'YYYY-MM')`
            : Prisma.sql`to_char(s.sold_at, 'YYYY-MM-DD')`;

  const saleWhere = {
    tenantId: ctx.tenantId,
    soldAt: { gte: fromDate, lt: toExclusive },
    ...(locationId
      ? { locationId }
      : ctx.locationIds
        ? { locationId: { in: ctx.locationIds } }
        : {}),
  };

  const [rows, sales] = await Promise.all([
    db.$queryRaw<
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
        AND s.sold_at < ${toExclusive}
        ${locationFilter}
      GROUP BY 1
      ORDER BY 1 ASC
    `),
    db.sale.findMany({
      where: saleWhere,
      select: {
        id: true,
        soldAt: true,
        priceCents: true,
        commissionEarnedCents: true,
        game: { select: { name: true, gameNumber: true } },
        location: { select: { name: true } },
        soldByUser: { select: { name: true } },
        ticket: {
          select: {
            ticketNumber: true,
            pack: { select: { packNumber: true } },
          },
        },
      },
      orderBy: { soldAt: "desc" },
      take: LOG_LIMIT,
    }),
  ]);

  const totals = rows.reduce(
    (acc, row) => ({
      ticketCount: acc.ticketCount + Number(row.ticket_count),
      salesCents: acc.salesCents + Number(row.sales_cents),
      commissionCents: acc.commissionCents + Number(row.commission_cents),
    }),
    { ticketCount: 0, salesCents: 0, commissionCents: 0 },
  );
  const logTruncated = totals.ticketCount > sales.length;

  return (
    <DashboardPage
      title="Sales & commission"
      description="Every ticket sale is logged with the game, pack, and store. Figures are stored at sale time and not recalculated later."
    >
      <form
        method="get"
        className="grid items-end gap-3 rounded-lg border border-border bg-sheet p-5 md:grid-cols-4"
      >
        <input type="hidden" name="groupBy" value={groupBy} />
        <label>
          Store
          <select
            name="locationId"
            defaultValue={locationId ?? ""}
            className="mt-1.5 w-full"
          >
            <option value="">All stores</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          From
          <input
            type="date"
            name="from"
            defaultValue={from}
            className="mt-1.5 w-full"
          />
        </label>
        <label>
          To
          <input
            type="date"
            name="to"
            defaultValue={to}
            className="mt-1.5 w-full"
          />
        </label>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-ink px-4 text-small font-medium text-paper hover:bg-ink-deep"
        >
          Apply
        </button>
      </form>

      <div className="mt-6 inline-flex flex-wrap gap-1 rounded-md border border-border bg-sheet p-1">
        {GROUP_KEYS.map((key) => (
          <Link
            key={key}
            href={salesHref({ groupBy: key, from, to, locationId })}
            prefetch
            className={`rounded-sm px-3 py-1.5 text-small ${
              groupBy === key
                ? "bg-paper-2 font-medium text-ink"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {GROUP_LABELS[key]}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-sheet px-5 py-4">
          <p className="text-small text-ink-soft">Tickets</p>
          <p className="mt-2 font-mono text-[1.5rem] font-semibold tabular-nums">
            {totals.ticketCount}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-sheet px-5 py-4">
          <p className="text-small text-ink-soft">Sales</p>
          <p className="mt-2 font-mono text-[1.5rem] font-semibold tabular-nums">
            {formatCents(totals.salesCents)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-sheet px-5 py-4">
          <p className="text-small text-ink-soft">Commission</p>
          <p className="mt-2 font-mono text-[1.5rem] font-semibold tabular-nums text-money">
            {formatCents(totals.commissionCents)}
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto overflow-hidden rounded-lg border border-border bg-sheet">
        <table>
          <thead className="border-b border-border bg-paper-2/60">
            <tr>
              <th>{GROUP_LABELS[groupBy]}</th>
              <th className="num">Tickets</th>
              <th className="num">Sales</th>
              <th className="num">Commission</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-ink-soft">
                  No sales in this range.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.bucket} className="border-b border-border last:border-b-0">
                  <td>{row.bucket}</td>
                  <td className="num">{Number(row.ticket_count)}</td>
                  <td className="num">{formatCents(Number(row.sales_cents))}</td>
                  <td className="num">
                    {formatCents(Number(row.commission_cents))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-base font-semibold">Sale log</h2>
        <p className="mt-1 text-small text-ink-soft">
          {logTruncated
            ? `Game, pack number, and store for each ticket sold. Showing the ${LOG_LIMIT} most recent in this range.`
            : "Game, pack number, and store for each ticket sold."}
        </p>
      </div>

      <div className="mt-4 overflow-x-auto overflow-hidden rounded-lg border border-border bg-sheet">
        <table>
          <thead className="border-b border-border bg-paper-2/60">
            <tr>
              <th>When</th>
              <th>Game</th>
              <th>Pack</th>
              <th>Store</th>
              <th className="num">Ticket</th>
              <th className="num">Price</th>
              <th className="num">Commission</th>
              <th>Sold by</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-ink-soft">
                  No ticket sales in this range.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="border-b border-border last:border-b-0">
                  <td className="whitespace-nowrap text-ink-soft">
                    {formatSoldAt(sale.soldAt)}
                  </td>
                  <td>
                    <span className="font-medium">{sale.game.name}</span>
                    <span className="mt-0.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                      {sale.game.gameNumber}
                    </span>
                  </td>
                  <td className="font-mono text-small">
                    {sale.ticket.pack.packNumber}
                  </td>
                  <td>{sale.location.name}</td>
                  <td className="num font-mono">
                    {String(sale.ticket.ticketNumber).padStart(3, "0")}
                  </td>
                  <td className="num">{formatCents(sale.priceCents)}</td>
                  <td className="num">
                    {formatCents(sale.commissionEarnedCents)}
                  </td>
                  <td>{sale.soldByUser.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardPage>
  );
}
