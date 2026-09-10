import { notFound } from "next/navigation";
import { DisplayPoller } from "@/components/display/DisplayPoller";
import { formatCents } from "@/lib/format";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InStoreDisplayPage({
  params,
}: {
  params: Promise<{ locationId: string }>;
}) {
  const { locationId } = await params;
  const db = getPrisma();
  if (!db) notFound();

  const location = await db.location.findUnique({
    where: { id: locationId },
    include: {
      tenant: { select: { artworkLicenseApproved: true, businessName: true } },
    },
  });

  if (!location?.active) notFound();

  const packs = await db.pack.findMany({
    where: { locationId, status: "activated" },
    include: {
      game: true,
      _count: { select: { tickets: { where: { status: "in_stock" } } } },
    },
    orderBy: { game: { priceCents: "asc" } },
  });

  const available = packs.filter((pack) => pack._count.tickets > 0);
  const licensed = location.tenant.artworkLicenseApproved;

  return (
    <div className="min-h-screen bg-bg px-10 py-10 text-ink">
      <DisplayPoller />
      <header className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-small uppercase tracking-[0.2em] text-gold">
            {location.tenant.businessName}
          </p>
          <h1 className="mt-2 font-serif text-h1">{location.name}</h1>
        </div>
        <p className="text-small text-ink-soft">
          {licensed ? "Licensed artwork mode" : "Plain-text display"}
        </p>
      </header>

      {!licensed ? (
        <p className="mt-6 max-w-3xl text-body text-ink-soft">
          Official lottery artwork is not shown. This screen lists available games
          in generic text until licensing is approved.
        </p>
      ) : null}

      <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {available.map((pack) => (
          <li
            key={pack.id}
            className="rounded-lg border border-border bg-bg-secondary p-6"
          >
            <p className="text-small text-ink-soft">Game {pack.game.gameNumber}</p>
            <h2 className="mt-2 font-serif text-h3">{pack.game.name}</h2>
            <p className="mt-4 text-h2 font-serif">{formatCents(pack.game.priceCents)}</p>
            <p className="mt-2 text-small text-ink-soft">
              {pack._count.tickets} tickets remaining
            </p>
          </li>
        ))}
      </ul>

      {available.length === 0 ? (
        <p className="mt-16 text-h3 text-ink-soft">No games available right now.</p>
      ) : null}
    </div>
  );
}
