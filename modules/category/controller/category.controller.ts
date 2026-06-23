import {
  CreateCategoryType,
  ListCategoryQueryType,
  UpdateCategoryType,
} from "../types/category.type";
import CategoryService from "../service/category.service";
import formatError from "@/lib/formatError";
import Response from "@/lib/response";
import Validation from "@/lib/validation";
import CategoryValidation from "../validation/category.schema";

export default class CategoryController {
  static async createCategory(data: CreateCategoryType) {
    try {
      const validateInput = Validation.validate(
        CategoryValidation.CREATE,
        data,
      );
      if (!validateInput.success) {
        return Response.error("Validation failed", 400, validateInput.errors);
      }
      const result = await CategoryService.createCategory(
        validateInput.data as CreateCategoryType,
      );
      return Response.success("Category created successfully", 201, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async getCategories(query?: ListCategoryQueryType) {
    try {
      const result = await CategoryService.listCategories(query);
      return Response.success("Categories retrieved successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async getCategory(id: string) {
    try {
      const result = await CategoryService.getCategory(id);
      if (!result) {
        return Response.error("Category not found", 404);
      }
      return Response.success("Category retrieved successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async updateCategory(id: string, data: UpdateCategoryType) {
    try {
      const findCategory = await this.getCategory(id);
      if (findCategory.statusCode === 404) {
        return Response.error("Category not found", 404);
      }
      const validateInput = Validation.validate(
        CategoryValidation.UPDATE,
        data,
      );
      if (!validateInput.success) {
        return Response.error("Validation failed", 400, validateInput.errors);
      }
      const result = await CategoryService.updateCategory(
        id,
        validateInput.data as UpdateCategoryType,
      );
      return Response.success("Category updated successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async deleteCategory(id: string) {
    try {
      const findCategory = await this.getCategory(id);
      if (findCategory.statusCode === 404) {
        return Response.error("Category not found", 404);
      }
      const result = await CategoryService.deleteCategory(id);
      return Response.success("Category deleted successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
}
