import { notFound, redirect } from "next/navigation";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
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
      game: { select: { name: true } },
      location: { select: { name: true } },
      tickets: {
        orderBy: { ticketNumber: "asc" },
        take: 20,
        select: { id: true, ticketNumber: true, barcodeValue: true, status: true },
      },
      _count: { select: { tickets: { where: { status: "in_stock" } } } },
    },
  });

  if (!pack) notFound();

  return (
    <DashboardPage
      title={`Pack ${pack.packNumber}`}
      description={`${pack.game.name} · ${pack.location.name} · ${pack.status}. ${pack._count.tickets} tickets remaining of ${pack.ticketCount}.`}
    >
      <div className="overflow-hidden rounded-lg border border-border bg-sheet">
        <table>
          <thead className="border-b border-border bg-paper-2/60">
            <tr>
              <th className="num">Ticket</th>
              <th>Barcode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pack.tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-border last:border-b-0">
                <td className="num">{ticket.ticketNumber}</td>
                <td className="font-mono text-small">{ticket.barcodeValue}</td>
                <td>{ticket.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPage>
  );
}
