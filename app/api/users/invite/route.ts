import { NextRequest } from "next/server";
import type { UserRole } from "@prisma/client";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import { sendPasswordSetEmail } from "@/lib/email";
import { createPasswordSetToken } from "@/lib/password-token";
import {
  requireActiveBilling,
  requireRole,
} from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

const INVITE_ROLES: UserRole[] = ["location_manager", "cashier"];

export async function POST(request: NextRequest) {
  try {
    const ctx = await requireRole("tenant_owner");
    requireActiveBilling(ctx);

    const body = (await request.json()) as {
      email?: string;
      role?: UserRole;
      locationIds?: string[];
    };

    const email = body.email?.trim().toLowerCase();
    const role = body.role;
    const locationIds = body.locationIds ?? [];

    if (!email || !role || !INVITE_ROLES.includes(role)) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "A valid email and role (location_manager or cashier) are required",
        400,
      );
    }

    if (locationIds.length === 0) {
      throw new ApiError("VALIDATION_ERROR", "Assign at least one location", 400);
    }

    const db = requirePrisma();
    const locations = await db.location.findMany({
      where: { id: { in: locationIds }, tenantId: ctx.tenantId },
    });
    if (locations.length !== locationIds.length) {
      throw new ApiError("TENANT_MISMATCH", "One or more locations are invalid", 403);
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      throw new ApiError("VALIDATION_ERROR", "A user with this email already exists", 400);
    }

    const token = createPasswordSetToken();
    const user = await db.user.create({
      data: {
        tenantId: ctx.tenantId,
        email,
        name: email.split("@")[0] ?? email,
        role,
        passwordHash: null,
        passwordSetToken: token.hash,
        passwordSetTokenExpires: token.expires,
        userLocations: {
          create: locationIds.map((locationId) => ({ locationId })),
        },
      },
    });

    await sendPasswordSetEmail({
      to: email,
      name: user.name,
      token: token.token,
      kind: "invite",
    });

    return jsonOk({ id: user.id, email: user.email, role: user.role }, 201);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
