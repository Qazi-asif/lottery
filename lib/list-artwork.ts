import { existsSync, readdirSync } from "fs";
import path from "path";
import { ARTWORK_PRICES, type ArtworkTicket } from "@/lib/display-artwork";

/**
 * Local ticket faces dropped in public/display/artwork/Lottery tickets/$N.
 * Folder names are the price point; file prefixes are the game number.
 * Server-only — do not import this from a client component.
 */
const ROOT = path.join(process.cwd(), "public", "display", "artwork", "Lottery tickets");

export function listArtworkTickets(): ArtworkTicket[] {
  const tickets: ArtworkTicket[] = [];

  for (const priceCents of ARTWORK_PRICES) {
    const folder = `$${priceCents / 100}`;
    const dir = path.join(ROOT, folder);
    if (!existsSync(dir)) continue;

    const files = readdirSync(dir).filter((file) =>
      /\.(jpe?g|png|webp)$/i.test(file),
    );

    for (const file of files) {
      const gameNumber = file.replace(/_200X200/i, "").replace(/\.(jpe?g|png|webp)$/i, "");
      tickets.push({
        gameNumber,
        priceCents,
        src: [
          "/display/artwork",
          encodeURIComponent("Lottery tickets"),
          encodeURIComponent(folder),
          encodeURIComponent(file),
        ].join("/"),
      });
    }
  }

  return tickets;
}
