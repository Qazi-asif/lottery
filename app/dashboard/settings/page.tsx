import { redirect } from "next/navigation";
import { SettingsManager } from "./SettingsManager";
import { getPermissionContext } from "@/lib/permissions";
import { createReferralCode } from "@/lib/referral-code";
import { loose, requirePrisma, stringField } from "@/lib/prisma";

export default async function SettingsPage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.role !== "tenant_owner") redirect("/dashboard");
  if (ctx.billingRestricted) redirect("/dashboard/billing");

  const db = requirePrisma();
  let tenant = await db.tenant.findUnique({
    where: { id: ctx.tenantId },
    select: loose({
      referralCode: true,
      businessName: true,
      ownerName: true,
      ownerPhone: true,
    }),
  });
  if (tenant && !stringField(tenant, "referralCode")) {
    tenant = await db.tenant.update({
      where: { id: ctx.tenantId },
      data: loose({ referralCode: createReferralCode() }),
      select: loose({
        referralCode: true,
        businessName: true,
        ownerName: true,
        ownerPhone: true,
      }),
    });
  }
  const [settings, referrals] = await Promise.all([
    db.settings.findUnique({ where: { tenantId: ctx.tenantId } }),
    ctx.features.referrals
      ? db.referral.findMany({
          where: { tenantId: ctx.tenantId },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  return (
    <SettingsManager
      referralCode={stringField(tenant, "referralCode")}
      referrals={ctx.features.referrals ? referrals : []}
      canRefer={ctx.features.referrals}
      tenant={{
        businessName: stringField(tenant, "businessName") ?? "",
        ownerName: stringField(tenant, "ownerName") ?? "",
        ownerPhone: stringField(tenant, "ownerPhone") ?? "",
      }}
      settings={{
        commissionRate: Number(settings?.commissionRate ?? 0.05),
        cashingBonusRate: Number(settings?.cashingBonusRate ?? 0),
        lowStockThreshold: settings?.lowStockThreshold ?? 10,
      }}
    />
  );
}
