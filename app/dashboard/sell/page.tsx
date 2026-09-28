import { redirect } from "next/navigation";
import { SellScreen } from "@/components/dashboard/SellScreen";
import { getPermissionContext, locationWhere } from "@/lib/permissions";
import { getPrisma } from "@/lib/prisma";

export default async function SellPage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.billingRestricted) redirect("/dashboard/billing");

  const db = getPrisma();
  if (!db) redirect("/login");

  try {
    const locations = await db.location.findMany({
      where: locationWhere(ctx),
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return <SellScreen locations={locations} />;
  } catch (error) {
    console.error("Sell page query failed:", error);
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <h1 className="font-serif text-h2 font-semibold text-ink">
          Could not load sell
        </h1>
        <p className="mt-3 text-body text-ink-soft">
          The database connection failed. Confirm DATABASE_URL and DIRECT_URL
          on Vercel, then run migrations and seed against Supabase.
        </p>
      </div>
    );
  }
}
