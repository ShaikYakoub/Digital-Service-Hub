import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, DollarSign, Users, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Get admin statistics
  const [totalCourses, publishedCourses, totalPurchases, totalRevenue] =
    await Promise.all([
      db.course.count({
        where: { userId },
      }),
      db.course.count({
        where: { userId, isPublished: true },
      }),
      db.purchase.count({
        where: {
          course: { userId },
        },
      }),
      // Get total revenue by summing course prices from purchases
      db.purchase
        .findMany({
          where: {
            course: { userId },
          },
          include: {
            course: {
              select: {
                price: true,
              },
            },
          },
        })
        .then((purchases) =>
          purchases.reduce(
            (sum, purchase) => sum + (purchase.course.price || 0),
            0
          )
        ),
    ]);

  // Get recent courses
  const recentCourses = await db.course.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      _count: {
        select: {
          purchases: true,
          chapters: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back, {session.user.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your courses
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalCourses}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {publishedCourses}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalPurchases}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Courses
            </h2>
            <Link
              href="/admin/courses"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all →
            </Link>
          </div>

          {recentCourses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No courses yet. Create your first course to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/admin/courses/${course.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>{course._count.chapters} chapters</span>
                      <span>•</span>
                      <span>{course._count.purchases} sales</span>
                      <span>•</span>
                      <span
                        className={
                          course.isPublished
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    ₹{course.price || 0}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link
            href="/admin/courses"
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow"
          >
            <BookOpen className="h-8 w-8 mb-2" />
            <h3 className="text-lg font-semibold">Manage Courses</h3>
            <p className="text-sm text-blue-100 mt-1">
              Create and edit your courses
            </p>
          </Link>

          <Link
            href="/profile"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow"
          >
            <Users className="h-8 w-8 mb-2" />
            <h3 className="text-lg font-semibold">Profile Settings</h3>
            <p className="text-sm text-purple-100 mt-1">
              Update your profile information
            </p>
          </Link>

          <Link
            href="/browse"
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow"
          >
            <TrendingUp className="h-8 w-8 mb-2" />
            <h3 className="text-lg font-semibold">Browse All Courses</h3>
            <p className="text-sm text-green-100 mt-1">
              Explore available courses
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
