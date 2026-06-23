"use server";

import { revalidatePath } from "next/cache";
import { CategoryAction } from "../category.interface";

type DeleteCategoryState = {
  success: boolean;
  errors?: {
    label?: string[];
  };
};

export default async function deleteCategoryAction(id: string) {
  const categoryActions = CategoryAction.default;
  const result = await categoryActions.deleteCategory(id);
  revalidatePath("/category");
  return result as DeleteCategoryState;
}
