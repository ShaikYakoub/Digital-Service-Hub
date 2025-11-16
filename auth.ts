import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db" // Node.js-safe
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { z } from "zod"
import { authConfig } from "./auth.config" // Import the "lite" rules

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, // 1. Spread the "lite" rules (like the authorized callback)
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },

  // 2. Add the Node.js-specific callbacks back in
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await db.user.findUnique({
        where: { id: token.sub },
      })

      if (!existingUser) return token
      token.role = existingUser.role
      return token
    },
    async session({ session, token }) {
      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER"
      }
      return session
    },

    // 3. We must "merge" this with the authorized callback from authConfig
    ...authConfig.callbacks,
  },

  providers: [
    ...authConfig.providers,
    Credentials({
      // ... (Your existing Credentials provider is perfect) ...
      authorize: async (credentials) => {
        try {
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
        } catch (error) {
          console.error("Credentials authorize error:", error)
          return null
        }
      },
    }),
  ],
})