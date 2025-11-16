"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// This is the export that your form is looking for
export async function updateCourse(
  courseId: string, 
  // Allow any of these values to be updated
  values: { title?: string; description?: string; imageUrl?: string; price?: number; isPublished?: boolean }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    // Update the course in the database
    const course = await db.course.update({
      where: {
        id: courseId,
        userId, // Critical security check: only update if YOU own it
      },
      data: {
        ...values,
      },
    });

    // Refresh the page so the user sees the new data
    revalidatePath(`/admin/courses/${courseId}`);

    return { success: "Course updated", course };
    
  } catch (error) {
    console.log("[COURSE_UPDATE]", error);
    return { error: "Internal Error" };
  }
}