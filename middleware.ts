import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth?.token
    const isLoggedIn = !!token

    // Public routes
    const publicRoutes = [
      "/",
      "/auth/login",
      "/auth/signup",
      "/browse",
    ]
    const isPublic = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route)
    )
    if (isPublic) return NextResponse.next()

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (!isLoggedIn) {
        const loginUrl = new URL("/auth/login", req.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
      }
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Protected user routes
    const protectedRoutes = ["/dashboard", "/profile", "/learn"]
    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    )

    if (isProtected && !isLoggedIn) {
      const loginUrl = new URL("/auth/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // Always run middleware, we decide manually
    },
  }
)

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks).*)",
  ],
}