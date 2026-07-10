"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { CategoryTypes } from "@/modules/category/category.interface";
import updateCategoryAction, {
  UpdateCategoryState,
} from "@/modules/category/actions/update.action";

const initialState: UpdateCategoryState = { success: false, errors: {} };

const UpdateDialog = ({
  category,
  onClose,
}: {
  category: CategoryTypes.CategoryType;
  onClose: () => void;
}) => {
  const [state, action, isPending] = useActionState(
    updateCategoryAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <form
      className="absolute top-1/2 left-1/2 z-100 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-lg bg-gray-800 p-8 shadow-lg"
      action={action}
    >
      <p className="text-lg font-semibold">Edit Category</p>

      <input type="hidden" name="id" value={category.id} />

      <div id="label" className="w-full">
        {state?.errors?.label?.[0] && (
          <p className="mb-2 text-xs text-red-500">{state?.errors.label[0]}</p>
        )}
        <input
          type="text"
          name="label"
          id="label"
          placeholder="Category Name"
          defaultValue={state?.data?.label ?? category.label}
          className={`rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 ${state?.errors?.label?.[0] ? "border border-red-500 focus:ring-2 focus:ring-red-500" : "focus:ring-2 focus:ring-blue-500"} w-full`}
        />
      </div>

      <div id="description">
        {state?.errors?.description?.[0] && (
          <p className="mb-2 text-xs text-red-500">
            {state?.errors.description[0]}
          </p>
        )}
        <textarea
          name="description"
          id="description"
          placeholder="Description"
          defaultValue={state?.data?.description ?? category.description ?? ""}
          className={`rounded-md bg-gray-700 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-400 ${state?.errors?.description?.[0] ? "border border-red-500 focus:ring-2 focus:ring-red-500" : "focus:ring-2 focus:ring-blue-500"} w-full`}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="cursor-pointer rounded-md bg-slate-600 px-3 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {isPending ? "Updating..." : "Update Category"}
      </button>
    </form>
  );
};

export default UpdateDialog;
