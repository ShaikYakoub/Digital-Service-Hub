import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [], 
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminPage = nextUrl.pathname.startsWith("/admin")
      
      if (isAdminPage) {
        // 1. Check if user is logged in first
        if (!isLoggedIn) {
             return false // Redirects to login
        }
        
        // 2. Check if the user has the ADMIN role
        // FIXED: We check auth.user.role, not auth.token.role
        if (auth.user.role !== "ADMIN") {
          return Response.redirect(new URL("/", nextUrl))
        }
      }
      
      return true
    },

    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    
    session({ session, token }) {
      // 1. Add the User ID to the session (CRITICAL FIX)
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      // 2. Add the Role to the session
      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER"
      }
      
      return session
    },
  },
} satisfies NextAuthConfig