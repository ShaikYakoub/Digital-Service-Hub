"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- ACTION 1: PUBLISH ---
export async function publishCourse(courseId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    // 1. Find the course
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: true, // We need to check the chapters
      },
    });

    if (!course) {
      return { error: "Course not found" };
    }

    // 2. --- Business Logic Check ---
    // Check if all "required" fields are present
    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.price ||
      !hasPublishedChapter
    ) {
      return { error: "Missing required fields. Please complete all sections before publishing." };
    }

    // 3. All checks passed. Publish the course.
    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: { isPublished: true },
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: "Course published!" };

  } catch (error) {
    console.log("[PUBLISH_COURSE]", error);
    return { error: "Internal Error" };
  }
}

// --- ACTION 2: UNPUBLISH ---
export async function unpublishCourse(courseId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    // Unpublish the course
    const unpublishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: { isPublished: false },
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: "Course unpublished!" };

  } catch (error) {
    console.log("[UNPUBLISH_COURSE]", error);
    return { error: "Internal Error" };
  }
}