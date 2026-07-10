"use server";

import { CategoryAction } from "@/modules/category/category.interface";

export default async function fetchCategoriesAction(): Promise<{
  success: boolean;
  statusCode: number;
  message: string;
  data: unknown;
}> {
  const categoryActions = CategoryAction.default;
  const fetch = await categoryActions.getCategories({ limit: 0 });
  return fetch;
}
