import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const publicRoutes = [
  "/home",
  "/login",
  "/signup",
  "/forget-password",
  "/reset-password",
  "/reset-password/[token]",
  "/about-us",
  "/contact-us",
  "/our-services",
  "/",
];

function pathStartsWith(path, prefixes) {
  return prefixes.some((prefix) => path.startsWith(prefix));
}

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.COOKIE_NAME)?.value;

  if (path === "/" && !token) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (publicRoutes.includes(path) && !token) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(path) && token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      if (payload.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const role = payload.role;

    if (role === "admin" && !path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    if (role !== "admin" && path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|txt|json|woff|woff2|eot|ttf|otf)$).*)",
  ],
};
