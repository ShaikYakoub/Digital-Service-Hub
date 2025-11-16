import type { NextAuthConfig } from "next-auth"

// This is our "rulebook" for the middleware.
// It has NO DATABASE IMPORTS, so it's "Edge-safe".

export const authConfig = {
  providers: [], // We'll add providers in the main auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const session = auth
      const isAdminPage = nextUrl.pathname.startsWith("/admin")

      // 1. If it's an Admin page...
      if (isAdminPage) {
        // 2. ...and the user is NOT an Admin
        if (session?.user.role !== "ADMIN") {
          // 3. ...redirect them to the homepage
          return Response.redirect(new URL("/", nextUrl))
        }
      }

      // 4. If it's any other page, allow access
      return true
    },
  },
} satisfies NextAuthConfig