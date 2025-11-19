import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  // Delete existing tokens for this email
  await db.passwordResetToken.deleteMany({
    where: { email },
  });

  // Create new token
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};