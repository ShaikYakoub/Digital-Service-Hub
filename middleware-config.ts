// middleware-config.ts
import type { NextAuthConfig } from "next-auth";

const config: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "USER";
        session.user.email = (token.email as string) || "";
        session.user.name = (token.name as string) || "";
      }
      return session;
    },

    authorized({ auth: session, request }) {
      const pathname = request.nextUrl.pathname;
      const user = session?.user;

      const publicRoutes = [
        "/",
        "/auth/login",
        "/auth/signup",
        "/browse",
        "/api/auth",
      ];

      if (publicRoutes.some((r) => pathname.startsWith(r))) {
        return true;
      }

      if (pathname.startsWith("/admin")) {
        return !!user && user.role === "ADMIN";
      }

      const protectedRoutes = ["/dashboard", "/profile", "/learn"];
      if (protectedRoutes.some((r) => pathname.startsWith(r))) {
        return !!user;
      }

      return true;
    },
  },

  providers: [],
};

export default config;