import { redirect } from "next/navigation";
import { TeamManager } from "@/components/dashboard/TeamManager";
import { getPermissionContext } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export default async function TeamPage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.role !== "tenant_owner") redirect("/dashboard");
  if (ctx.billingRestricted) redirect("/dashboard/billing");

  const db = requirePrisma();
  const [locations, members] = await Promise.all([
    db.location.findMany({
      where: { tenantId: ctx.tenantId },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        zip: true,
        active: true,
      },
      orderBy: { name: "asc" },
    }),
    db.user.findMany({
      where: { tenantId: ctx.tenantId },
      select: { id: true, email: true, name: true, role: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return <TeamManager locations={locations} members={members} />;
}
