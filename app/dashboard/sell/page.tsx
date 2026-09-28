import { redirect } from "next/navigation";
import { SellScreen } from "@/components/dashboard/SellScreen";
import { getPermissionContext, locationWhere } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export default async function SellPage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.billingRestricted) redirect("/dashboard/billing");

  const db = requirePrisma();
  const locations = await db.location.findMany({
    where: locationWhere(ctx),
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return <SellScreen locations={locations} />;
}
