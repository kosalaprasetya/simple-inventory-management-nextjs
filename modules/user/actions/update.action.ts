"use server";

import Validation from "@/lib/validation";
import UserValidation from "../validation/user.schema";
import { UserActions } from "../user.interface";
import { revalidatePath } from "next/cache";
export type UpdateUserState = {
  success: boolean;
  data?: {
    name?: string;
    email?: string;
    password?: string;
  };
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

export default async function updateUserAction(
  _prevState: UpdateUserState | undefined,
  data: FormData,
): Promise<UpdateUserState> {
  const id = data.get("id") as string;
  if (!id) {
    return { success: false, errors: { name: ["User ID is required"] } };
  }

  const input = Object.fromEntries(data.entries());
  delete input.id;

  const cleanedInput: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string" && value.trim() !== "") {
      cleanedInput[key] = value;
    }
  }

  if (Object.keys(cleanedInput).length === 0) {
    return { success: false, errors: { name: ["No fields to update"] } };
  }

  const result = Validation.validate(UserValidation.UPDATE, cleanedInput);
  if (!result.success || !result.data) {
    return {
      success: false,
      errors: result.errors,
    };
  }

  const update = await UserActions.default.update(id, result.data);
  if (!update.success) {
    return {
      success: false,
      errors: {
        name: [update.message || "Failed to update user"],
      },
    };
  }

  revalidatePath("/users");
  return { success: true, data: result.data as UpdateUserState["data"] };
}
