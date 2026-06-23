import {
  CategoryType,
  CreateCategoryType,
  ListCategoryQueryType,
  UpdateCategoryType,
} from "../types/category.type";
import db from "@/lib/db";

export default class CategoryRepository {
  static async create(data: CreateCategoryType): Promise<CategoryType> {
    return await db.category.create({ data });
  }
  static async list(query: ListCategoryQueryType): Promise<{
    items: CategoryType[];
    paging: { currentPage: number; totalPages: number; totalItems: number };
  }> {
    const { page = 1, limit = 10, search = "", sortOrder = "asc" } = query;
    const skip = (page - 1) * limit;
    const take = limit;
    const where = search
      ? { OR: [{ label: { contains: search, mode: "insensitive" as const } }] }
      : undefined;
    const result = await db.category.findMany({
      skip,
      take,
      orderBy: { label: sortOrder },
      where,
    });
    const totalItems = await db.category.count({ where });
    const paging = {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    };
    return { items: result, paging };
  }
  static async get(id: string): Promise<CategoryType | null> {
    return await db.category.findUnique({ where: { id } });
  }
  static async update(
    id: string,
    data: UpdateCategoryType,
  ): Promise<CategoryType> {
    return await db.category.update({ where: { id }, data });
  }
  static async delete(id: string): Promise<CategoryType> {
    return await db.category.delete({ where: { id } });
  }
}
