import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { z } from "zod"
import { authConfig } from "./auth.config" // Import our new rules

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },

  // We import all the callbacks (authorized, jwt, session) from our config
  callbacks: {
    ...authConfig.callbacks,
  },

  providers: [
    ...authConfig.providers,
    Credentials({
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
            // Return the full user object so the JWT callback gets it
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