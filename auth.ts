// auth.ts
import NextAuth from "next-auth";
import serverConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth(serverConfig);
