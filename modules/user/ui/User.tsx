"use client";
import { PagingType } from "@/lib/types";
import { UserTypes } from "../user.interface";
import useListParams from "@/modules/shared/hooks/useListParams";
import SearchBar from "@/modules/shared/components/SearchBar";
import SortButton from "@/modules/shared/components/SortButton";
import PaginationControls from "@/modules/shared/components/PaginationControls";
import UserList from "./components/UserList";
import Link from "next/link";

const User = ({
  data,
}: {
  data: {
    users: UserTypes.UserType[];
    paging: PagingType;
  };
}) => {
  const { users, paging } = data;

  const { sort, search, onSearch, toggleSort, goToPage, setExtraParam } = useListParams({
    basePath: "/users",
    initialExtraParams: { filter: "all" },
  });

  return (
    <div className={`flex flex-col gap-4 p-4 text-sm`}>
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="flex flex-col items-center gap-3 rounded-lg bg-gray-800 p-4">
        <div id="search" className="flex w-full flex-wrap items-center gap-2">
          <SearchBar value={search} onChange={onSearch} placeholder="Search user..." />
          <Link
            href="/users/add"
            className="cursor-pointer rounded-md bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-500"
          >
            Add User
          </Link>
        </div>
        <div
          id="utils"
          className="flex w-full flex-wrap items-center justify-start gap-2 text-sm"
        >
          <SortButton sort={sort} onToggle={toggleSort} />
          <select
            className="cursor-pointer rounded-md bg-gray-700 p-2 text-sm text-white hover:bg-gray-600"
            onChange={(e) => setExtraParam("filter", e.target.value)}
          >
            <option value="all" className="bg-gray-700 text-white">
              All Roles
            </option>
            <option value="admin" className="bg-gray-700 text-white">
              Admin
            </option>
            <option value="user" className="bg-gray-700 text-white">
              User
            </option>
          </select>
        </div>
        <div
          id="content"
          className="flex w-full flex-col gap-2 text-sm text-white"
        >
          <UserList users={users} />
        </div>
        <PaginationControls
          currentPage={paging.currentPage}
          totalPages={paging.totalPages}
          onPageChange={goToPage}
        />
      </div>
    </div>
  );
};

export default User;
