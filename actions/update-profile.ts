"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const image = formData.get("image") as string;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image;

    await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.log("[UPDATE_PROFILE]", error);
    return { error: "Failed to update profile" };
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Unauthorized" };
    }

    const currentPassword = formData.get("current-password") as string;
    const newPassword = formData.get("new-password") as string;

    if (!currentPassword || !newPassword) {
      return { error: "All fields are required" };
    }

    if (newPassword.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    // Get user with password
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return { error: "User not found" };
    }

    // Verify current password
    const bcrypt = require("bcryptjs");
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return { error: "Current password is incorrect" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.log("[UPDATE_PASSWORD]", error);
    return { error: "Failed to update password" };
  }
}
