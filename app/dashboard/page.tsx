import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch user's purchased courses with progress
  const purchases = await db.purchase.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          chapters: {
            where: { isPublished: true },
            orderBy: { position: "asc" },
            include: {
              userProgress: {
                where: { userId: session.user.id },
              },
            },
          },
        },
      },
    },
  });

  // Calculate progress for each course
  const coursesWithProgress = purchases.map((purchase) => {
    const totalChapters = purchase.course.chapters.length;
    const completedChapters = purchase.course.chapters.filter((chapter) =>
      chapter.userProgress.some((progress) => progress.isCompleted)
    ).length;
    const progressPercentage =
      totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

    return {
      ...purchase.course,
      progress: progressPercentage,
      completedChapters,
      totalChapters,
    };
  });

  // Fetch some featured courses (published courses not purchased by user)
  const purchasedCourseIds = purchases.map((p) => p.courseId);
  const featuredCourses = await db.course.findMany({
    where: {
      isPublished: true,
      id: { notIn: purchasedCourseIds },
    },
    include: {
      chapters: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
    },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">
              Welcome back, {session.user.name || "Student"}!
            </CardTitle>
            <CardDescription>
              Track your learning progress and continue your courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {(session.user.name || session.user.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">
                  {session.user.name || "Student"}
                </h3>
                <p className="text-sm text-gray-600">{session.user.email}</p>
                <Badge variant="secondary" className="mt-1">
                  {session.user.role === "ADMIN" ? "Administrator" : "Student"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
          {coursesWithProgress.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-600 mb-4">
                  You haven&apos;t purchased any courses yet.
                </p>
                <Link href="/">
                  <Button>Browse Courses</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {coursesWithProgress.map((course) => {
                const firstChapter = course.chapters.find(
                  (chapter) => chapter.isPublished
                );
                const href = firstChapter
                  ? `/learn/${course.id}/chapters/${firstChapter.id}`
                  : `/learn/${course.id}`;

                return (
                  <Link key={course.id} href={href}>
                    <Card className="hover:shadow-lg transition-all overflow-hidden border rounded-lg p-3 h-full bg-white hover:border-black cursor-pointer">
                      <CardHeader className="p-0">
                        <div className="relative w-full aspect-video rounded-md overflow-hidden mb-3">
                          {course.imageUrl ? (
                            <Image
                              src={course.imageUrl}
                              alt={course.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <span className="text-gray-500">No Image</span>
                          )}
                        </div>
                        <CardTitle className="text-lg flex items-center justify-between">
                          {course.title}
                          <Badge
                            variant="default"
                            className="text-xs bg-green-600"
                          >
                            Purchased
                          </Badge>
                        </CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 pt-4">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{Math.round(course.progress)}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                            <p className="text-xs text-gray-600 mt-1">
                              {course.completedChapters} of{" "}
                              {course.totalChapters} chapters completed
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Courses
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => {
                const firstChapter = course.chapters.find(
                  (chapter) => chapter.isPublished
                );
                const href = firstChapter
                  ? `/learn/${course.id}/chapters/${firstChapter.id}`
                  : `/learn/${course.id}`;

                return (
                  <Link key={course.id} href={href}>
                    <Card className="hover:shadow-lg transition-all overflow-hidden border rounded-lg p-3 h-full bg-white hover:border-black cursor-pointer">
                      <CardHeader className="p-0">
                        <div className="relative w-full aspect-video rounded-md overflow-hidden mb-3">
                          {course.imageUrl ? (
                            <Image
                              src={course.imageUrl}
                              alt={course.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <span className="text-gray-500">No Image</span>
                          )}
                        </div>
                        <CardTitle className="text-lg">
                          {course.title}
                        </CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-bold text-lg text-green-600">
                            {course.price ? `$${course.price}` : "Free"}
                          </div>
                          <div className="flex items-center gap-1">
                            {course.price ? (
                              <Badge variant="secondary" className="text-xs">
                                Paid
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-xs text-green-600 border-green-600"
                              >
                                Free
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
