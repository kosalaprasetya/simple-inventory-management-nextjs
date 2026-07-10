"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserActions } from "../user.interface";

type DeleteUserState = {
  success: boolean;
  errors?: {
    name?: string[];
  };
};

export default async function deleteUserAction(id: string) {
  const result = await UserActions.default.delete(id);
  revalidatePath("/users");
  redirect("/users");
  return result as DeleteUserState;
}
