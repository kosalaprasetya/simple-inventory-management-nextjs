import { z } from "zod";

export default class ItemValidation {
  static CREATE = z.object({
    user_id: z.string("User ID is required!"),
    category_id: z.string("Category ID is required!"),
    name: z.string("Name is required!"),
    stock: z.number("Stock number is required!"),
    description: z.string().optional(),
  });
  static UPDATE = z.object({
    user_id: z.string("User ID is required!").optional(),
    category_id: z.string("Category ID is required!").optional(),
    name: z.string("Name is required!").optional(),
    stock: z.number("Stock number is required!").optional(),
    description: z.string().optional(),
  });
}
