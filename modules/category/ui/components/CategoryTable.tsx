"use client";
import deleteCategoryAction from "../../actions/delete.action";
import { CategoryTypes } from "../../category.interface";

const CategoryTable = ({
  categories,
  onEdit,
}: {
  categories: CategoryTypes.CategoryType[];
  onEdit: (category: CategoryTypes.CategoryType) => void;
}) => {
  return (
    <div className="overflow-hidden rounded-lg bg-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-4 py-3 text-left font-medium text-gray-400">
              Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-400">
              Description
            </th>
            <th className="px-4 py-3 text-center font-medium text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                No categories yet
              </td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-gray-700/50 hover:bg-gray-600"
              >
                <td className="px-4 py-3 text-white">{cat.label}</td>
                <td className="px-4 py-3 text-gray-400">
                  {cat.description || "-"}
                </td>
                <td className="px-4 py-3 text-center text-xs font-bold">
                  <button
                    onClick={() => onEdit(cat)}
                    className="cursor-pointer rounded-md bg-slate-700 px-3 py-1 text-white hover:bg-slate-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategoryAction(cat.id)}
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
    </div>
  );
};

export default CategoryTable;
