"use server";

import Validation from "@/lib/validation";
import AuthValidation from "../validation/auth.schema";
import { UserActions } from "@/modules/user/user.interface";
import Bcrypt from "@/lib/bcrypt";
import { createSession } from "@/lib/session";

export type LoginState = {
  success: boolean;
  data?: {
    email: string;
    password: string;
  };
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export default async function loginAction(
  _prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState | undefined> {
  const userActions = UserActions.default;
  const input = Object.fromEntries(formData.entries());
  // Validate the input using the AuthValidation schema
  const result = Validation.validate(AuthValidation.LOGIN, input);
  const inputData = result.data;
  if (!result.success || !inputData) {
    return {
      success: false,
      errors: {
        email: result.errors?.email || ["Invalid email"],
        password: result.errors?.password || ["Invalid password"],
      },
    };
  }

  //1. Check if the user exists in the database
  const user = (await userActions.getByEmail(inputData.email)) as {
    data: { id: string; password: string } | null;
  };

  if (!user.data) {
    return {
      success: false,
      errors: {
        email: ["Invalid email"],
        password: ["Invalid password"],
      },
    };
  }
  //2. Check if the password is correct
  const isPasswordValid = await Bcrypt.compare(
    inputData.password,
    user?.data?.password,
  );
  if (!isPasswordValid) {
    return {
      success: false,
      errors: {
        email: ["Invalid email"],
        password: ["Invalid password"],
      },
    };
  }
  //3. Create and return user session
  await createSession({ userId: user.data.id });
}
