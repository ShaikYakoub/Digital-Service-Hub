"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteCourse(courseId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    // Verify the course belongs to the user
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!course) {
      return { error: "Course not found or unauthorized" };
    }

    // Delete the course (chapters will be deleted automatically due to cascade)
    await db.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    console.log("[DELETE_COURSE]", error);
    return { error: "Failed to delete course" };
  }
}
