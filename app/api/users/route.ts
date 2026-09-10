import { jsonOk, apiErrorResponse } from "@/lib/api-error";
import { requireRole } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ctx = await requireRole("tenant_owner");
    const db = requirePrisma();
    const users = await db.user.findMany({
      where: { tenantId: ctx.tenantId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    return jsonOk({ users });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
