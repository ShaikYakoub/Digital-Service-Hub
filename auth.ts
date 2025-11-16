import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { z } from "zod"

// 1. Define the schema for the login form
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },

  // 2. ADD THIS NEW CALLBACKS SECTION
  callbacks: {
    async jwt({ token }) {
      // 1. Check if user is already in the token (they just logged in)
      if (!token.sub) return token 

      // 2. Fetch the user from the database
      const existingUser = await db.user.findUnique({
        where: { id: token.sub },
      })

      // 3. If user doesn't exist, do nothing
      if (!existingUser) return token

      // 4. Add the role to the token
      token.role = existingUser.role

      return token
    },
    async session({ session, token }) {
      // 5. Add the role from the token to the session
      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER"
      }
      return session
    },
  },
  // (End of new callbacks section)

  providers: [
    Credentials({
      // ... (your existing credentials code is perfect, no change needed) ...
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedFields = loginSchema.safeParse(credentials)

        if (!validatedFields.success) {
          return null
        }

        const { email, password } = validatedFields.data

        const user = await db.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          return null
        }

        const passwordsMatch = await compare(password, user.password)

        if (passwordsMatch) {
          return user
        }

        return null
      },
    }),
  ],
})