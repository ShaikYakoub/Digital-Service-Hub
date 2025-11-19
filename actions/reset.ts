"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

const resetSchema = z.object({
  email: z.string().email(),
});

export const resetPassword = async (values: z.infer<typeof resetSchema>) => {
  const validatedFields = resetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email address" };
  }

  const { email } = validatedFields.data;

  // Check if user exists
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    // Don't reveal if user exists or not for security
    return { success: "If an account with that email exists, we've sent you a password reset link." };
  }

  // Generate token and send email
  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(email, passwordResetToken.token);

  return { success: "If an account with that email exists, we've sent you a password reset link." };
};