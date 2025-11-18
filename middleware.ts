import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  try {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Allow public routes
    const publicRoutes = [
      "/",
      "/auth/login",
      "/auth/signup",
      "/browse",
      "/api/auth",
    ]

    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(route)
    )

    // Admin routes protection
    if (pathname.startsWith("/admin")) {
      if (!isLoggedIn) {
        const loginUrl = new URL("/auth/login", req.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
      }
      if (req.auth?.user?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Protected user routes
    const protectedRoutes = ["/dashboard", "/profile", "/learn"]
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    )

    if (isProtectedRoute && !isLoggedIn) {
      const loginUrl = new URL("/auth/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // Allow the request to proceed on error
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks).*)",
  ],
}