"use server";

import Validation from "@/lib/validation";
import CategoryValidation from "../validation/category.schema";
import { CategoryAction } from "../category.interface";
import { revalidatePath } from "next/cache";

export type UpdateCategoryState = {
  success: boolean;
  data?: {
    label: string;
    description?: string;
  };
  errors?: {
    label?: string[];
    description?: string[];
  };
};

export default async function updateCategoryAction(
  _prevState: UpdateCategoryState | undefined,
  data: FormData,
): Promise<UpdateCategoryState> {
  const categoryActions = CategoryAction.default;
  const id = data.get("id") as string;
  if (!id) {
    return { success: false, errors: { label: ["Category ID is required"] } };
  }

  const input = Object.fromEntries(data.entries());
  delete input.id;

  const result = Validation.validate(CategoryValidation.UPDATE, input);
  if (!result.success || !result.data) {
    return {
      success: false,
      errors: result.errors,
    };
  }

  const update = await categoryActions.updateCategory(id, result.data);
  if (!update.success) {
    return {
      success: false,
      errors: {
        label: ["Failed to update category"],
      },
    };
  }

  revalidatePath("/category");
  return { ...update } as UpdateCategoryState;
}
