import { getUser } from "@/lib/dataAccess";
import AdminDashboard from "@/modules/dashboard/ui/pages/AdminDashboard";
import UserDashboard from "@/modules/dashboard/ui/pages/UserDashboard";

async function DashboardPage() {
  const userSession = (await getUser()) as {
    success: boolean;
    data: { role?: string; id?: string } | null;
  };
  const userRole = userSession.data?.role;
  const userId = userSession.data?.id || "";
  return <>{userRole === "admin" ? <AdminDashboard userId={userId} /> : <UserDashboard userId={userId} />}</>;
}

export default DashboardPage;
