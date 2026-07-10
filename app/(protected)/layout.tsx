import { redirect } from "next/navigation";
import { getUser } from "@/lib/dataAccess";
import Sidebar from "@/modules/dashboard/ui/components/sidebar/Sidebar";
import SidebarAdmin from "@/modules/dashboard/ui/components/sidebar/SidebarAdmin";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userSession = (await getUser()) as {
    success: boolean;
    data: { role?: string; name?: string; email?: string } | null;
  };
  if (!userSession.success || !userSession.data) {
    redirect("/auth/logout");
  }
  const userRole = userSession.data?.role;
  const sidebarProps = {
    role: userRole,
    name: userSession.data?.name,
    email: userSession.data?.email,
  };
  return (
    <div className="flex h-screen overflow-hidden">
      {userRole === "admin" ? (
        <SidebarAdmin {...sidebarProps} />
      ) : (
        <Sidebar {...sidebarProps} />
      )}
      <main className="flex-1 overflow-y-auto bg-gray-700 p-4">{children}</main>
    </div>
  );
}

export default DashboardLayout;
