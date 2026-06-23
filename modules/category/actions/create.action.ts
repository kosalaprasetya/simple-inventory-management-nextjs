"use server";

import Validation from "@/lib/validation";
import CategoryValidation from "../validation/category.schema";
import { CategoryAction } from "../category.interface";
import { revalidatePath } from "next/cache";

export type CreateCategoryState = {
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

export default async function createCategoryAction(
  _prevState: CreateCategoryState | undefined,
  data: FormData,
): Promise<CreateCategoryState> {
  const categoryActions = CategoryAction.default;
  const input = Object.fromEntries(data.entries());
  const result = Validation.validate(CategoryValidation.CREATE, input);
  if (!result.success || !result.data) {
    return {
      success: false,
      errors: result.errors,
    };
  }
  const create = await categoryActions.createCategory(result.data);
  if (!create.success) {
    return {
      success: false,
      errors: {
        label: ["Failed to create category"],
      },
    };
  }
  revalidatePath("/category");
  return { ...create } as CreateCategoryState;
}
