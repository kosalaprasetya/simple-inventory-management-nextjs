"use client";

import Link from "next/link";
import deleteUserAction from "../../actions/delete.action";

const UserList = ({
  users,
}: {
  users: {
    name: string;
    id: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}) => {
  return (
    <>
      {users.map((user) => (
        <div
          key={user.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-700 p-4 hover:bg-gray-600"
        >
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            <span className="rounded-md bg-gray-800 px-4 py-1 text-xs text-white">
              {user.role}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/users/${user.id}`}
              className="cursor-pointer rounded-md bg-slate-500 px-3 py-1 text-sm text-white hover:bg-slate-800"
            >
              Edit
            </Link>
            <button
              onClick={() => deleteUserAction(user.id)}
              className="cursor-pointer rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserList;
