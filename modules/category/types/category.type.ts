import { z } from "zod";
import CategoryValidation from "../validation/category.schema";
import { Prisma } from "@/lib/generated/prisma/client";

export type CreateCategoryType = z.infer<typeof CategoryValidation.CREATE>;
export type UpdateCategoryType = z.infer<typeof CategoryValidation.UPDATE>;
export type CategoryType = Prisma.CategoryModel;

export type ListCategoryQueryType = {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
};
