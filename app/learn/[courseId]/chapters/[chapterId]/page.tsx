import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import ReactPlayer from "react-player";

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

  // 2. Security Check: Did they buy it?
  // const purchase = await db.purchase.findUnique({
  //   where: {
  //     userId_courseId: {
  //       userId,
  //       courseId: params.courseId,
  //     },
  //   },
  // });

  // // 3. Security Check: Is the chapter free?
  // // If they DIDN'T buy it AND the chapter is NOT free, kick them out.
  // if (!purchase && !chapter.isFree) {
  //   return redirect("/");
  // }

  return (
    <div className="flex h-screen text-black">
      {/* Sidebar: List of all chapters */}
      <div className="w-80 flex-shrink-0 bg-gray-100 p-6 overflow-y-auto">
        <Link
          href={`/learn/${course.id}`}
          className="flex items-center text-sm mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
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
      </main>
    </div>
  );
}
