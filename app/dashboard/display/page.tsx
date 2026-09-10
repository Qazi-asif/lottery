import { redirect } from "next/navigation";
import { DisplayManager } from "@/components/dashboard/DisplayManager";
import { getPermissionContext, locationWhere } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export default async function DisplayManagerPage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.billingRestricted) redirect("/dashboard/billing");
  if (!ctx.features.display) redirect("/dashboard");

  const db = requirePrisma();
  const [locations, games] = await Promise.all([
    db.location.findMany({
      where: locationWhere(ctx),
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        displayConfigs: {
          take: 1,
          select: {
            layout: true,
            theme: true,
            showWinners: true,
            language: true,
            binAssignments: true,
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    db.game.findMany({
      where: { active: true },
      select: { id: true, name: true, gameNumber: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <DisplayManager
      games={games}
      locations={locations.map((location) => ({
        id: location.id,
        name: location.name,
        city: location.city,
        state: location.state,
        config: location.displayConfigs[0]
          ? {
              layout: location.displayConfigs[0].layout,
              theme: location.displayConfigs[0].theme,
              showWinners: location.displayConfigs[0].showWinners,
              language: location.displayConfigs[0].language,
              binAssignments: (location.displayConfigs[0].binAssignments ??
                {}) as Record<string, string>,
            }
          : null,
      }))}
    />
  );
}
