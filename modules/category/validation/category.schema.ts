import { z } from "zod";

export default class CategoryValidation {
  static CREATE = z.object({
    label: z
      .string()
      .min(1, "Label is required")
      .max(100, "Label cannot exceed 100 character"),
    description: z
      .string()
      .max(300, "Description cannot exceed 300 characters")
      .optional(),
  });

  static UPDATE = z.object({
    label: z.string().min(1, "Label cannot be empty").optional(),
    description: z
      .string()
      .max(300, "Description cannot exceed 300 characters")
      .optional(),
  });
}
