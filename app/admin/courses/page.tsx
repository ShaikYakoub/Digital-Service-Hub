import Link from "next/link";

export default function AdminCoursesPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <Link 
          href="/admin/courses/new"
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          New Course
        </Link>
      </div>

      <div className="mt-8">
        {/* We will add a data table of courses here later */}
        <p>Your courses will be listed here.</p>
      </div>
    </div>
  );
}