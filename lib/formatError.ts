import { z, ZodError } from "zod";

export default function formatError(error: unknown | Error | ZodError) {
  if (error instanceof ZodError) {
    const zodErrors = z.flattenError(error);
    return {
      success: false,
      message: zodErrors.formErrors.join(", ") || "Validation Error!",
      errors: zodErrors.fieldErrors,
    };
  }
  if (error instanceof Error) {
    console.error("Error occur:", error);
    return {
      success: false,
      message: error.message || "Unexpected Error!",
      errors: [error],
    };
  }
  return {
    success: false,
    message: "Unexpected Error!",
    errors: null,
  };
}
