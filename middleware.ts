import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/login", req.url))
    }
    if (req.auth?.user?.role !== "ADMIN") {
      return Response.redirect(new URL("/", req.url))
    }
  }
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  runtime: 'nodejs',
}