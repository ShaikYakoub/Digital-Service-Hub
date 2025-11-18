import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "ADMIN" | "USER"
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
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
        if (process.env.NODE_ENV === 'development') {
          console.log("🔐 AUTHORIZE START")
        }
        
        if (!credentials?.email || !credentials?.password) {
          if (process.env.NODE_ENV === 'development') {
            console.log("❌ Missing credentials")
          }
          return null
        }

        try {
          // Import db here to avoid pulling it into Edge runtime for middleware
          const { db } = await import("./lib/db")
          
          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (process.env.NODE_ENV === 'development') {
            console.log("User found:", !!user)
          }
          
          if (!user?.password) {
            if (process.env.NODE_ENV === 'development') {
              console.log("❌ No user or password")
            }
            return null
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (process.env.NODE_ENV === 'development') {
            console.log("Password valid:", isValid)
          }

          if (!isValid) {
            if (process.env.NODE_ENV === 'development') {
              console.log("❌ Invalid password")
            }
            return null
          }

          if (process.env.NODE_ENV === 'development') {
            console.log("✅ SUCCESS - Returning user")
          }
          
          const returnUser = {
            id: user.id,
            email: user.email!,
            name: user.name,
            role: user.role,
          }
          
          return returnUser
        } catch (error) {
          console.error("🚨 AUTHORIZE ERROR:", error)
          return null
        }
      },
    }),
  ],
})
