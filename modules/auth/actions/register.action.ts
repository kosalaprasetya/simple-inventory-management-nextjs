"use server";

import Validation from "@/lib/validation";
import { UserActions } from "@/modules/user/user.interface";
import AuthValidation from "../validation/auth.schema";
import { redirect } from "next/navigation";

export type RegisterState = {
  success: boolean;
  data?: {
    email: string;
    password: string;
    name: string;
  };
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
  };
};
export default async function RegisterAction(
  _prevState: RegisterState | undefined,
  formData: FormData,
): Promise<RegisterState | undefined> {
  const userActions = UserActions.default;
  const input = Object.fromEntries(formData.entries());
  const result = Validation.validate(AuthValidation.REGISTER, input);
  const inputData = result.data;
  if (!result.success || !inputData) {
    return {
      success: false,
      errors: {
        email: result.errors?.email || ["Invalid email"],
        password: result.errors?.password || ["Invalid password"],
        name: result.errors?.name || ["Invalid name"],
      },
    };
  }
  const existingUser = await userActions.getByEmail(inputData.email);
  if (existingUser.data) {
    return {
      success: false,
      errors: {
        email: ["Email already in use"],
      },
    };
  }
  const createUser = await userActions.create({ ...inputData, role: "user" });
  if (!createUser.data) {
    return {
      success: false,
      errors: {
        email: ["Failed to create user"],
      },
    };
  }
  redirect("/auth/login");
}
