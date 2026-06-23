import { z } from "zod";
import UserValidation from "../validation/user.schema";
import { Prisma } from "@/lib/generated/prisma/client";

export type CreateUserType = z.infer<typeof UserValidation.CREATE>;
export type UpdateUserType = z.infer<typeof UserValidation.UPDATE>;
export type UserType = Prisma.UserModel;

export type ListUserQueryType = {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
  sortOrder?: "asc" | "desc";
};
