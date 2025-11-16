"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// We can use Zod to validate the title
const CreateCourseSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
});

export async function createCourse(formData: FormData) {
  // Check Auth
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || session.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  // Validate data
  const validatedFields = CreateCourseSchema.safeParse({
    title: formData.get("title"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid title" };
  }

  const { title } = validatedFields.data;

  // Create the course in the Database
  let course;
  try {
    course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    // Revalidate the "courses" page so our new course shows up
    revalidatePath("/admin/courses");
    
    // Return a success message and the new course ID
    return { success: "Course created!", courseId: course.id };
    
  } catch (error) {
    return { error: "Database error: Failed to create course." };
  }

  // We DO NOT redirect from the server action anymore
}