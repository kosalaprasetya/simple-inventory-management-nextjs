import { z } from "zod";

export default class UserValidation {
  static CREATE = z.object({
    name: z
      .string()
      .min(4, "Name at least 4 characters")
      .max(100, "Name cannot exceed 100 characters"),
    email: z.email(),
    password: z
      .string()
      .min(6, "Password at least 6 characters")
      .max(100, "Password cannot exceed 100 characters"),
  });

  static UPDATE = z.object({
    name: z.string().max(100, "Name cannot exceed 100 characters").optional(),
    email: z.email().optional(),
    password: z
      .string()
      .max(100, "Password cannot exceed 100 characters")
      .optional(),
  });
}
