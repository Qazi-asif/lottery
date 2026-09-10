export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function annualSavingsPercent(
  monthlyCents: number,
  annualCents: number,
): number {
  if (monthlyCents <= 0) return 0;
  const fullYearMonthly = monthlyCents * 12;
  if (fullYearMonthly <= annualCents) return 0;
  return Math.round(((fullYearMonthly - annualCents) / fullYearMonthly) * 100);
}
