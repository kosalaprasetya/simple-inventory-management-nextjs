"use client";

import { useActionState } from "react";
import Link from "next/link";
import createUserAction, {
  type CreateUserState,
} from "../actions/create.action";

const initialState: CreateUserState = {
  success: false,
  errors: {},
};

const AddUser = () => {
  const [state, action, pending] = useActionState(
    createUserAction,
    initialState,
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 text-sm md:p-8">
      <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Add User</h1>
          <Link
            href="/users"
            className="cursor-pointer rounded-md bg-gray-700 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-gray-600"
          >
            Back
          </Link>
        </div>

        <div className="mb-2 border-t border-gray-700" />

        <form action={action} className="mt-4 flex flex-col gap-4">
          {state?.errors?.general?.[0] && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {state.errors.general[0]}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={state?.data?.name || ""}
              className={`rounded-lg border p-2.5 text-sm text-white transition-colors outline-none focus:ring-2 focus:ring-blue-500 ${
                state?.errors?.name?.[0]
                  ? "border-red-500"
                  : "border-gray-700 bg-gray-700/50"
              }`}
              placeholder="Enter full name"
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
              defaultValue={state?.data?.email || ""}
              className={`rounded-lg border p-2.5 text-sm text-white transition-colors outline-none focus:ring-2 focus:ring-blue-500 ${
                state?.errors?.email?.[0]
                  ? "border-red-500"
                  : "border-gray-700 bg-gray-700/50"
              }`}
              placeholder="Enter email address"
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
              defaultValue={state?.data?.password || ""}
              className={`rounded-lg border p-2.5 text-sm text-white transition-colors outline-none focus:ring-2 focus:ring-blue-500 ${
                state?.errors?.password?.[0]
                  ? "border-red-500"
                  : "border-gray-700 bg-gray-700/50"
              }`}
              placeholder="Minimum 6 characters"
            />
            {state?.errors?.password?.[0] && (
              <p className="text-xs text-red-400">{state.errors.password[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Role</label>
            <select
              name="role"
              defaultValue={state?.data?.role || "user"}
              className={`rounded-lg border p-2.5 text-sm text-white outline-none transition-colors focus:ring-2 focus:ring-blue-500 ${
                state?.errors?.role?.[0]
                  ? "border-red-500"
                  : "border-gray-700 bg-gray-700/50"
              }`}
            >
              <option value="user" className="bg-gray-800 text-white">
                User
              </option>
              <option value="admin" className="bg-gray-800 text-white">
                Admin
              </option>
            </select>
            {state?.errors?.role?.[0] && (
              <p className="text-xs text-red-400">{state.errors.role[0]}</p>
            )}
          </div>

          <div className="mt-2 border-t border-gray-700" />

          <button
            type="submit"
            disabled={pending}
            className={`w-full cursor-pointer rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${
              pending ? "opacity-50" : ""
            }`}
          >
            {pending ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
