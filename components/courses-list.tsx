import { db } from "@/lib/db";
import { CourseCard } from "./course-card";

export const CoursesList = async () => {
  // 1. Fetch all PUBLISHED courses
  // We also fetch their chapters to get a "count"
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
        />
      ))}
      {courses.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10 col-span-full">
          No courses found.
        </div>
      )}
    </div>
  );
};