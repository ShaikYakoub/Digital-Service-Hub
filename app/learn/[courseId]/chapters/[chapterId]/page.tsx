import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import ReactPlayer from "react-player";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function LearnChapterPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  const { courseId, chapterId } = await params;
  if (!userId) return redirect("/");

  // 1. Fetch the Course AND the specific Chapter
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
      },
    },
  });

  const chapter = await db.chapter.findUnique({
    where: { id: chapterId, courseId: courseId },
  });

  if (!course || !chapter) return redirect("/");

  // Check if user has purchased the course
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  const hasAccess = purchase || chapter.isFree;
  const isPaidCourse = course.price && course.price > 0;

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen text-black">
        {/* Sidebar: List of all chapters */}
        <div className="w-80 flex-shrink-0 bg-gray-100 p-6 overflow-y-auto">
          <Link href="/browse" className="flex items-center text-sm mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
          <h2 className="text-xl font-bold mb-4">{course.title}</h2>
          <nav className="flex flex-col gap-2">
            {course.chapters.map((chap) => (
              <Link
                href={`/learn/${course.id}/chapters/${chap.id}`}
                key={chap.id}
                className={`p-3 rounded-md flex items-center gap-2 ${
                  chap.id === chapter.id ? "bg-sky-200" : "hover:bg-gray-200"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                {chap.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content: Video Player */}
        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold mb-4">{chapter.title}</h1>

          {hasAccess ? (
            <>
              {chapter.videoUrl ? (
                <div className="relative aspect-video mb-4">
                  <ReactPlayer
                    src={chapter.videoUrl}
                    controls={true}
                    width="100%"
                    height="100%"
                    playing={false}
                  />
                </div>
              ) : (
                <div className="relative aspect-video mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">No video available</p>
                    <p className="text-sm">
                      This chapter doesn&apos;t have a video yet.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 border rounded-md bg-white">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p>{chapter.description || "No description available."}</p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {/* Blurred Video */}
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center text-white">
                    <BookOpen className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Premium Content</h3>
                    <p className="text-lg mb-4">Buy this course to unlock this chapter</p>
                    <Link
                      href={`/learn/${course.id}`}
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Buy Course - ₹{course.price}
                    </Link>
                  </div>
                </div>
                <div className="relative aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Content Locked</p>
                  </div>
                </div>
              </div>

              {/* Blurred Description */}
              <div className="relative mt-4 p-4 border rounded-md bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gray-900 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Chapter Description</h3>
                    <p className="text-gray-600">Purchase the course to view the full description</p>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2 opacity-50">Description</h2>
                <p className="opacity-50">{chapter.description || "No description available."}</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="px-4 py-3 border-b bg-white">
          <Link href="/browse" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </div>

        {/* Video Player - Top */}
        <div className="px-4 py-4 bg-white">
          <h1 className="text-xl font-bold mb-3">{chapter.title}</h1>
          {hasAccess ? (
            chapter.videoUrl ? (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <ReactPlayer
                  src={chapter.videoUrl}
                  controls={true}
                  width="100%"
                  height="100%"
                  playing={false}
                />
              </div>
            ) : (
              <div className="relative aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm font-medium">No video available</p>
                </div>
              </div>
            )
          ) : (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center text-white">
                  <BookOpen className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="text-lg font-bold mb-2">Premium Content</h3>
                  <p className="text-sm mb-3">Buy this course to unlock this chapter</p>
                  <Link
                    href={`/learn/${course.id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Buy Course - ₹{course.price}
                  </Link>
                </div>
              </div>
              <div className="relative aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm font-medium">Content Locked</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chapter Selection Bar - Middle */}
        <div className="px-4 py-3 bg-white border-y">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {course.chapters.map((chap) => (
              <Link
                href={`/learn/${course.id}/chapters/${chap.id}`}
                key={chap.id}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  chap.id === chapter.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {chap.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Chapter Details - Bottom */}
        <div className="px-4 py-4">
          {hasAccess ? (
            <div className="bg-white rounded-lg p-4 border">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-gray-700">{chapter.description || "No description available."}</p>
            </div>
          ) : (
            <div className="relative bg-white rounded-lg p-4 border overflow-hidden">
              <div className="absolute inset-0 bg-gray-900 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <h3 className="text-sm font-bold text-gray-700 mb-1">Chapter Description</h3>
                  <p className="text-xs text-gray-600">Purchase the course to view</p>
                </div>
              </div>
              <h2 className="text-lg font-semibold mb-3 opacity-50">Description</h2>
              <p className="text-gray-700 opacity-50">{chapter.description || "No description available."}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
