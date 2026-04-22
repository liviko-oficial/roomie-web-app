import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/students/profile"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value || request.cookies.get("jwtToken")?.value;
  const isProtected = PROTECTED_PATHS.some((p) => request.nextUrl.pathname.startsWith(p));

  if (isProtected && !token) {
    const loginUrl = new URL("/login-landlord", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/students/:path*"],
};
