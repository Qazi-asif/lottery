import { Prisma } from "@prisma/client";

type SaleTicketRow = {
  id: string;
  pack_id: string;
  game_id: string;
  price_cents: number;
};

export async function recordTicketSale(
  tx: Prisma.TransactionClient,
  row: SaleTicketRow,
  ctx: { tenantId: string; userId: string; locationId: string },
  commissionRate: number,
  soldAt: Date,
) {
  const commissionEarnedCents = Math.round(row.price_cents * commissionRate);

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
      locationId: ctx.locationId,
      ticketId: ticket.id,
      gameId: row.game_id,
      priceCents: row.price_cents,
      commissionRate,
      commissionEarnedCents,
      soldByUserId: ctx.userId,
      soldAt,
    },
  });

  return { ticket, sale };
}

export async function closePackIfEmpty(
  tx: Prisma.TransactionClient,
  packId: string,
  closedAt: Date,
) {
  const remaining = await tx.ticket.count({
    where: { packId, status: "in_stock" },
  });
  if (remaining === 0) {
    await tx.pack.update({
      where: { id: packId },
      data: { status: "closed", closedAt },
    });
  }
  return remaining;
}

export async function closeEmptyPacks(
  tx: Prisma.TransactionClient,
  packIds: string[],
  closedAt: Date,
) {
  if (packIds.length === 0) return;
  await tx.$executeRaw`
    UPDATE packs AS p
    SET status = 'closed', closed_at = ${closedAt}
    WHERE p.id IN (${Prisma.join(packIds.map((id) => Prisma.sql`${id}::uuid`))})
      AND NOT EXISTS (
        SELECT 1
        FROM tickets AS t
        WHERE t.pack_id = p.id
          AND t.status = 'in_stock'
      )
  `;
}
