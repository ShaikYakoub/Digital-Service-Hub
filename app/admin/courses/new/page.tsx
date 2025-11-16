"use client";

import { createCourse } from "@/actions/create-course";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import { toast } from "sonner"; // 2. Import toast

export default function NewCoursePage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // 3. Get the router

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      // 4. Await the response from the server action
      const result = await createCourse(formData);

      // 5. Check the response
      if (result.success && result.courseId) {
        toast.success(result.success);
        // 6. Redirect on the CLIENT
        router.push(`/admin/courses/${result.courseId}`);
      } else if (result.error) {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto text-black">
      <h1 className="text-2xl font-bold">Name your new course</h1>
      <p className="text-gray-600">You can change this later.</p>

      <form 
        action={onSubmit} 
        className="mt-6 flex flex-col gap-4 text-black"
      >
        <label className="flex flex-col gap-2 text-black">
          <span className="font-medium">Course Title</span>
          <input
            name="title"
            placeholder="e.g., 'The Ultimate Yoga Masterclass'"
            className="rounded border p-2"
            disabled={isPending}
            required
          />
        </label>
        
        <div className="flex gap-2">
          <Link 
            href="/admin/courses" 
            className="rounded bg-gray-200 px-4 py-2 text-black"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-black px-4 py-2 text-white disabled:bg-gray-500"
          >
            {isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}