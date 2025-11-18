import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  const { courseId } = await params;

  if (!userId) {
    return <div>Please log in to view this course.</div>;
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return <div>Course not found.</div>;
  }

  // const purchase = await db.purchase.findUnique({
  //   where: {
  //     userId_courseId: {
  //       userId,
  //       courseId: params.courseId,
  //     },
  //   },
  // });

  // if (!purchase) {
  //   return <div>You have not purchased this course.</div>;
  // }

  const firstChapter = course.chapters[0];
  if (!firstChapter) {
    return <div>This course has no published chapters.</div>;
  }

  return (
    <div>
      <h1>{course.title}</h1>
      <Link href={`/learn/${course.id}/chapters/${firstChapter.id}`}>
        Go to first chapter
      </Link>
    </div>
  );
}
