export type PlanFeatures = {
  inventory: boolean;
  display: boolean;
  multi_location: boolean;
  commission_reports: boolean;
  alerts: boolean;
  cash_reconciliation: boolean;
  pack_transfer: boolean;
  referrals: boolean;
};

export const FEATURE_LABELS: Record<keyof PlanFeatures, string> = {
  inventory: "Inventory & scan-to-sell",
  display: "In-store digital display",
  multi_location: "Multi-location support",
  commission_reports: "Sales & commission reports",
  alerts: "Low-stock, overdue-game, and scan alerts",
  cash_reconciliation: "Shift cash reconciliation",
  pack_transfer: "Pack transfer between locations",
  referrals: "Referral program",
};

export function parsePlanFeatures(features: unknown): PlanFeatures {
  const f = features as Partial<PlanFeatures>;
  return {
    inventory: f.inventory ?? false,
    display: f.display ?? false,
    multi_location: f.multi_location ?? false,
    commission_reports: f.commission_reports ?? false,
    alerts: f.alerts ?? false,
    cash_reconciliation: f.cash_reconciliation ?? false,
    pack_transfer: f.pack_transfer ?? false,
    referrals: f.referrals ?? false,
  };
}

export function enabledFeatures(features: PlanFeatures): (keyof PlanFeatures)[] {
  return (Object.keys(FEATURE_LABELS) as (keyof PlanFeatures)[]).filter(
    (key) => features[key],
  );
}
