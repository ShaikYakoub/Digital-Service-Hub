import NextAuth from "next-auth"
import { authConfig } from "./auth.config" // Import our new rules

export default NextAuth(authConfig).auth

// This config is the same as before
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}