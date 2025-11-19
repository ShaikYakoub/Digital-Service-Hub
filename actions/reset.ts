"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
});

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await db.user.findUnique({
    where: { email }
  });

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  try {
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );
  } catch (error) {
    console.error("Email sending failed:", error);
    return { error: "Failed to send reset email. Please try again later." };
  }

  return { success: "Reset email sent!" };
};