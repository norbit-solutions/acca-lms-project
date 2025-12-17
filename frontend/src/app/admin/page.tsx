import DashboardClient from "@/components/admin/DashboardClient";
import { adminService } from "@/services/adminService";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await adminService.getStats();
  return <DashboardClient initialStats={stats} />;
}
