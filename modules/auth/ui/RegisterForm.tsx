"use client";

import Link from "next/link";
import { useActionState } from "react";
import RegisterAction, {
  type RegisterState,
} from "../actions/register.action";

const initialState: RegisterState = {
  success: false,
  errors: {},
};

const RegisterForm = () => {
  const [state, action, pending] = useActionState(
    RegisterAction,
    initialState,
  );
  return (
    <form
      action={action}
      className="flex flex-col gap-2 p-8 bg-gray-800 rounded-md max-w-lg w-full"
    >
      <div className="mb-4 flex-col flex gap-2">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <p className="text-gray-400 text-center">
          Please fill in the form below to create an account.
        </p>
      </div>

      <input
        type="text"
        name="name"
        placeholder="Name"
        defaultValue={state?.data?.name || ""}
        className={`border p-2 rounded-lg text-sm ${
          state?.errors?.name?.length ? "border-red-500" : "border-gray-700"
        }`}
      />

      {state?.errors?.name?.[0] && (
        <p className="text-sm text-red-500">{state?.errors.name[0]}</p>
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        defaultValue={state?.data?.email || ""}
        className={`border p-2 rounded-lg text-sm ${
          state?.errors?.email?.length ? "border-red-500" : "border-gray-700"
        }`}
      />

      {state?.errors?.email?.[0] && (
        <p className="text-sm text-red-500">{state?.errors.email[0]}</p>
      )}

      <input
        type="password"
        name="password"
        placeholder="Password"
        defaultValue={state?.data?.password || ""}
        className={`border p-2 rounded-lg text-sm ${
          state?.errors?.password?.length ? "border-red-500" : "border-gray-700"
        }`}
      />

      {state?.errors?.password?.[0] && (
        <p className="text-sm text-red-500">{state?.errors.password[0]}</p>
      )}

      <button
        type="submit"
        className={`bg-blue-500 text-white p-2 rounded-lg mt-4 cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${
          pending ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={pending}
      >
        {pending ? "Registering..." : "Register"}
      </button>

      <div className="text-xs text-gray-400 text-center">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
