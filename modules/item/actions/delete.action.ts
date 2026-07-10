"use server";

import { revalidatePath } from "next/cache";
import { ItemActions } from "../item.interface";

type DeleteItemState = {
  success: boolean;
  errors?: {
    name?: string[];
  };
};

export default async function deleteItemAction(id: string) {
  const itemActions = ItemActions.default;
  const result = await itemActions.deleteItem(id);
  revalidatePath("/items");
  return result as DeleteItemState;
}
