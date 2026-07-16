import { verifyRole } from "@/lib/dataAccess";
import { ResponseType } from "@/lib/types";
import { UserActions, UserTypes } from "@/modules/user/user.interface";
import UserDetail from "@/modules/user/ui/UserDetail";

async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [, resolvedParams] = await Promise.all([verifyRole("admin"), params]);
  const { id } = resolvedParams;
  const result = (await UserActions.default.getUserById(id)) as ResponseType;
  if (!result.success) {
    return (
      <div className="flex items-center justify-center p-8">
        <span>
          Error loading user data:{" "}
          {result.message || "An unknown error occurred"}
        </span>
      </div>
    );
  }
  const userData = result.data as UserTypes.UserType;
  return <UserDetail user={userData} />;
}

export default UserDetailPage;
