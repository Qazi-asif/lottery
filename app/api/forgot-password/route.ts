import { NextRequest } from "next/server";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import { sendPasswordSetEmail } from "@/lib/email";
import { createPasswordSetToken } from "@/lib/password-token";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();
    if (!email) {
      throw new ApiError("VALIDATION_ERROR", "Email is required", 400);
    }

    const db = getPrisma();
    if (db) {
      const user = await db.user.findUnique({ where: { email } });
      if (user) {
        const token = createPasswordSetToken();
        await db.user.update({
          where: { id: user.id },
          data: {
            passwordSetToken: token.hash,
            passwordSetTokenExpires: token.expires,
          },
        });
        await sendPasswordSetEmail({
          to: user.email,
          name: user.name,
          token: token.token,
          kind: "reset",
        });
      }
    }

    return jsonOk({ ok: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
