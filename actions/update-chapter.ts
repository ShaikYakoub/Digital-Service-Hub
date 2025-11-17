"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateChapter(
  chapterId: string,
  courseId: string, // We need courseId for security and revalidation
  values: { title?: string; description?: string; videoUrl?: string; isFree?: boolean; isPublished?: boolean }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Unauthorized" };
    }

    // Security Check: Make sure the user owns the *course* this chapter belongs to
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      }
    });

    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    // Now, update the chapter
    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        ...values,
      },
    });

    // Revalidate the path for this chapter page
    revalidatePath(`/admin/courses/${courseId}/chapters/${chapterId}`);

    return { success: "Chapter updated", chapter };
    
  } catch (error) {
    console.log("[CHAPTER_UPDATE]", error);
    return { error: "Internal Error" };
  }
}