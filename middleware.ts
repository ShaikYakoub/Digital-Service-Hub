import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ["/", "/auth/login", "/auth/signup", "/browse", "/api/auth"]
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check for session token in cookies
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value

  const isLoggedIn = !!sessionToken

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    // Role check would need to be done server-side since we can't decode JWT here
  }

  // Protected user routes
  const protectedRoutes = ["/dashboard", "/profile", "/learn"]
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks).*)",
  ],
}
