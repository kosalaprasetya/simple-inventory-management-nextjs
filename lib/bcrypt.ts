import bcrypt from "bcryptjs";

export default class Bcrypt {
  static async hash(password: string, saltRounds: number | undefined = 10) {
    return await bcrypt.hash(password, saltRounds);
  }

  static async compare(password: string, hashed: string) {
    return await bcrypt.compare(password, hashed);
  }
}
