import { useEffect, useState } from "react";
import { useActionState } from "react";
import updateItemAction, {
  UpdateItemState,
} from "@/modules/item/actions/update.action";
import fetchCategoryAction from "@/modules/item/actions/fetchCategories.action";
import { ItemType } from "@/modules/item/types/item.types";

const initialState: UpdateItemState = { success: false, errors: {} };

const UpdateDialog = ({
  item,
  onClose,
}: {
  item: ItemType;
  onClose: () => void;
}) => {
  const [state, action, isPending] = useActionState(
    updateItemAction,
    initialState,
  );
  const [category, setCategory] = useState<{
    items: { id: string; label: string }[];
  } | null>(null);
  useEffect(() => {
    if (state.success) {
      onClose();
    }
    async function fetchCategory() {
      const result = await fetchCategoryAction();
      if (result.success) {
        setCategory(result.data as { items: { id: string; label: string }[] });
      }
    }
    fetchCategory();
  }, [state.success, onClose]);

  return (
    <>
      <form
        className="absolute top-1/2 left-1/2 z-100 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg bg-gray-800 p-8 shadow-lg"
        action={action}
      >
        <input type="hidden" name="id" value={item.id} />
        <p className="text-lg font-semibold">Add Item</p>
        <div id="name" className="w-full">
          {state?.errors?.name?.[0] && (
            <p className="mb-2 text-xs text-red-500">{state?.errors.name[0]}</p>
          )}
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Category Name"
            defaultValue={item?.name || ""}
            className={`rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 ${state?.errors?.name?.[0] ? "border border-red-500 focus:ring-2 focus:ring-red-500" : "focus:ring-2 focus:ring-blue-500"} w-full`}
          />
        </div>
        <div id="stock" className="w-full">
          {state?.errors?.stock?.[0] && (
            <p className="mb-2 text-xs text-red-500">
              {state?.errors.stock[0]}
            </p>
          )}
          <input
            type="text"
            name="stock"
            id="stock"
            placeholder="Stock"
            defaultValue={item?.stock || ""}
            className={`rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 ${state?.errors?.stock?.[0] ? "border border-red-500 focus:ring-2 focus:ring-red-500" : "focus:ring-2 focus:ring-blue-500"} w-full`}
          />
        </div>
        {category ? (
          <div id="category" className="w-full">
            {state?.errors?.category_id?.[0] && (
              <p className="text-xs text-red-500">{state?.errors.category_id[0]}</p>
            )}
            <select
              name="category_id"
              id="category"
              defaultValue={item?.category_id || ""}
              className={`rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 ${state?.errors?.category_id?.[0] ? "border border-red-500 focus:ring-2 focus:ring-red-500" : "focus:ring-2 focus:ring-blue-500"} w-full`}
            >
              <option value="" disabled>
                Select a category
              </option>
              {category.items.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="h-10 animate-pulse rounded-md bg-gray-700" />
        )}
        <div id="description">
          {state?.errors?.description?.[0] && (
            <p className="text-xs text-red-500">
              {state?.errors.description[0]}
            </p>
          )}
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            defaultValue={item?.description || ""}
            className={`rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 ${state?.errors?.description?.[0] ? "border border-red-500 focus:ring-2 focus:ring-red-500" : "focus:ring-2 focus:ring-blue-500"} w-full`}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer rounded-md bg-slate-600 px-3 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {isPending ? "Updating..." : "Update Item"}
        </button>
      </form>
    </>
  );
};

export default UpdateDialog;
