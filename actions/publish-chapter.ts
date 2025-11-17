"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- ACTION 1: PUBLISH ---
export async function publishChapter(chapterId: string, courseId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    // Security Check: Make sure the user owns the course
    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    // --- Business Logic Check ---
    // A chapter can only be published if it has a title, description, AND video
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });

    if (!chapter || !chapter.title || !chapter.description || !chapter.videoUrl) {
      return { error: "Missing required fields. Please complete all fields before publishing." };
    }

    // All checks passed. Publish the chapter.
    const publishedChapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { isPublished: true },
    });

    revalidatePath(`/admin/courses/${courseId}/chapters/${chapterId}`);
    return { success: "Chapter published!", chapter: publishedChapter };

  } catch (error) {
    console.log("[PUBLISH_CHAPTER]", error);
    return { error: "Internal Error" };
  }
}

// --- ACTION 2: UNPUBLISH ---
export async function unpublishChapter(chapterId: string, courseId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    // Security Check
    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    // Unpublish the chapter
    const unpublishedChapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { isPublished: false },
    });
    
    // We also might need to unpublish the *entire course* if this was the last chapter
    // (We'll add that logic later)

    revalidatePath(`/admin/courses/${courseId}/chapters/${chapterId}`);
    return { success: "Chapter unpublished!", chapter: unpublishedChapter };

  } catch (error) {
    console.log("[UNPUBLISH_CHAPTER]", error);
    return { error: "Internal Error" };
  }
}