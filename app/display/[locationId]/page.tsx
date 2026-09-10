import { notFound } from "next/navigation";
import { DisplayPoller } from "@/components/display/DisplayPoller";
import { formatCents } from "@/lib/format";
import { getPrisma, loose } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function displayLanguage(value: unknown): "en" | "es" | "bilingual" {
  if (value === "es" || value === "bilingual") return value;
  return "en";
}

const COPY = {
  en: {
    remaining: (n: number) => `${n} tickets remaining`,
    none: "No games available right now.",
    plain: "Plain-text display",
    licensed: "Licensed artwork mode",
    licenseNote:
      "Official lottery artwork is not shown. This screen lists available games in generic text until licensing is approved.",
  },
  es: {
    remaining: (n: number) => `${n} boletos restantes`,
    none: "No hay juegos disponibles ahora.",
    plain: "Pantalla de texto",
    licensed: "Modo de arte con licencia",
    licenseNote:
      "No se muestra arte oficial de la lotería. Esta pantalla lista juegos en texto genérico hasta que se apruebe la licencia.",
  },
};

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
      displayConfigs: {
        take: 1,
        select: loose({
          layout: true,
          theme: true,
          binAssignments: true,
          showWinners: true,
          language: true,
        }),
      },
    },
  });

  if (!location?.active) notFound();

  const config = location.displayConfigs[0];
  const language = displayLanguage(
    config && "language" in config ? config.language : undefined,
  );
  const theme = config?.theme ?? "plain";
  const layout = config?.layout ?? "landscape";

  const packs = await db.pack.findMany({
    where: { locationId, status: "activated" },
    include: {
      game: true,
      _count: { select: { tickets: { where: { status: "in_stock" } } } },
    },
    orderBy: { game: { priceCents: "asc" } },
  });

  const available = packs.filter((pack) => pack._count.tickets > 0);
  const bins = (config?.binAssignments ?? {}) as Record<string, string>;
  const binEntries = Object.entries(bins)
    .filter(([, gameId]) => gameId)
    .sort((a, b) => Number(a[0]) - Number(b[0]));
  const gameToBin = new Map(binEntries.map(([bin, gameId]) => [gameId, bin]));

  const ordered = [...available].sort((a, b) => {
    const binA = gameToBin.get(a.gameId);
    const binB = gameToBin.get(b.gameId);
    if (binA && binB) return Number(binA) - Number(binB);
    if (binA) return -1;
    if (binB) return 1;
    return a.game.priceCents - b.game.priceCents;
  });

  const licensed = location.tenant.artworkLicenseApproved;
  const showWinners = config?.showWinners ?? true;
  const themeClass =
    theme === "night"
      ? "min-h-screen bg-ink px-10 py-10 text-bg"
      : theme === "high_contrast"
        ? "min-h-screen bg-bg px-10 py-10 text-ink"
        : "min-h-screen bg-bg px-10 py-10 text-ink";

  function line(key: "remaining" | "none" | "plain" | "licensed" | "licenseNote", n?: number) {
    if (language === "es") {
      return key === "remaining" ? COPY.es.remaining(n ?? 0) : COPY.es[key];
    }
    if (language === "bilingual") {
      if (key === "remaining") {
        return `${COPY.en.remaining(n ?? 0)} / ${COPY.es.remaining(n ?? 0)}`;
      }
      return `${COPY.en[key]} / ${COPY.es[key]}`;
    }
    return key === "remaining" ? COPY.en.remaining(n ?? 0) : COPY.en[key];
  }

  return (
    <div className={`${themeClass} ${layout === "portrait" ? "max-w-3xl mx-auto" : ""}`}>
      <DisplayPoller />
      <header className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-small uppercase tracking-[0.2em] text-gold">
            {location.tenant.businessName}
          </p>
          <h1 className="mt-2 font-serif text-h1">{location.name}</h1>
        </div>
        <p className="text-small text-ink-soft">
          {licensed ? line("licensed") : line("plain")}
        </p>
      </header>

      {!licensed ? (
        <p className="mt-6 max-w-3xl text-body text-ink-soft">{line("licenseNote")}</p>
      ) : null}

      <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ordered.map((pack) => (
          <li
            key={pack.id}
            className={`rounded-lg border p-6 ${
              theme === "night"
                ? "border-white/20 bg-white/5"
                : "border-border bg-bg-secondary"
            }`}
          >
            {gameToBin.get(pack.gameId) ? (
              <p className="text-small text-gold">Bin {gameToBin.get(pack.gameId)}</p>
            ) : null}
            <p className="text-small opacity-70">Game {pack.game.gameNumber}</p>
            <h2 className="mt-2 font-serif text-h3">{pack.game.name}</h2>
            <p className="mt-4 font-serif text-h2">{formatCents(pack.game.priceCents)}</p>
            {showWinners ? (
              <p className="mt-2 text-small opacity-70">{line("remaining", pack._count.tickets)}</p>
            ) : null}
          </li>
        ))}
      </ul>

      {ordered.length === 0 ? (
        <p className="mt-16 text-h3 opacity-70">{line("none")}</p>
      ) : null}
    </div>
  );
}
