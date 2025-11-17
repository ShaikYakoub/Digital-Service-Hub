import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { Course, Chapter } from "@prisma/client";

// This new "type" includes the chapter count
type CourseWithChapters = Course & {
  chapters: Chapter[];
};

interface CourseCardProps {
  course: CourseWithChapters;
}

// Helper to format the price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // You can change this to "INR"
  }).format(price);
};

export const CourseCard = ({
  course
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="group hover:shadow-lg transition-all overflow-hidden border rounded-lg p-3 h-full bg-white">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <img
            src={course.imageUrl || "/placeholder.svg"} // We'll add a placeholder later
            alt={course.title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition-colors line-clamp-2">
            {course.title}
          </div>
          <div className="flex items-center gap-x-2 text-sm text-slate-500 mt-2">
            <BookOpen className="w-4 h-4" />
            <span>
              {course.chapters.length} {course.chapters.length === 1 ? "Chapter" : "Chapters"}
            </span>
          </div>
          <div className="mt-4 font-bold text-lg">
            {course.price ? formatPrice(course.price) : "Free"}
          </div>
        </div>
      </div>
    </Link>
  );
};