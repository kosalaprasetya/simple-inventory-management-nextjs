import {
  CreateCategoryType,
  ListCategoryQueryType,
  UpdateCategoryType,
} from "../types/category.type";
import CategoryRepository from "../repository/category.repository";

export default class CategoryService {
  static async createCategory(data: CreateCategoryType) {
    return await CategoryRepository.create(data);
  }
  static async listCategories(query?: ListCategoryQueryType) {
    const listQuery = {
      page: query?.page || 1,
      limit: query?.limit || 10,
      search: query?.search || "",
      sortOrder: query?.sortOrder || "asc",
    } as ListCategoryQueryType;
    return await CategoryRepository.list(listQuery);
  }
  static async getCategory(id: string) {
    return await CategoryRepository.get(id);
  }
  static async deleteCategory(id: string) {
    return await CategoryRepository.delete(id);
  }
  static async updateCategory(id: string, data: UpdateCategoryType) {
    return await CategoryRepository.update(id, data);
  }
}
