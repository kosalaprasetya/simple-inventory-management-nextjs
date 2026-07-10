"use client";

import { useEffect, useState } from "react";
import { ItemTypes } from "../../item.interface";
import fetchCategoriesAction from "../../actions/fetchCategories.action";
import deleteItemAction from "@/modules/item/actions/delete.action";

const ItemsTable = ({
  data,
  onEdit,
}: {
  data: {
    items: ItemTypes.ItemType[];
  };
  onEdit: (item: ItemTypes.ItemType) => void;
}) => {
  // Lookup table: category_id => label
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadCategories() {
      const response = await fetchCategoriesAction();

      // Extract the list of categories from the API response
      type CategoryShape = { id: string; label: string };
      const data = response.data as { items: CategoryShape[] };
      const categories: CategoryShape[] = data?.items ?? [];

      // Build a map so we can look up a label by ID in O(1)
      const map: Record<string, string> = {};
      for (const category of categories) {
        map[category.id] = category.label;
      }

      setCategoryMap(map);
    }

    loadCategories();
  }, []);

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="px-4 py-3 text-left font-medium text-gray-400">
            Name
          </th>
          <th className="px-4 py-3 text-left font-medium text-gray-400">
            Category
          </th>
          <th className="px-4 py-3 text-center font-medium text-gray-400">
            Stock
          </th>
          <th className="px-4 py-3 text-center font-medium text-gray-400">
            Description
          </th>
          <th className="px-4 py-3 text-center font-medium text-gray-400">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {data.items.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
              No items yet
            </td>
          </tr>
        ) : (
          data.items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-700/50 hover:bg-gray-600"
            >
              <td className="px-4 py-3 text-white">{item.name}</td>
              <td className="flex items-center justify-center px-4 py-3 text-gray-400">
                <span className="rounded-md bg-blue-800 p-1 font-medium text-white">
                  {categoryMap[item.category_id] || "-"}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400">{item.stock || "-"}</td>
              <td className="px-4 py-3 text-gray-400">
                {item.description || "-"}
              </td>
              <td className="px-4 py-3 text-center text-xs font-bold">
                <button
                  onClick={() => onEdit(item)}
                  className="cursor-pointer rounded-md bg-slate-700 px-3 py-1 text-white hover:bg-slate-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItemAction(item.id)}
                  className="ml-2 cursor-pointer rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ItemsTable;
