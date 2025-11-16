"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateChapterSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  courseId: z.string(), // We need to know which course to add to
});

export async function createChapter(formData: FormData) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    const validatedFields = CreateChapterSchema.safeParse({
      title: formData.get("title"),
      courseId: formData.get("courseId"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid data" };
    }

    const { title, courseId } = validatedFields.data;

    // 1. Find the course owner to verify
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      }
    });

    if (!courseOwner) {
      return { error: "Course not found or unauthorized" };
    }

    // 2. Find the last chapter to figure out the new position
    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    // 3. Create the new chapter
    const chapter = await db.chapter.create({
      data: {
        title,
        courseId,
        position: newPosition,
      }
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return { success: "Chapter created!" };

  } catch (error) {
    console.log("[CREATE_CHAPTER]", error);
    return { error: "Database error: Failed to create chapter." };
  }
}