import 'server-only'
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "./jwt";

export async function createSession(payload: object) {
  const token = `Bearer ${jwt.sign(payload)}`;
  const cookieStore = await cookies();
  cookieStore.set("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  redirect("/dashboard");
}

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  const [bearer, accessToken] = token.split(" ");
  if (bearer !== "Bearer" || !accessToken) return null;

  const decoded = jwt.verify(accessToken);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded))
    return null;

  return decoded
}
