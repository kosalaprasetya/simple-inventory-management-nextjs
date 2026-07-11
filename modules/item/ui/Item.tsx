"use client";

import { useState } from "react";
import { PagingType } from "@/lib/types";
import { ItemTypes } from "../item.interface";
import useListParams from "@/modules/shared/hooks/useListParams";
import SearchBar from "@/modules/shared/components/SearchBar";
import SortButton from "@/modules/shared/components/SortButton";
import PaginationControls from "@/modules/shared/components/PaginationControls";
import CreateDialog from "./components/CreateDialog";
import UpdateDialog from "./components/UpdateDialog";
import ItemsTable from "./components/ItemsTable";

const Item = ({
  data,
}: {
  data: {
    items: ItemTypes.ItemType[];
    paging: PagingType;
  };
}) => {
  const { sort, search, onSearch, toggleSort, goToPage } = useListParams({
    basePath: "/items",
  });

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ItemTypes.ItemType | null>(null);

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
      {showCreateDialog && (
        <CreateDialog onClose={() => setShowCreateDialog(false)} />
      )}
      {itemToEdit && (
        <UpdateDialog item={itemToEdit} onClose={() => setItemToEdit(null)} />
      )}
      <div className={`flex flex-col gap-4 p-4`}>
        <h1 className="text-2xl font-bold">Items</h1>
        <div className="flex items-center gap-3 rounded-lg bg-gray-800 p-4">
          <SearchBar value={search} onChange={onSearch} placeholder="Search by name..." />
          <SortButton sort={sort} onToggle={toggleSort} />
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
        <PaginationControls
          currentPage={data.paging.currentPage}
          totalPages={data.paging.totalPages}
          onPageChange={goToPage}
        />
      </div>
    </>
  );
};

export default Item;
