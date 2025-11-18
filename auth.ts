export const runtime = "nodejs"

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email ?? undefined
        token.name = user.name ?? undefined
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "ADMIN" | "USER"
        session.user.email = token.email as string | undefined
        session.user.name = token.name as string | undefined
      }
      return session
    },

    // 🔥 All your route access logic now lives here (edge-safe)
    authorized({ auth: session, request }) {
      const pathname = request.nextUrl.pathname
      const user = session?.user
      const isLoggedIn = !!user

      const publicRoutes = [
        "/",
        "/auth/login",
        "/auth/signup",
        "/browse",
        "/api/auth",
      ]

      const isPublic = publicRoutes.some(
        (route) => pathname === route || pathname.startsWith(route)
      )

      if (isPublic) return true

      // Admin access
      if (pathname.startsWith("/admin")) {
        return isLoggedIn && user.role === "ADMIN"
      }

      // Regular user protected routes
      const protectedRoutes = ["/dashboard", "/profile", "/learn"]

      if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        return isLoggedIn
      }

      return true
    },
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { db } = await import("@/lib/db")

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user?.password) return null

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email!,
          name: user.name ?? undefined,
          role: user.role,
        }
      },
    }),
  ],
})
