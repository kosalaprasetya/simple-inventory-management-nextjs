"use client";

import { useActionState } from "react";
import Link from "next/link";
import { UserTypes } from "../user.interface";
import updateProfileAction, {
  type UpdateProfileState,
} from "../actions/updateProfile.action";

const initialState: UpdateProfileState = {
  success: false,
  errors: {},
};

const ProfileForm = ({ user }: { user: UserTypes.UserType }) => {
  const [state, action, pending] = useActionState(
    updateProfileAction,
    initialState,
  );

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 text-sm md:p-8">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="rounded-md bg-gray-600 px-4 py-2 text-sm font-bold text-white hover:bg-gray-500"
        >
          Dashboard
        </Link>
        <Link
          href="/auth/logout"
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
        >
          Logout
        </Link>
      </div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white shadow-lg">
            {initials}
          </div>
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <span className="rounded-md bg-gray-700 px-3 py-0.5 text-xs text-gray-300">
            {user.role}
          </span>
        </div>

        <div className="mb-2 border-t border-gray-700" />

        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={user.name}
              className={`rounded-lg border p-2.5 text-sm text-white transition-colors outline-none focus:ring-2 focus:ring-blue-500 ${
                state?.errors?.name?.[0]
                  ? "border-red-500"
                  : "border-gray-700 bg-gray-700/50"
              }`}
            />
            {state?.errors?.name?.[0] && (
              <p className="text-xs text-red-400">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
              className={`rounded-lg border p-2.5 text-sm text-white transition-colors outline-none focus:ring-2 focus:ring-blue-500 ${
                state?.errors?.email?.[0]
                  ? "border-red-500"
                  : "border-gray-700 bg-gray-700/50"
              }`}
            />
            {state?.errors?.email?.[0] && (
              <p className="text-xs text-red-400">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Leave blank to keep current"
              className={`rounded-lg border p-2.5 text-sm text-white transition-colors outline-none focus:ring-2 focus:ring-blue-500 ${
                state?.errors?.password?.[0]
                  ? "border-red-500"
                  : "border-gray-700 bg-gray-700/50"
              }`}
            />
            {state?.errors?.password?.[0] && (
              <p className="text-xs text-red-400">{state.errors.password[0]}</p>
            )}
            <span className="text-xs text-gray-500">
              Leave blank to keep current password
            </span>
          </div>

          <div className="mt-2 border-t border-gray-700" />

          <div className="flex items-center justify-between">
            {state?.success && (
              <span className="text-sm text-green-400">
                Profile updated successfully
              </span>
            )}
            <div className="flex-1" />
            <button
              type="submit"
              disabled={pending}
              className={`cursor-pointer rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${
                pending ? "opacity-50" : ""
              }`}
            >
              {pending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
