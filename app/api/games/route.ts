import { NextRequest } from "next/server";
import { apiErrorResponse, jsonOk } from "@/lib/api-error";
import { requireAuth } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const db = requirePrisma();
    const { searchParams } = new URL(request.url);
    const priceMax = searchParams.get("priceMax");
    const active = searchParams.get("active");

    const games = await db.game.findMany({
      where: {
        ...(active === "true" ? { active: true } : {}),
        ...(priceMax ? { priceCents: { lte: Number(priceMax) } } : {}),
      },
      orderBy: [{ priceCents: "asc" }, { name: "asc" }],
    });

    return jsonOk({ games });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
