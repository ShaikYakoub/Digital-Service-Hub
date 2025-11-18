import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import config from "@/auth.config";

export const runtime = "nodejs";

export const POST = NextAuth({
  ...config,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providers: config.providers.map((provider: any) => {
    if (provider.id !== "credentials") return provider;

    return {
      ...provider,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: async (credentials: any) => {
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
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    };
  }),
});
