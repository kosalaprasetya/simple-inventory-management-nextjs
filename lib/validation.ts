import { z } from "zod";

export default class Validation {
  static validate<TSchema extends z.ZodTypeAny>(
    schema: TSchema,
    data: unknown,
  ): {
    success: boolean;
    data?: z.infer<TSchema>;
    errors?: Record<string, string[] | undefined>;
  } {
    const result = schema.safeParse(data);

    if (!result.success) {
      return {
        success: false,
        errors: z.flattenError(result.error).fieldErrors,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  }
}
