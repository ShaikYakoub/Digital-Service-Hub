import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import config from "@/auth.config";

export const runtime = "nodejs";

export const POST = NextAuth({
  ...config,
  providers: config.providers.map((provider) => {
    if (provider.id !== "credentials") return provider;

    return {
      ...provider,
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email!,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    };
  }),
});
