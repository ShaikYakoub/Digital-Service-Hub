import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { TitleForm } from "@/components/admin/course/title-form";
import { DescriptionForm } from "@/components/admin/course/description-form";
import { ImageForm } from "@/components/admin/course/image-form";
import { PriceForm } from "@/components/admin/course/price-form";
import { ChaptersForm } from "@/components/admin/course/chapters-form";
import { CoursePublishButton } from "@/components/admin/course/course-publish-button";

export default async function CourseIdPage({
  params
}: {
  // Fix: params is now a Promise
  params: Promise<{ courseId: string }>
}) {
  // Fix: We must await params before using them
  const { courseId } = await params;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  // Fix: Use findFirst instead of findUnique
  const course = await db.course.findFirst({
    where: {
      id: courseId,
      userId
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc" // Order chapters from 1, 2, 3...
        }
      }
    }
  });

  if (!course) {
    return redirect("/admin/courses");
  }

  return (
    <div className="p-6 text-black">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">
            Course Setup
          </h1>
          <span className="text-sm text-slate-700">
            Complete all fields (2/5)
          </span>
        </div>
        <CoursePublishButton
          initialData={course}
          courseId={course.id}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <h2 className="text-xl">
              Customize your course
            </h2>
          </div>
          
          {/* Add the Title Form */}
          <TitleForm
            initialData={course}
            courseId={course.id}
          />
          
          {/* Add the new Description Form */}
          <DescriptionForm
            initialData={course}
            courseId={course.id}
          />

          {/* Add the Image Form */}
          <ImageForm
            initialData={course}
            courseId={course.id}
          />

          {/* Add the Price Form */}
          <PriceForm
            initialData={course}
            courseId={course.id}
          />

          {/* Column 2: Chapters */}
        <div>
          <div className="flex items-center gap-x-2">
            <h2 className="text-xl">
              Course chapters
            </h2>
          </div>
          
          {/* Add the new Chapters Form */}
          <ChaptersForm
            initialData={course}
            courseId={course.id}
          />
        </div>

        </div>
      </div>
    </div>
  );
}