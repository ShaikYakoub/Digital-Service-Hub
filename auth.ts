import NextAuth from "next-auth"
import { db } from "./lib/db"
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
        console.log("🔐 AUTHORIZE START")
        console.log("Credentials:", JSON.stringify(credentials, null, 2))
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials")
          return null
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
          })

          console.log("User found:", !!user)
          
          if (!user?.password) {
            console.log("❌ No user or password")
            return null
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          console.log("Password valid:", isValid)

          if (!isValid) {
            console.log("❌ Invalid password")
            return null
          }

          console.log("✅ SUCCESS - Returning user")
          const returnUser = {
            id: user.id,
            email: user.email!,
            name: user.name,
            role: user.role,
          }
          console.log("Return object:", JSON.stringify(returnUser, null, 2))
          return returnUser
        } catch (error) {
          console.error("🚨 AUTHORIZE ERROR:", error)
          return null
        }
      },
    }),
  ],
})
