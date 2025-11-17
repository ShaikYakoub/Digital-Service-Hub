import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChapterTitleForm } from "@/components/admin/chapter/chapter-title-form";
import { ChapterDescriptionForm } from "@/components/admin/chapter/chapter-description-form";
import { ChapterAccessForm } from "@/components/admin/chapter/chapter-access-form";
import { ChapterVideoForm } from "@/components/admin/chapter/chapter-video-form";

export default async function ChapterIdPage({
  params
}: {
  params: Promise<{ courseId: string; chapterId: string }>
}) {
  const { courseId, chapterId } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return redirect("/");

  // 1. Fetch the Chapter
  // We verify it belongs to the correct course
  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId
    },
    include: {
      course: true // We might need course data later
    }
  });

  // 2. Security Check: Ensure the logged-in user owns the course
  if (!chapter || chapter.course.userId !== userId) {
    return redirect("/");
  }

  return (
    <div className="p-6 text-black">
      {/* Back Button */}
      <div className="flex items-center w-full mb-6">
        <Link 
          href={`/admin/courses/${courseId}`}
          className="flex items-center text-sm hover:opacity-75 transition"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to course setup
        </Link>
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">
            Chapter Creation
          </h1>
          <span className="text-sm text-slate-700">
            Complete all fields
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <h2 className="text-xl">
                Customize your chapter
              </h2>
            </div>
            {/* We will reuse our TitleForm here! */}
            {/* 2. Add the new component here */}
            <ChapterTitleForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />

            {/* 2. Add the new component here */}
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />

            {/* 2. Add the new Access Form */}
          <ChapterAccessForm
            initialData={chapter}
            courseId={courseId}
            chapterId={chapterId}
          />

          {/* Add the Video Form */}
          <div className="mt-6">
            <div className="flex items-center gap-x-2">
              <h2 className="text-xl">
                Chapter Video
              </h2>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-x-2">
            <h2 className="text-xl">
              Access Settings
            </h2>
          </div>
          {/* We will add "Is Free" and "Video" here later */}
        </div>
      </div>
    </div>
  );
}