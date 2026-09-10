import { NextRequest } from "next/server";
import { ApiError, apiErrorResponse, jsonOk } from "@/lib/api-error";
import {
  requireActiveBilling,
  requireRole,
} from "@/lib/permissions";
import { requirePrisma, loose, stringField } from "@/lib/prisma";

export async function GET() {
  try {
    const ctx = await requireRole("tenant_owner");
    const db = requirePrisma();
    const tenant = await db.tenant.findUnique({
      where: { id: ctx.tenantId },
      select: loose({
        id: true,
        businessName: true,
        ownerName: true,
        ownerEmail: true,
        ownerPhone: true,
        referralCode: true,
        artworkLicenseApproved: true,
      }),
    });
    if (!tenant) {
      throw new ApiError("NOT_FOUND", "Tenant not found", 404);
    }
    return jsonOk({
      tenant: { ...tenant, referralCode: stringField(tenant, "referralCode") },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const ctx = await requireRole("tenant_owner");
    requireActiveBilling(ctx);
    const body = (await request.json()) as {
      businessName?: string;
      ownerName?: string;
      ownerPhone?: string;
    };
    const db = requirePrisma();
    const tenant = await db.tenant.update({
      where: { id: ctx.tenantId },
      data: {
        ...(body.businessName?.trim()
          ? { businessName: body.businessName.trim() }
          : {}),
        ...(body.ownerName?.trim() ? { ownerName: body.ownerName.trim() } : {}),
        ...(body.ownerPhone?.trim() ? { ownerPhone: body.ownerPhone.trim() } : {}),
      },
      select: loose({
        id: true,
        businessName: true,
        ownerName: true,
        ownerEmail: true,
        ownerPhone: true,
        referralCode: true,
      }),
    });
    return jsonOk({
      tenant: { ...tenant, referralCode: stringField(tenant, "referralCode") },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
