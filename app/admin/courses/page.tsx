import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminCourseCard } from "@/components/admin-course-card";
import { createCourse } from "@/actions/create-course";

export const dynamic = "force-dynamic";

async function getCourses(userId: string) {
  const courses = await db.course.findMany({
    where: {
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return courses;
}

export default async function AdminCoursesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const courses = await getCourses(userId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Courses</h1>
          <CreateCourseButton />
        </div>

        <div className="mt-8">
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No courses yet.</p>
              <p className="text-gray-400 text-sm mt-2">
                Create your first course to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <AdminCourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateCourseButton() {
  async function createNewCourse(formData: FormData) {
    "use server";
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return;
    }

    formData.append("title", "Untitled Course");

    const result = await createCourse(formData);

    if (result.success && result.courseId) {
      redirect(`/admin/courses/${result.courseId}`);
    }
  }

  return (
    <form action={createNewCourse}>
      <button
        type="submit"
        className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
      >
        New Course
      </button>
    </form>
  );
}
