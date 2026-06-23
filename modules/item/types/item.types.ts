import { z } from "zod";
import ItemValidation from "../validation/item.schema";
import { Prisma } from "@/lib/generated/prisma/client";

export type CreateItemType = z.infer<typeof ItemValidation.CREATE>;
export type UpdateItemType = z.infer<typeof ItemValidation.UPDATE>;
export type ItemType = Prisma.ItemModel;

export type ListItemQueryType = {
  userId: string;
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
  sortOrder?: "asc" | "desc";
};
