import db from "@/lib/db";
import {
  CreateItemType,
  ListItemQueryType,
  UpdateItemType,
} from "../types/item.types";

export default class ItemRepository {
  static async create(data: CreateItemType) {
    return await db.item.create({ data });
  }
  static async list(query: ListItemQueryType) {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortOrder = "asc",
      userId,
      filter,
    } = query;
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Record<string, unknown> = { user_id: userId };
    if (filter) {
      where.category_id = filter;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    const result = await db.item.findMany({
      skip,
      take,
      orderBy: { name: sortOrder || "asc" },
      where,
    });
    const totalItems = await db.item.count({ where });
    const paging = {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    };
    return { items: result, paging };
  }
  static async getById(id: string) {
    return await db.item.findUnique({ where: { id } });
  }
  static async listByCategoryId(
    categoryId: string,
    userId: string,
    query: ListItemQueryType,
  ) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const take = limit;
    const where = { category_id: categoryId, user_id: userId };
    const result = await db.item.findMany({
      skip,
      take,
      where,
    });
    const totalItems = await db.item.count({ where });
    const paging = {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    };
    return { items: result, paging };
  }
  static async update(id: string, data: UpdateItemType) {
    return await db.item.update({ data, where: { id } });
  }
  static async delete(id: string) {
    return await db.item.delete({ where: { id } });
  }
}
