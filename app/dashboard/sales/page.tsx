import Link from "next/link";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { formatCents } from "@/lib/format";
import { getPermissionContext } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{ groupBy?: string }>;
}) {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.billingRestricted) redirect("/dashboard/billing");
  if (ctx.role === "cashier") redirect("/dashboard/scan");
  if (!ctx.features.commission_reports) redirect("/dashboard");

  const { groupBy: groupParam } = await searchParams;
  const groupBy = ["day", "week", "month", "game", "location"].includes(groupParam ?? "")
    ? groupParam!
    : "day";

  const db = requirePrisma();

  const locationFilter =
    ctx.locationIds && ctx.locationIds.length > 0
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
      ${locationFilter}
    GROUP BY 1
    ORDER BY 1 ASC
  `);

  const totals = rows.reduce(
    (acc, row) => ({
      ticketCount: acc.ticketCount + Number(row.ticket_count),
      salesCents: acc.salesCents + Number(row.sales_cents),
      commissionCents: acc.commissionCents + Number(row.commission_cents),
    }),
    { ticketCount: 0, salesCents: 0, commissionCents: 0 },
  );

  return (
    <DashboardPage
      title="Sales & commission"
      description="Figures are stored at sale time and not recalculated later."
    >
      <div className="inline-flex flex-wrap gap-1 rounded-md border border-border bg-sheet p-1">
        {["day", "week", "month", "game", "location"].map((key) => (
          <Link
            key={key}
            href={`/dashboard/sales?groupBy=${key}`}
            prefetch
            className={`rounded-sm px-3 py-1.5 text-small capitalize ${
              groupBy === key ? "bg-paper-2 font-medium text-ink" : "text-ink-soft hover:text-ink"
            }`}
          >
            {key}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-sheet px-5 py-4">
          <p className="text-small text-ink-soft">Tickets</p>
          <p className="mt-2 font-mono text-[1.5rem] font-semibold tabular-nums">{totals.ticketCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-sheet px-5 py-4">
          <p className="text-small text-ink-soft">Sales</p>
          <p className="mt-2 font-mono text-[1.5rem] font-semibold tabular-nums">{formatCents(totals.salesCents)}</p>
        </div>
        <div className="rounded-lg border border-border bg-sheet px-5 py-4">
          <p className="text-small text-ink-soft">Commission</p>
          <p className="mt-2 font-mono text-[1.5rem] font-semibold tabular-nums">{formatCents(totals.commissionCents)}</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-sheet">
        <table>
          <thead className="border-b border-border bg-paper-2/60">
            <tr>
              <th>{groupBy}</th>
              <th className="num">Tickets</th>
              <th className="num">Sales</th>
              <th className="num">Commission</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.bucket} className="border-b border-border last:border-b-0">
                <td>{row.bucket}</td>
                <td className="num">{Number(row.ticket_count)}</td>
                <td className="num">{formatCents(Number(row.sales_cents))}</td>
                <td className="num">{formatCents(Number(row.commission_cents))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPage>
  );
}
