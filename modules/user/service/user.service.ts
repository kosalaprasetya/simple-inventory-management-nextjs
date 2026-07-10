import {
  CreateUserType,
  ListUserQueryType,
  UpdateUserType,
} from "../types/user.type";

import Bcrypt from "@/lib/bcrypt";
import UserRepository from "../repository/user.repository";

export default class UserService {
  static async create(data: CreateUserType) {
    const { name, email, password, role } = data;
    const existingUser = await UserRepository.getByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const payload = {
      name,
      email,
      password: await Bcrypt.hash(password),
      role,
    } as CreateUserType;
    return await UserRepository.create(payload);
  }
  static async list(query?: ListUserQueryType) {
    const listQuery = {
      page: query?.page || 1,
      limit: query?.limit || 10,
      search: query?.search || "",
      filter: query?.filter || "",
      sortOrder: query?.sortOrder || "asc",
    } as ListUserQueryType;
    return await UserRepository.list(listQuery);
  }
  static async getByEmail(email: string) {
    return await UserRepository.getByEmail(email);
  }
  static async getById(id: string) {
    return await UserRepository.getById(id);
  }
  static async update(id: string, data: UpdateUserType) {
    const existingUser = await UserRepository.getById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    const updatedData: UpdateUserType = { ...data };
    if (data.password) {
      updatedData.password = await Bcrypt.hash(data.password);
    }
    return await UserRepository.update(id, updatedData);
  }
  static async delete(id: string) {
    const existingUser = await UserRepository.getById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    return await UserRepository.delete(id);
  }
}
