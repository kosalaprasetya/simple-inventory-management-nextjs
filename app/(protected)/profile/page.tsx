import Link from "next/link";

function ProfilePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Profile Page</h1>
      <div className="mt-4 rounded-xl bg-gray-600 p-4">
        <p>This is the profile page content.</p>
        <Link
          href="auth/logout"
          className="rounded-xl bg-red-500 px-4 py-1 text-sm font-bold"
        >
          Logout
        </Link>
      </div>
    </div>
  );
}

export default ProfilePage;
