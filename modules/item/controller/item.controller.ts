import Response from "@/lib/response";
import ItemService from "../service/item.service";
import formatError from "@/lib/formatError";
import {
  CreateItemType,
  ListItemQueryType,
  UpdateItemType,
} from "../types/item.types";
import Validation from "@/lib/validation";
import ItemValidation from "../validation/item.schema";

export default class ItemController {
  static async createItem(data: CreateItemType) {
    try {
      const validatedInput = Validation.validate(ItemValidation.CREATE, data);
      if (!validatedInput.success || !validatedInput.data) {
        return Response.error("Validation failed", 400, validatedInput.errors);
      }
      const result = await ItemService.create(
        validatedInput.data as CreateItemType,
      );
      return Response.success("Item created successfully", 201, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async listItems(query: ListItemQueryType) {
    try {
      const result = await ItemService.list(query);
      return Response.success("Items retrieved successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async getItemById(id: string) {
    try {
      const result = await ItemService.getById(id);
      if (!result) {
        return Response.error("Item not found", 404);
      }
      return Response.success("Item retrieved successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async listItemsByCategoryId(
    categoryId: string,
    userId: string,
    query: ListItemQueryType,
  ) {
    try {
      const result = await ItemService.listByCategoryId(
        categoryId,
        userId,
        query,
      );
      return Response.success("Items retrieved successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async updateItem(id: string, data: UpdateItemType) {
    try {
      const validatedInput = Validation.validate(ItemValidation.UPDATE, data);
      if (!validatedInput.success || !validatedInput.data) {
        return Response.error("Validation failed", 400, validatedInput.errors);
      }
      const result = await ItemService.update(
        id,
        validatedInput.data as UpdateItemType,
      );
      if (!result) {
        return Response.error("Item not found", 404);
      }
      return Response.success("Item updated successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async deleteItem(id: string) {
    try {
      const result = await ItemService.delete(id);
      if (!result) {
        return Response.error("Item not found", 404);
      }
      return Response.success("Item deleted successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
}
