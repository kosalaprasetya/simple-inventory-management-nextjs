"use client";

import Link from "next/link";
import { useActionState } from "react";

import loginAction, { type LoginState } from "../actions/login.action";

const initialState: LoginState = {
  success: false,
  errors: {},
};

const LoginForm = () => {
  const [state, action, pending] = useActionState(loginAction, initialState);
  return (
    <form
      action={action}
      className="flex w-full max-w-lg flex-col gap-2 rounded-md bg-gray-800 p-8"
    >
      <div className="mb-4 flex flex-col gap-2">
        <h1 className="text-center text-2xl font-bold">Login</h1>

        <p className="text-center text-gray-400">
          Please fill in the form below to log in to your account.
        </p>
      </div>

      <input
        type="email"
        name="email"
        placeholder="Email"
        defaultValue={state?.data?.email || ""}
        className={`rounded-lg border p-2 text-sm ${
          state?.errors?.email?.[0] ? "border-red-500" : "border-gray-700"
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
          state?.errors?.password?.[0] ? "border-red-500" : "border-gray-700"
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
        {pending ? "Logging in..." : "Login"}
      </button>

      <div className="text-center text-xs text-gray-400">
        {"Don't have an account? "}
        <Link href="/auth/register" className="text-blue-500 hover:underline">
          Register
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
