import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();
  if (session) redirect("/dashboard");
  return (
    <main className="flex min-h-screen min-w-screen items-center justify-center p-8">
      {children}
    </main>
  );
}

export default AuthLayout;
