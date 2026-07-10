"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PagingType } from "@/lib/types";
import { ItemTypes } from "../item.interface";
import { useRef, useState } from "react";
import CreateDialog from "./components/CreateDialog";
import UpdateDialog from "./components/UpdateDialog";
import ItemsTable from "./components/ItemsTable";

function buildUrl(search: string, sort: string, page: string) {
  const params = new URLSearchParams();
  params.set("search", search);
  params.set("sort", sort);
  params.set("page", page);
  params.set("limit", "10");
  return `/items?${params.toString()}`;
}

const Item = ({
  data,
}: {
  data: {
    items: ItemTypes.ItemType[];
    paging: PagingType;
  };
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const sort = (params.get("sort") as "asc" | "desc") || "asc";
  const page = Number(params.get("page")) || 1;

  const [search, setSearch] = useState(params.get("search") || "");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ItemTypes.ItemType | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(
      () => router.replace(buildUrl(value, sort, "1")),
      800,
    );
  }

  function toggleSort() {
    clearTimeout(debounceTimer.current);
    const nextSort = sort === "asc" ? "desc" : "asc";
    router.replace(buildUrl(search, nextSort, "1"));
  }

  function goToPage(n: number) {
    clearTimeout(debounceTimer.current);
    router.replace(buildUrl(search, sort, String(n)));
  }

  return (
    <>
      <div
        id="overlay"
        className={`fixed inset-0 bg-black/50 ${showCreateDialog || itemToEdit ? "block" : "hidden"}`}
        onClick={() => {
          setShowCreateDialog(false);
          setItemToEdit(null);
        }}
      ></div>
      {/* Create Item Dialog */}
      {showCreateDialog && (
        <CreateDialog onClose={() => setShowCreateDialog(false)} />
      )}
      {/* Update Item Dialog */}
      {itemToEdit && (
        <UpdateDialog item={itemToEdit} onClose={() => setItemToEdit(null)} />
      )}
      {/* Items */}
      <div className={`flex flex-col gap-4 p-4`}>
        <h1 className="text-2xl font-bold">Items</h1>
        <div className="flex items-center gap-3 rounded-lg bg-gray-800 p-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={onSearch}
            className="flex-1 rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={toggleSort}
            className="cursor-pointer rounded-md bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-600"
          >
            Sort {sort === "asc" ? "A-Z" : "Z-A"}
          </button>
          <button
            onClick={() => setShowCreateDialog(!showCreateDialog)}
            className="cursor-pointer rounded-md bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-500"
          >
            Add Item
          </button>
        </div>

        <div className="overflow-hidden rounded-lg bg-gray-800">
          <ItemsTable data={data} onEdit={(item) => setItemToEdit(item)} />
        </div>
        {/* pagination */}
        {data.paging.totalPages > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-gray-800 p-4">
            <span className="text-sm text-gray-400">
              Page {data.paging.currentPage} of {data.paging.totalPages}
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
                disabled={page >= data.paging.totalPages}
                className="cursor-pointer rounded-md bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Item;
