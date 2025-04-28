import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const publicRoutes = [
  "/login",
  "/signup",
  "/forget-password",
  "/reset-password",
  "/reset-password/[token]",
  "/about-us",
  "/contact-us",
  "our-services",
  "/",
];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const token = (await cookies()).get(`${process.env.COOKIE_NAME}`)?.value;

  if (isPublicRoute && !token) {
    return NextResponse.next();
  }
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
