import { getPrisma } from "@/lib/prisma";
import { parsePlanFeatures, type PlanFeatures } from "@/lib/plan-features";

const PREVIEW_PLANS = [
  {
    id: "preview-lite",
    name: "Lite",
    priceMonthlyCents: 4900,
    priceAnnualCents: 47000,
    features: {
      inventory: true,
      display: false,
      multi_location: false,
      commission_reports: false,
      alerts: true,
      cash_reconciliation: false,
      pack_transfer: false,
      referrals: false,
    } satisfies PlanFeatures,
  },
  {
    id: "preview-essential",
    name: "Essential",
    priceMonthlyCents: 9900,
    priceAnnualCents: 95000,
    features: {
      inventory: true,
      display: false,
      multi_location: false,
      commission_reports: true,
      alerts: true,
      cash_reconciliation: false,
      pack_transfer: false,
      referrals: true,
    } satisfies PlanFeatures,
  },
  {
    id: "preview-smart",
    name: "Smart",
    priceMonthlyCents: 17900,
    priceAnnualCents: 171000,
    features: {
      inventory: true,
      display: true,
      multi_location: true,
      commission_reports: true,
      alerts: true,
      cash_reconciliation: true,
      pack_transfer: true,
      referrals: true,
    } satisfies PlanFeatures,
  },
  {
    id: "preview-premium",
    name: "Premium",
    priceMonthlyCents: 29900,
    priceAnnualCents: 287000,
    features: {
      inventory: true,
      display: true,
      multi_location: true,
      commission_reports: true,
      alerts: true,
      cash_reconciliation: true,
      pack_transfer: true,
      referrals: true,
    } satisfies PlanFeatures,
  },
];

export async function getActivePlans() {
  const db = getPrisma();
  if (!db) return PREVIEW_PLANS;

  try {
    const plans = await db.plan.findMany({
      where: { active: true },
      orderBy: { priceMonthlyCents: "asc" },
    });

    if (plans.length === 0) return PREVIEW_PLANS;

    return plans.map((plan) => ({
      ...plan,
      features: parsePlanFeatures(plan.features),
    }));
  } catch (error) {
    console.error("Failed to load plans from the database:", error);
    return PREVIEW_PLANS;
  }
}

export async function getPlanByName(name: string) {
  const db = getPrisma();
  if (!db) return null;

  try {
    const plan = await db.plan.findFirst({
      where: { name, active: true },
    });

    if (!plan) return null;

    return {
      ...plan,
      features: parsePlanFeatures(plan.features),
    };
  } catch (error) {
    console.error("Failed to load plan from the database:", error);
    return null;
  }
}
