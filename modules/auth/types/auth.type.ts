import { z } from "zod";
import AuthValidation from "../validation/auth.schema";

export type RegisterType = z.infer<typeof AuthValidation.REGISTER>;
export type LoginType = z.infer<typeof AuthValidation.LOGIN>;
