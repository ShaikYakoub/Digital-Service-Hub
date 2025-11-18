"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteChapter(chapterId: string, courseId: string) {
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

    // Delete the chapter
    await db.chapter.delete({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.log("[DELETE_CHAPTER]", error);
    return { error: "Failed to delete chapter" };
  }
}
