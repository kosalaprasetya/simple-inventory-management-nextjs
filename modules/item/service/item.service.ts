import ItemRepository from "../repository/item.repository";
import {
  CreateItemType,
  ListItemQueryType,
  UpdateItemType,
} from "../types/item.types";

export default class ItemService {
  static async create(data: CreateItemType) {
    return await ItemRepository.create(data);
  }
  static async list(query: ListItemQueryType) {
    const queryList = {
      userId: query.userId,
      page: query?.page || 1,
      limit: query?.limit || 10,
      search: query?.search || "",
      filter: query?.filter || "",
      sortOrder: query?.sortOrder || "asc",
    } as ListItemQueryType;
    return await ItemRepository.list(queryList);
  }
  static async getById(id: string) {
    return await ItemRepository.getById(id);
  }
  static async listByCategoryId(
    categoryId: string,
    userId: string,
    query: ListItemQueryType,
  ) {
    const queryList = {
      userId: query.userId,
      page: query?.page || 1,
      limit: query?.limit || 10,
      search: query?.search || "",
      filter: query?.filter || "",
      sortOrder: query?.sortOrder || "asc",
    } as ListItemQueryType;
    return await ItemRepository.listByCategoryId(categoryId, userId, queryList);
  }
  static async update(id: string, data: UpdateItemType) {
    return await ItemRepository.update(id, data);
  }
  static async delete(id: string) {
    return await ItemRepository.delete(id);
  }
}
