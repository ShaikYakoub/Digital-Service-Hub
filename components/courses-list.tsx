import { db } from "@/lib/db";
import { auth } from "@/auth";
import { CourseCard } from "./course-card";
import { BookOpen } from "lucide-react";

type CourseWithBasicChapters = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  chapters: Array<{
    id: string;
    isPublished: boolean;
  }>;
};

export const CoursesList = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

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

    // 2. If user is logged in, check which courses they've purchased
    let purchasedCourseIds: string[] = [];
    if (userId) {
      const purchases = await db.purchase.findMany({
        where: { userId },
        select: { courseId: true },
      });
      purchasedCourseIds = purchases.map((p) => p.courseId);
    }

    return (
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isPurchased={purchasedCourseIds.includes(course.id)}
            userId={userId}
          />
        ))}
        {courses.length === 0 && (
          <div className="text-center text-gray-500 mt-10 col-span-full">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses available
            </h3>
            <p className="text-sm text-gray-500">
              Check back later for new courses!
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading courses:", error);
    return (
      <div className="text-center text-red-500 mt-10">
        <p className="text-lg font-medium">Failed to load courses</p>
        <p className="text-sm mt-2">Please try again later</p>
      </div>
    );
  }
};
