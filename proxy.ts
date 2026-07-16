import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "xx342dsf4!324#r34r4t43t4";

const protectedRoutes = ["/dashboard", "/items", "/category", "/users", "/profile"];
const authRoutes = ["/auth/login", "/auth/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      const [, accessToken] = token.split(" ");
      if (accessToken) {
        jwt.verify(accessToken, JWT_SECRET);
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  const isAuth = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuth && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/items/:path*", "/category/:path*", "/users/:path*", "/profile/:path*", "/auth/:path*"],
};
