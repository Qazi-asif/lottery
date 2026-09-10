import { notFound, redirect } from "next/navigation";
import { getPermissionContext } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export default async function PackDetailPage({
  params,
}: {
  params: Promise<{ packId: string }>;
}) {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.role === "cashier") redirect("/dashboard/scan");

  const { packId } = await params;
  const db = requirePrisma();
  const pack = await db.pack.findFirst({
    where: { id: packId, tenantId: ctx.tenantId },
    include: {
      game: true,
      location: true,
      tickets: { orderBy: { ticketNumber: "asc" }, take: 20 },
      _count: { select: { tickets: { where: { status: "in_stock" } } } },
    },
  });

  if (!pack) notFound();

  return (
    <div>
      <h1 className="font-serif text-h2 font-semibold">Pack {pack.packNumber}</h1>
      <p className="mt-2 text-body text-ink-soft">
        {pack.game.name} · {pack.location.name} · {pack.status}
      </p>
      <p className="mt-4 text-body text-ink-soft">
        {pack._count.tickets} tickets remaining of {pack.ticketCount}
      </p>
      <div className="mt-8 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left">
          <thead className="border-b border-border bg-bg-secondary">
            <tr>
              <th className="px-4 py-3 text-small font-medium text-ink-soft">Ticket</th>
              <th className="px-4 py-3 text-small font-medium text-ink-soft">Barcode</th>
              <th className="px-4 py-3 text-small font-medium text-ink-soft">Status</th>
            </tr>
          </thead>
          <tbody>
            {pack.tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3">{ticket.ticketNumber}</td>
                <td className="px-4 py-3 font-sans text-small">{ticket.barcodeValue}</td>
                <td className="px-4 py-3">{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
