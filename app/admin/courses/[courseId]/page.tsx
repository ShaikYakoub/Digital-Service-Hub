import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function CourseIdPage({
  params
}: {
  // 1. Fix: params is now a Promise
  params: Promise<{ courseId: string }>
}) {
  // 2. Fix: We must await params before using them
  const { courseId } = await params;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  // 3. Fix: Use findFirst instead of findUnique
  // findUnique allows only the ID. findFirst allows ID + userId (Security)
  const course = await db.course.findFirst({
    where: {
      id: courseId,
      userId
    }
  });

  if (!course) {
    return redirect("/admin/courses");
  }

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">
        Course Setup
      </h1>
      <div className="border p-4 rounded-md bg-white">
        <p>Course ID: {course.id}</p>
        <p className="text-xl mt-2">Title: {course.title}</p>
      </div>
    </div>
  );
}