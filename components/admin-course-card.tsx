"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { deleteCourse } from "@/actions/delete-course";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CourseWithChapters = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  isPublished: boolean;
  chapters: {
    id: string;
    title: string;
    isPublished: boolean;
  }[];
};

export function AdminCourseCard({ course }: { course: CourseWithChapters }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteCourse(course.id);

    if (result.success) {
      toast.success("Course deleted successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete course");
      setIsDeleting(false);
    }
  };

  return (
    <div
      onClick={() => (window.location.href = `/admin/courses/${course.id}`)}
      className="group hover:shadow-lg transition-all overflow-hidden border rounded-lg p-3 h-full bg-white hover:border-blue-300 cursor-pointer relative flex flex-col"
    >
      {/* Publish Status Indicator */}
      <div className="absolute top-3 right-3 z-10">
        {course.isPublished ? (
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
            Published
          </div>
        ) : (
          <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md font-medium">
            Drafts
          </div>
        )}
      </div>

      <div className="relative w-full aspect-video rounded-md overflow-hidden mb-3">
        <Image
          src={course.imageUrl || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="flex flex-col pt-2 flex-1">
        <div className="text-lg md:text-base font-medium group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
          {course.title}
        </div>
        <div className="flex items-center gap-x-2 text-sm text-slate-500 mt-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span>
            {course.chapters.length}{" "}
            {course.chapters.length === 1 ? "Chapter" : "Chapters"}
          </span>
        </div>
        <div className="mt-4 font-bold text-lg text-black">
          {course.price ? `₹${course.price}` : "Free"}
        </div>
      </div>

      {/* Delete button at bottom */}
      <div className="mt-3 pt-3 border-t" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete Course"}
        </button>
      </div>
    </div>
  );
}
