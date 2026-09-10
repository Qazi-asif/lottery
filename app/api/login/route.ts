import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import { getPrisma } from "@/lib/prisma";
import { applySessionCookie } from "@/lib/session-cookie";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";

    if (!email || !password) {
      throw new ApiError("VALIDATION_ERROR", "Email and password are required", 400);
    }

    const db = getPrisma();
    if (!db) {
      throw new ApiError("VALIDATION_ERROR", "Database is not configured", 500);
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user?.passwordHash) {
      throw new ApiError("UNAUTHORIZED", "Invalid email or password", 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new ApiError("UNAUTHORIZED", "Invalid email or password", 401);
    }

    const response = jsonOk({ ok: true });
    await applySessionCookie(response, {
      id: user.id,
      email: user.email,
      name: user.name,
      tenantId: user.tenantId,
      role: user.role,
    });
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
