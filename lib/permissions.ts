import { cache } from "react";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import type { UserRole } from "@prisma/client";
import { ApiError } from "@/lib/api-error";
import { parsePlanFeatures, type PlanFeatures } from "@/lib/plan-features";
import { getPrisma } from "@/lib/prisma";
import { sessionCookieName } from "@/lib/session-cookie";

export type PermissionContext = {
  userId: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
  locationIds: string[] | null;
  features: PlanFeatures;
  subscriptionStatus: "active" | "past_due" | "canceled" | "trialing";
  stripeCustomerId: string;
  billingRestricted: boolean;
};

const ROLE_RANK: Record<UserRole, number> = {
  cashier: 1,
  location_manager: 2,
  tenant_owner: 3,
};

async function decodeSessionToken(raw: string, secret: string, salt: string) {
  // Login/set-password encode with salt = cookie name (NextAuth v4.24+).
  // Try that first; empty salt covers cookies issued by getServerSession.
  for (const decodeSalt of [salt, ""]) {
    try {
      const token = await decode({ token: raw, secret, salt: decodeSalt });
      if (token?.id && token.tenantId) {
        return {
          id: token.id,
          email: token.email ?? "",
          name: typeof token.name === "string" ? token.name : "",
          tenantId: token.tenantId,
          role: token.role,
        };
      }
    } catch {
      // Corrupt or mismatched JWT — treat as signed out.
    }
  }
  return null;
}

async function readSessionUser() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  const jar = await cookies();
  const name = sessionCookieName();
  const raw = jar.get(name)?.value;
  if (!raw) return null;

  return decodeSessionToken(raw, secret, name);
}

async function loadPermissionRow(userId: string): Promise<PermissionContext | null> {
  const db = getPrisma();
  if (!db) return null;

  let user;
  try {
    user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        tenantId: true,
        email: true,
        name: true,
        role: true,
        userLocations: { select: { locationId: true } },
        tenant: {
          select: {
            stripeCustomerId: true,
            subscriptions: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: {
                status: true,
                plan: { select: { features: true } },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to load permission row:", error);
    return null;
  }

  if (!user) return null;

  try {
    const subscription = user.tenant.subscriptions[0];
    const features = parsePlanFeatures(subscription?.plan.features);
    const subscriptionStatus = subscription?.status ?? "canceled";

    return {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      role: user.role,
      locationIds:
        user.role === "tenant_owner"
          ? null
          : user.userLocations.map((row) => row.locationId),
      features,
      subscriptionStatus,
      stripeCustomerId: user.tenant.stripeCustomerId,
      billingRestricted:
        subscriptionStatus === "past_due" || subscriptionStatus === "canceled",
    };
  } catch (error) {
    console.error("Failed to parse permission row:", error);
    return null;
  }
}

function getCachedPermissionRow(userId: string) {
  return unstable_cache(
    () => loadPermissionRow(userId),
    ["permission-row", userId],
    { revalidate: 60, tags: [`permission-${userId}`] },
  )();
}

/** Deduped per RSC request so layout + page share one session/DB round-trip. */
export const getPermissionContext = cache(
  async (): Promise<PermissionContext | null> => {
    const sessionUser = await readSessionUser();
    if (!sessionUser?.id || !sessionUser.tenantId) return null;

    const ctx = await getCachedPermissionRow(sessionUser.id);
    if (!ctx || ctx.tenantId !== sessionUser.tenantId) return null;
    return ctx;
  },
);

export async function requireAuth(): Promise<PermissionContext> {
  const ctx = await getPermissionContext();
  if (!ctx) {
    throw new ApiError("UNAUTHORIZED", "Sign in required", 401);
  }
  return ctx;
}

export async function requireRole(
  ...roles: UserRole[]
): Promise<PermissionContext> {
  const ctx = await requireAuth();
  if (!roles.includes(ctx.role)) {
    throw new ApiError(
      "FORBIDDEN_ROLE",
      "You do not have permission to perform this action",
      403,
    );
  }
  return ctx;
}

export async function requireRoleAtLeast(
  minimum: UserRole,
): Promise<PermissionContext> {
  const ctx = await requireAuth();
  if (ROLE_RANK[ctx.role] < ROLE_RANK[minimum]) {
    throw new ApiError(
      "FORBIDDEN_ROLE",
      "You do not have permission to perform this action",
      403,
    );
  }
  return ctx;
}

export function assertLocationAccess(
  ctx: PermissionContext,
  locationId: string,
) {
  if (ctx.locationIds === null) return;
  if (!ctx.locationIds.includes(locationId)) {
    throw new ApiError(
      "TENANT_MISMATCH",
      "Location is not assigned to this user",
      403,
    );
  }
}

export function locationWhere(ctx: PermissionContext) {
  if (ctx.locationIds === null) {
    return { tenantId: ctx.tenantId };
  }
  return { tenantId: ctx.tenantId, id: { in: ctx.locationIds } };
}

export function requireFeature(
  ctx: PermissionContext,
  flag: keyof PlanFeatures,
) {
  if (!ctx.features[flag]) {
    throw new ApiError(
      "FEATURE_DISABLED",
      "This feature is not included in your plan",
      403,
    );
  }
}

export function requireActiveBilling(ctx: PermissionContext) {
  if (ctx.billingRestricted) {
    throw new ApiError(
      "BILLING_RESTRICTED",
      "Update billing to continue using ScratchCrest",
      403,
    );
  }
}
