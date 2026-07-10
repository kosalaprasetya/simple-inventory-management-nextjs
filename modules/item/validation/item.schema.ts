import { z } from "zod";

export default class ItemValidation {
  static CREATE = z.object({
    user_id: z.string({ message: "User ID is required!" }),
    category_id: z.string({ message: "Category ID is required!" }),
    name: z.string({ message: "Name is required!" }),
    stock: z.coerce.number({ message: "Stock number is required!" }).default(0),
    description: z.string().optional(),
  });
  static UPDATE = z.object({
    user_id: z.string({ message: "User ID is required!" }).optional(),
    category_id: z.string({ message: "Category ID is required!" }).optional(),
    name: z.string({ message: "Name is required!" }).optional(),
    stock: z.coerce.number({ message: "Stock number is required!" }).optional(),
    description: z.string().optional(),
  });
}
