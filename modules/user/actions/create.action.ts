"use server";

import Validation from "@/lib/validation";
import UserValidation from "../validation/user.schema";
import { UserActions } from "../user.interface";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateUserState = {
  success: boolean;
  data?: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
    general?: string[];
  };
};

export default async function createUserAction(
  _prevState: CreateUserState | undefined,
  formData: FormData,
): Promise<CreateUserState> {
  const input = Object.fromEntries(formData.entries());

  const result = Validation.validate(UserValidation.CREATE, input);
  if (!result.success || !result.data) {
    return {
      success: false,
      errors: result.errors,
    };
  }

  const existing = await UserActions.default.getByEmail(result.data.email);
  if (existing.data) {
    return {
      success: false,
      errors: { email: ["Email already in use"] },
    };
  }

  const create = await UserActions.default.create(result.data);
  if (!create.success) {
    return {
      success: false,
      errors: { general: [create.message || "Failed to create user"] },
    };
  }

  revalidatePath("/users");
  redirect("/users");
}
