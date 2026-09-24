import { notFound } from "next/navigation";
import { DisplayCatalog } from "@/components/display/DisplayCatalog";
import { DisplayPoller } from "@/components/display/DisplayPoller";
import { listArtworkTickets } from "@/lib/list-artwork";
import { getPrisma, loose } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function displayLanguage(value: unknown): "en" | "es" | "bilingual" {
  if (value === "es" || value === "bilingual") return value;
  return "en";
}

const COPY = {
  en: {
    none: "No games available right now.",
    licenseNote:
      "Official lottery artwork is not shown. This screen lists available games in generic text until licensing is approved.",
  },
  es: {
    none: "No hay juegos disponibles ahora.",
    licenseNote:
      "No se muestra arte oficial de la lotería. Esta pantalla lista juegos en texto genérico hasta que se apruebe la licencia.",
  },
};

type CopyKey = keyof typeof COPY.en;

function LicenseTrack({
  text,
  hidden,
}: {
  text: string;
  hidden?: boolean;
}) {
  return (
    <p
      className="flex shrink-0 items-center gap-[2.4vw] px-[1.6vw] font-sans text-[clamp(0.95rem,1.55vw,1.55rem)] font-semibold leading-tight tracking-wide text-white"
      aria-hidden={hidden || undefined}
    >
      <span className="whitespace-nowrap">{text}</span>
      <span className="h-2 w-2 shrink-0 rotate-45 bg-foil-light" aria-hidden />
    </p>
  );
}

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
      tenant: { select: { artworkLicenseApproved: true } },
      displayConfigs: {
        take: 1,
        select: loose({
          layout: true,
          theme: true,
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
  const licensed = location.tenant.artworkLicenseApproved;
  const tickets = listArtworkTickets();
  const licenseTicker = `${COPY.en.licenseNote}  /  ${COPY.es.licenseNote}`;

  function line(key: CopyKey) {
    if (language === "es") return COPY.es[key];
    if (language === "bilingual") return `${COPY.en[key]} / ${COPY.es[key]}`;
    return COPY.en[key];
  }

  return (
    <div className="tv-glow relative flex h-screen flex-col overflow-hidden text-white">
      <DisplayPoller />

      <header className="relative z-10 flex shrink-0 items-center justify-between gap-[3vw] px-[3vw] pt-[1.6vh] pb-[1.1vh]">
        <p className="min-w-0 font-display text-[clamp(1.15rem,2.1vw,2.15rem)] font-semibold tracking-tight text-white">
          Scratch<span className="text-flag">Crest</span>
        </p>
        <div className="flex shrink-0 flex-col items-center gap-1">
          <p className="font-mono text-[clamp(0.5rem,0.62vw,0.75rem)] font-semibold uppercase tracking-[0.34em] text-white/65">
            {location.name}
          </p>
          <span className="inline-flex items-center gap-1.5">
            <span className="motion-live h-1.5 w-1.5 rounded-full bg-flag" aria-hidden />
            <span className="font-mono text-[clamp(0.45rem,0.55vw,0.65rem)] font-bold uppercase tracking-[0.22em] text-flag">
              Live
            </span>
          </span>
        </div>
        <p className="min-w-0 text-right font-display text-[clamp(1.15rem,2.1vw,2.15rem)] font-semibold tracking-tight text-white">
          Scratch<span className="text-flag">Crest</span>
        </p>
      </header>

      <div className="relative z-10 min-h-0 flex-1 px-[1.2vw] pb-[0.6vh]">
        {tickets.length > 0 ? (
          <DisplayCatalog tickets={tickets} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="font-display text-[clamp(1.25rem,2vw,2.5rem)] font-semibold text-white/70">
              {line("none")}
            </p>
          </div>
        )}
      </div>

      <footer className="relative z-10 flex shrink-0 items-stretch bg-flag text-white">
        <div className="relative min-w-0 flex-1 overflow-hidden py-[1.15vh]">
          {!licensed ? (
            <div className="tv-marquee flex w-max items-center">
              <LicenseTrack text={licenseTicker} />
              <LicenseTrack text={licenseTicker} hidden />
            </div>
          ) : null}
        </div>
        <p className="flex shrink-0 items-center bg-flag-deep px-[1.4vw] font-mono text-[clamp(0.7rem,1vw,1.05rem)] font-bold tracking-wider">
          18+
        </p>
      </footer>
    </div>
  );
}
