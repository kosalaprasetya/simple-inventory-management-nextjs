"use client";
import { PagingType } from "@/lib/types";
import { UserTypes } from "../user.interface";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import UserList from "./components/UserList";
import Link from "next/link";

function buildUrl(search: string, sort: string, page: string, filter: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  params.set("sort", sort);
  params.set("page", page);
  params.set("limit", "10");
  params.set("filter", filter || "all");
  return `/users?${params.toString()}`;
}

const User = ({
  data,
}: {
  data: {
    users: UserTypes.UserType[];
    paging: PagingType;
  };
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const { users, paging } = data;

  const sort = (params.get("sort") as "asc" | "desc") || "asc";
  const page = Number(params.get("page")) || 1;
  const [filter, setFilter] = useState(params.get("filter") || "all");
  const [search, setSearch] = useState(params.get("search") || "");
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(
      () => router.replace(buildUrl(value, sort, "1", filter)),
      800,
    );
  }

  function onFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setFilter(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(
      () => router.replace(buildUrl(search, sort, "1", value)),
      800,
    );
  }

  function toggleSort() {
    clearTimeout(debounceTimer.current);
    const nextSort = sort === "asc" ? "desc" : "asc";
    router.push(buildUrl(search, nextSort, "1", filter));
  }

  function goToPage(n: number) {
    clearTimeout(debounceTimer.current);
    router.push(buildUrl(search, sort, String(n), filter));
  }

  return (
    <div className={`flex flex-col gap-4 p-4 text-sm`}>
      <h1 className="text-2xl font-bold">Users</h1>
      {/* search & sort */}
      <div className="flex flex-col items-center gap-3 rounded-lg bg-gray-800 p-4">
        {/* search */}
        <div id="search" className="flex w-full flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={onSearch}
            className="w-full flex-1 rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <Link
            href="/users/add"
            className="cursor-pointer rounded-md bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-500"
          >
            Add User
          </Link>
        </div>
        {/* utils */}
        <div
          id="utils"
          className="flex w-full flex-wrap items-center justify-start gap-2 text-sm"
        >
          <button
            className="cursor-pointer rounded-md bg-gray-700 p-2 text-sm text-white hover:bg-gray-600"
            onClick={toggleSort}
          >
            Sort {sort === "asc" ? "A-Z" : "Z-A"}
          </button>

          <select
            className="cursor-pointer rounded-md bg-gray-700 p-2 text-sm text-white hover:bg-gray-600"
            value={filter}
            onChange={onFilterChange}
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
        {/* content */}
        <div
          id="content"
          className="flex w-full flex-col gap-2 text-sm text-white"
        >
          <UserList users={users} />
        </div>
        {/* Pagination */}
        {paging.totalPages > 0 && (
          <div className="flex flex-col items-center justify-between gap-2 rounded-lg bg-gray-800 p-4">
            <span className="text-sm text-gray-400">
              Page {paging.currentPage} of {paging.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="cursor-pointer rounded-md bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= paging.totalPages}
                className="cursor-pointer rounded-md bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
