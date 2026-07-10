"use server";

import Validation from "@/lib/validation";
import { ItemActions } from "../item.interface";
import ItemValidation from "../validation/item.schema";
import { revalidatePath } from "next/cache";

export type UpdateItemState = {
  success: boolean;
  data?: {
    name: string;
    stock: string;
    category_id: string;
    description?: string;
  };
  errors?: {
    name?: string[];
    stock?: string[];
    category_id?: string[];
    description?: string[];
  };
};

export default async function updateItemAction(
  _prevState: UpdateItemState | undefined,
  formData: FormData,
) {
  const itemActions = ItemActions.default;
  const id = formData.get("id") as string;
  const category_id = formData.get("category_id") as string;
  if (!id) {
    return {
      success: false,
      errors: {
        name: ["Item ID is required"],
      },
    };
  }
  if (!category_id) {
    return {
      success: false,
      errors: {
        category: ["Category is required"],
      },
    };
  }
  const input = Object.fromEntries(formData.entries());

  const result = Validation.validate(ItemValidation.UPDATE, input);
  if (!result.success || !result.data) {
    return {
      success: false,
      errors: result.errors,
    };
  }

  const update = await itemActions.updateItem(id, result.data);
  if (!update.success) {
    return {
      success: false,
      errors: {
        name: ["Failed to update item"],
      },
    };
  }

  revalidatePath("/items");
  return { ...update } as UpdateItemState;
}
