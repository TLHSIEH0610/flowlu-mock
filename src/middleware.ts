import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthCookie } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = await getAuthCookie();
  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";

  // If user is not logged in and trying to access protected routes
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in and trying to access auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/tickets", request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
