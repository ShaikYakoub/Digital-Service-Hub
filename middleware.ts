import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

const config: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
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

const { auth } = NextAuth(config);

export default auth;

export const config_export = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks).*)",
  ],
};
