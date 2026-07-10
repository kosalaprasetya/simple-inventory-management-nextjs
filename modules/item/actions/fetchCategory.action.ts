"use server";

import { CategoryAction } from "@/modules/category/category.interface";

export default async function fetchCategoryAction(category_id: string) {
  const categoryActions = CategoryAction.default;
  const result = await categoryActions.getCategory(category_id);
  return result;
}
