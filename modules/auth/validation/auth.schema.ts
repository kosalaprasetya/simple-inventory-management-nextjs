import { z } from "zod";

export default class AuthValidation {
  static readonly LOGIN = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  static readonly REGISTER = z.object({
    email: z.email(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password must be at most 100 characters long"),
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(100, "Name must be at most 100 characters long"),
  });
}
