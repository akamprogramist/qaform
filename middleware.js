import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/403", request.url)); // Redirect unauthorized users
    }
    return NextResponse.next();
  } catch (error) {
    console.error("JWT error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: "/answer/:path*", // Protect admin routes
};
