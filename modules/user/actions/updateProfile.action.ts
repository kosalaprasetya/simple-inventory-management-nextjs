"use server";

import Validation from "@/lib/validation";
import UserValidation from "../validation/user.schema";
import { UserActions } from "../user.interface";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/dataAccess";

export type UpdateProfileState = {
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

export default async function updateProfileAction(
  _prevState: UpdateProfileState | undefined,
  formData: FormData,
): Promise<UpdateProfileState> {
  const user = (await getUser()) as {
    success: boolean;
    data?: { id: string } | null;
  };
  if (!user.success || !user.data?.id) {
    return { success: false, errors: { name: ["Session expired"] } };
  }

  const input = Object.fromEntries(formData.entries());

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

  const update = await UserActions.default.update(user.data.id, result.data);
  if (!update.success) {
    return {
      success: false,
      errors: {
        name: [update.message || "Failed to update profile"],
      },
    };
  }

  revalidatePath("/profile");
  return { success: true, data: result.data as UpdateProfileState["data"] };
}
