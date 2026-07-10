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
      className="flex w-full max-w-lg flex-col gap-2 rounded-md bg-gray-800 p-8"
    >
      <div className="mb-4 flex flex-col gap-2">
        <div className="title">
          <Link
            href="/"
            className="text-center text-sm font-bold text-blue-400"
          >
            Return to Home
          </Link>
          <h1 className="text-center text-2xl font-bold">Register</h1>
        </div>
        <p className="text-center text-gray-400">
          Please fill in the form below to create an account.
        </p>
      </div>

      <input
        type="text"
        name="name"
        placeholder="Name"
        defaultValue={state?.data?.name || ""}
        className={`rounded-lg border p-2 text-sm ${
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
        className={`rounded-lg border p-2 text-sm ${
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
        className={`rounded-lg border p-2 text-sm ${
          state?.errors?.password?.length ? "border-red-500" : "border-gray-700"
        }`}
      />

      {state?.errors?.password?.[0] && (
        <p className="text-sm text-red-500">{state?.errors.password[0]}</p>
      )}

      <button
        type="submit"
        className={`mt-4 cursor-pointer rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${
          pending ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={pending}
      >
        {pending ? "Registering..." : "Register"}
      </button>

      <div className="text-center text-xs text-gray-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
