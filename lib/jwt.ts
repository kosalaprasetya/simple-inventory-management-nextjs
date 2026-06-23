import 'server-only'
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "xx342dsf4!324#r34r4t43t4";

export default class token {
  static sign(payload: object) {
    return jwt.sign(payload, jwtSecret);
  }

  static verify(token: string) {
    try {
      const verifyToken = jwt.verify(token, jwtSecret);
      return verifyToken;
    } catch {
      return null;
    }
  }
}
