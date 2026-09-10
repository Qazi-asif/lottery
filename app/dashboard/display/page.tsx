import Link from "next/link";
import { redirect } from "next/navigation";
import { getPermissionContext, locationWhere } from "@/lib/permissions";
import { requirePrisma } from "@/lib/prisma";

export default async function DisplayManagerPage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");
  if (ctx.billingRestricted) redirect("/dashboard/billing");
  if (!ctx.features.display) redirect("/dashboard");

  const db = requirePrisma();
  const locations = await db.location.findMany({
    where: locationWhere(ctx),
    select: { id: true, name: true, city: true, state: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="font-serif text-h2 font-semibold">In-store display</h1>
      <p className="mt-2 max-w-2xl text-body text-ink-soft">
        Open the public display on a TV browser. Rendering stays generic until
        artwork licensing is approved for this account.
      </p>
      <ul className="mt-8 space-y-4">
        {locations.map((location) => (
          <li
            key={location.id}
            className="flex items-center justify-between rounded-lg border border-border bg-bg-secondary p-6"
          >
            <div>
              <p className="font-serif text-h3">{location.name}</p>
              <p className="text-small text-ink-soft">
                {location.city}, {location.state}
              </p>
            </div>
            <Link
              href={`/display/${location.id}`}
              target="_blank"
              className="rounded-lg border border-ink px-4 py-2 text-small"
            >
              Open display
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
