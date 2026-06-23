import { getUser } from "@/lib/dataAccess";
import AdminDashboard from "@/modules/dashboard/ui/pages/AdminDashboard";
import UserDashboard from "@/modules/dashboard/ui/pages/UserDashboard";

async function DashboardPage() {
  const userSession = (await getUser()) as {
    success: boolean;
    data: { role?: string } | null;
  };
  const userRole = userSession.data?.role;
  return <>{userRole === "admin" ? <AdminDashboard /> : <UserDashboard />}</>;
}

export default DashboardPage;
