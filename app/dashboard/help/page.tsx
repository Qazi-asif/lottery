import { redirect } from "next/navigation";
import { DashboardHelp } from "@/components/dashboard/DashboardHelp";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { getPermissionContext } from "@/lib/permissions";

export default async function HelpPage() {
  const ctx = await getPermissionContext();
  if (!ctx) redirect("/login");

  return (
    <DashboardPage
      title="Help"
      description="How ScratchCrest works in the store: Sell, inventory, the TV board, roles, and billing."
    >
      <DashboardHelp />
    </DashboardPage>
  );
}
