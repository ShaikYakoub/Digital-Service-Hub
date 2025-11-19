// auth.config.ts
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

const baseConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const { db } = await import("./lib/db");
        const existingUser = await db.user.findUnique({
          where: { email: user.email! },
        });
        if (!existingUser) {
          await db.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              role: "USER",
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        token.image = user.image ?? undefined;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "USER";
        session.user.email = (token.email as string) || "";
        session.user.name = (token.name as string) || "";
        session.user.image = token.image as string;
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

// Server-side config with providers
const serverConfig: NextAuthConfig = {
  ...baseConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials" as const,
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Partial<Record<string, unknown>>) {
        if (!credentials?.email || !credentials?.password) return null;

        // Dynamic import to avoid bundling Prisma into edge runtime
        const { db } = await import("./lib/db");
        const bcrypt = await import("bcryptjs");

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    },
  ],
};

export default serverConfig;
export { baseConfig };
