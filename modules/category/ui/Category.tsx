"use client";

import { useState } from "react";
import { CategoryTypes } from "../category.interface";
import type { PagingType } from "@/lib/types";
import useListParams from "@/modules/shared/hooks/useListParams";
import SearchBar from "@/modules/shared/components/SearchBar";
import SortButton from "@/modules/shared/components/SortButton";
import PaginationControls from "@/modules/shared/components/PaginationControls";
import CreateDialog from "./components/CreateDialog";
import UpdateDialog from "./components/UpdateDialog";
import CategoryTable from "./components/CategoryTable";

export default function Category({
  data,
}: {
  data: {
    categories: CategoryTypes.CategoryType[];
    paging: PagingType;
  };
}) {
  const { sort, search, onSearch, toggleSort, goToPage } = useListParams({
    basePath: "/category",
  });

  const { categories, paging } = data;

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [categoryToEdit, setCategoryToEdit] =
    useState<CategoryTypes.CategoryType | null>(null);

  return (
    <>
      {showCreateDialog && (
        <CreateDialog onClose={() => setShowCreateDialog(false)} />
      )}
      {categoryToEdit && (
        <UpdateDialog
          category={categoryToEdit}
          onClose={() => setCategoryToEdit(null)}
        />
      )}
      <div
        id="overlay"
        className={`fixed inset-0 z-99 bg-black/50 ${showCreateDialog || categoryToEdit ? "block" : "hidden"}`}
        onClick={() => {
          setShowCreateDialog(false);
          setCategoryToEdit(null);
        }}
      ></div>
      <div className={`flex flex-col gap-4 p-4`}>
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex items-center gap-3 rounded-lg bg-gray-800 p-4">
          <SearchBar value={search} onChange={onSearch} placeholder="Search by name..." />
          <SortButton sort={sort} onToggle={toggleSort} />
          <button
            onClick={() => setShowCreateDialog(true)}
            className="cursor-pointer rounded-md bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-500"
          >
            Add Category
          </button>
        </div>
        <CategoryTable
          categories={categories}
          onEdit={(cat) => setCategoryToEdit(cat)}
        />
        <PaginationControls
          currentPage={paging.currentPage}
          totalPages={paging.totalPages}
          onPageChange={goToPage}
        />
      </div>
    </>
  );
}
