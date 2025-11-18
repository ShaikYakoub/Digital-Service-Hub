import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { TitleForm } from "@/components/admin/course/title-form";
import { DescriptionForm } from "@/components/admin/course/description-form";
import { ImageForm } from "@/components/admin/course/image-form";
import { PriceForm } from "@/components/admin/course/price-form";
import { ChaptersForm } from "@/components/admin/course/chapters-form";
import { CoursePublishButton } from "@/components/admin/course/course-publish-button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CourseWithChapters = {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  chapters: {
    id: string;
    isPublished: boolean;
  }[];
};

function getCompletionStatus(course: CourseWithChapters) {
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const completedFields = requiredFields.filter(Boolean).length;
  const totalFields = requiredFields.length;

  return { completed: completedFields, total: totalFields };
}

export default async function CourseIdPage({
  params,
}: {
  // 1. FIX: params is a Promise
  params: Promise<{ courseId: string }>;
}) {
  // 2. FIX: We must await params before using them
  const { courseId } = await params;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findFirst({
    where: {
      id: courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/admin/courses");
  }

  const { completed, total } = getCompletionStatus(course);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/courses"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields ({completed}/{total})
            </span>
          </div>
          <CoursePublishButton initialData={course} courseId={course.id} />
        </div>

        {/* --- This is the 2-Column Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          {/* Column 1: Title, Desc, Image, Price */}
          <div>
            <div className="flex items-center gap-x-2">
              <h2 className="text-xl">Customize your course</h2>
            </div>

            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <PriceForm initialData={course} courseId={course.id} />
          </div>

          {/* Column 2: Chapters */}
          <div>
            <div className="flex items-center gap-x-2">
              <h2 className="text-xl">Course chapters</h2>
            </div>

            <ChaptersForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
