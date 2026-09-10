import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const ALLOWED = new Set([
  "store-counter.png",
  "scan-register.png",
  "instore-display.png",
  "laptop-dashboard.png",
  "geometric-panel.png",
]);

async function resolveAsset(file: string) {
  const candidates = [
    path.join(process.cwd(), "public", "marketing", file),
    path.join(process.cwd(), "assets", file),
    path.join(
      process.env.USERPROFILE ?? "",
      ".cursor",
      "projects",
      "c-Users-hp-Desktop-Lottery",
      "assets",
      file,
    ),
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      /* try next */
    }
  }

  return null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ file: string }> },
) {
  const { file } = await context.params;
  if (!ALLOWED.has(file)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const assetPath = await resolveAsset(file);
  if (!assetPath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await readFile(assetPath);
  return new NextResponse(new Uint8Array(body), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
