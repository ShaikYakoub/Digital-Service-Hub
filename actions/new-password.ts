"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const newPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  token: z.string().min(1, "Token is required"),
});

export const newPassword = async (values: z.infer<typeof newPasswordSchema>) => {
  const validatedFields = newPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { password, token } = validatedFields.data;

  // Check if token exists and hasn't expired
  const existingToken = await db.passwordResetToken.findUnique({
    where: { token },
  });

  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  // Check if user exists
  const existingUser = await db.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    return { error: "User not found" };
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update user password
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  // Delete the used token
  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated successfully" };
};