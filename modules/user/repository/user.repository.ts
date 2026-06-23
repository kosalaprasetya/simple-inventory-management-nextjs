import db from "@/lib/db";
import {
  CreateUserType,
  ListUserQueryType,
  UpdateUserType,
  UserType,
} from "../types/user.type";
import { PagingType } from "@/lib/types";

export default class UserRepository {
  static async create(data: CreateUserType) {
    return await db.user.create({ data, omit: { password: true } });
  }
  static async list(query: ListUserQueryType): Promise<{
    items: UserType[];
    paging: PagingType;
  }> {
    const {
      page = 1,
      limit = 10,
      search = "",
      filter = "",
      sortOrder = "asc",
    } = query;
    const skip = (page - 1) * limit;
    const take = limit;
    const result = await db.user.findMany({
      skip,
      take,
      orderBy: { name: sortOrder || "asc" },
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { role: { equals: filter, mode: "insensitive" } },
        ],
      },
    });
    const paging = {
      currentPage: page,
      totalPages: Math.ceil((await db.user.count()) / limit),
      totalItems: await db.user.count(),
    };
    return { items: result, paging };
  }
  static async getById(id: string) {
    return await db.user.findUnique({ where: { id } });
  }
  static async getByEmail(email: string) {
    return await db.user.findUnique({ where: { email } });
  }
  static async update(id: string, data: UpdateUserType) {
    return await db.user.update({
      data,
      where: { id },
      omit: { password: true },
    });
  }
  static async delete(id: string) {
    return await db.user.delete({ where: { id }, omit: { password: true } });
  }
}
