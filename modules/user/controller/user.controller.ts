import {
  CreateUserType,
  ListUserQueryType,
  UpdateUserType,
} from "../types/user.type";
import UserService from "../service/user.service";
import formatError from "@/lib/formatError";
import Response from "@/lib/response";
import Validation from "@/lib/validation";
import UserValidation from "../validation/user.schema";
import { ResponseType } from "@/lib/types";

export default class UserController {
  static async create(data: CreateUserType): Promise<ResponseType> {
    try {
      const validateInput = Validation.validate(UserValidation.CREATE, data);
      if (!validateInput.success) {
        return Response.error("Validation failed", 400, validateInput.errors);
      }
      const result = await UserService.create(
        validateInput.data as CreateUserType,
      );
      return Response.success("user created successfully", 201, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async list(query?: ListUserQueryType): Promise<ResponseType> {
    try {
      const result = await UserService.list(query);
      return Response.success("users retrieved successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async getByEmail(email: string): Promise<ResponseType> {
    try {
      const result = await UserService.getByEmail(email);
      if (!result) {
        return Response.error("User not found", 404);
      }
      return Response.success("user retrieved successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async getUserById(id: string): Promise<ResponseType> {
    try {
      const result = await UserService.getById(id);
      if (!result) {
        return Response.error("User not found", 404);
      }
      return Response.success("user retrieved successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async update(id: string, data: UpdateUserType): Promise<ResponseType> {
    try {
      const findUser = await this.getUserById(id);
      if (findUser.statusCode === 404) {
        return Response.error("User not found", 404);
      }
      const validateInput = Validation.validate(UserValidation.UPDATE, data);
      if (!validateInput.success) {
        return Response.error("Validation failed", 400, validateInput.errors);
      }
      const result = await UserService.update(
        id,
        validateInput.data as UpdateUserType,
      );
      return Response.success("user updated successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
  static async delete(id: string): Promise<ResponseType> {
    try {
      const findUser = await this.getUserById(id);
      if (findUser.statusCode === 404) {
        return Response.error("User not found", 404);
      }
      const result = await UserService.delete(id);
      return Response.success("user deleted successfully", 200, result);
    } catch (error) {
      const errors = formatError(error);
      return Response.error("Error occurred!", 500, errors);
    }
  }
}
