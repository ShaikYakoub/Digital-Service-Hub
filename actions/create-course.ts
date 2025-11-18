"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";

// We can use Zod to validate the title
const CreateCourseSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
});

// This is the export that your page is looking for
export async function createCourse(formData: FormData) {
  try {
    // 1. Check Auth
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || session?.user?.role !== "ADMIN") {
      return { error: "Unauthorized: You must be an admin to create a course." };
    }

    // 2. Extract and validate data from FormData
    const title = formData.get("title") as string;

    const validatedFields = CreateCourseSchema.safeParse({ title });

    if (!validatedFields.success) {
      return { error: "Invalid fields provided." };
    }

    const { title: validatedTitle } = validatedFields.data;

    // 3. Create the course in the Database
    const course = await db.course.create({
      data: {
        userId,
        title: validatedTitle,
      },
    });

    // 4. Revalidate the "courses" page so our new course shows up
    revalidatePath("/admin/courses");

    // 5. Return a success message and the new course ID
    return { success: "Course created!", courseId: course.id };

  } catch (error) {
    console.error("[CREATE_COURSE_ACTION]", error);
    return { error: "An unexpected database error occurred." };
  }
}