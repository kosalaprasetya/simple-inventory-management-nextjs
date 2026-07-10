"use server";

import Validation from "@/lib/validation";
import { ItemActions } from "../item.interface";
import ItemValidation from "../validation/item.schema";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/dataAccess";

export type CreateItemState = {
  success: boolean;
  data?: {
    name: string;
    stock: string | number;
    description?: string;
    category_id?: string;
  };
  errors?: {
    name?: string[];
    stock?: string[];
    description?: string[];
    category_id?: string[];
  };
};

export default async function createItemAction(
  _prevState: CreateItemState | undefined,
  data: FormData,
): Promise<CreateItemState> {
  const itemActions = ItemActions.default;
  const user = (await getUser()) as {
    success: boolean;
    data?: { id: string } | null;
  };
  const input = Object.fromEntries(data.entries());
  const createItemData = { ...input, user_id: String(user?.data?.id) };
  const result = Validation.validate(ItemValidation.CREATE, createItemData);
  if (!result.success || !result.data) {
    return {
      success: false,
      errors: result.errors,
    };
  }
  const validatedCreateItemData = result.data;
  const create = await itemActions.createItem(validatedCreateItemData);
  if (!create.success) {
    return {
      success: false,
      errors: {
        name: ["Failed to create item"],
      },
    };
  }
  revalidatePath("/items");
  return { ...create } as CreateItemState;
}
