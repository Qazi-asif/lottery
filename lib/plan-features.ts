/**
 * Feature flags stored in plans.features (see instructions/04_AUTH_AND_BILLING.md).
 * UI must check flags — never hardcode plan names for gating.
 */
export type PlanFeatures = {
  inventory: boolean;
  display: boolean;
  multi_location: boolean;
  commission_reports: boolean;
};

export const FEATURE_LABELS: Record<keyof PlanFeatures, string> = {
  inventory: "Inventory & scan-to-sell",
  display: "In-store digital display",
  multi_location: "Multi-location support",
  commission_reports: "Sales & commission reports",
};

export function parsePlanFeatures(features: unknown): PlanFeatures {
  const f = features as Partial<PlanFeatures>;
  return {
    inventory: f.inventory ?? false,
    display: f.display ?? false,
    multi_location: f.multi_location ?? false,
    commission_reports: f.commission_reports ?? false,
  };
}

export function enabledFeatures(features: PlanFeatures): (keyof PlanFeatures)[] {
  return (Object.keys(FEATURE_LABELS) as (keyof PlanFeatures)[]).filter(
    (key) => features[key],
  );
}
