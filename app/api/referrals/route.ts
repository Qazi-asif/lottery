import { NextRequest } from "next/server";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  requireActiveBilling,
  requireFeature,
  requireRole,
} from "@/lib/permissions";
import { requirePrisma, stringField } from "@/lib/prisma";

export async function GET() {
  try {
    const ctx = await requireRole("tenant_owner");
    requireFeature(ctx, "referrals");
    const db = requirePrisma();
    const referrals = await db.referral.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: { createdAt: "desc" },
    });
    const tenant = await db.tenant.findUnique({
      where: { id: ctx.tenantId },
    });
    return jsonOk({
      referralCode: stringField(tenant, "referralCode"),
      referrals,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await requireRole("tenant_owner");
    requireActiveBilling(ctx);
    requireFeature(ctx, "referrals");
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();
    if (!email) {
      throw new ApiError("VALIDATION_ERROR", "email is required", 400);
    }
    const db = requirePrisma();
    const existing = await db.referral.findFirst({
      where: { tenantId: ctx.tenantId, referredEmail: email },
    });
    if (existing) {
      throw new ApiError("VALIDATION_ERROR", "That email is already referred", 400);
    }
    const referral = await db.referral.create({
      data: {
        tenantId: ctx.tenantId,
        referredEmail: email,
        status: "pending",
        creditCents: 5000,
      },
    });
    return jsonOk({ referral }, 201);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
