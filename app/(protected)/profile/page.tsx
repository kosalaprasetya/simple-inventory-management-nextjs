import { getUser } from "@/lib/dataAccess";
import type { UserTypes } from "@/modules/user/user.interface";
import ProfileForm from "@/modules/user/ui/ProfileForm";

async function ProfilePage() {
  const userData = (await getUser()) as {
    success: boolean;
    data: UserTypes.UserType;
  };
  const user = userData.data;

  return <ProfileForm user={user} />;
}

export default ProfilePage;
