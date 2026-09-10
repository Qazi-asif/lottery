import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import { hashPasswordSetToken } from "@/lib/password-token";
import { requirePrisma } from "@/lib/prisma";
import { applySessionCookie } from "@/lib/session-cookie";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { token?: string; password?: string };
    const token = body.token?.trim();
    const password = body.password ?? "";

    if (!token || password.length < 8) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "A valid token and password of at least 8 characters are required",
        400,
      );
    }

    const db = requirePrisma();
    const hash = hashPasswordSetToken(token);
    const user = await db.user.findFirst({
      where: {
        passwordSetToken: hash,
        passwordSetTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new ApiError("VALIDATION_ERROR", "This set-password link is invalid or expired", 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordSetToken: null,
        passwordSetTokenExpires: null,
      },
    });

    const response = jsonOk({ ok: true });
    await applySessionCookie(response, {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      tenantId: updated.tenantId,
      role: updated.role,
    });
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
