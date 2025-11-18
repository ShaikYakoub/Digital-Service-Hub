import { CoursesList } from "@/components/courses-list";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // Redirect logged-in users to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Digital Service Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Learn and master new skills with our comprehensive courses
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Available Courses
          </h2>
          <CoursesList />
        </div>
      </div>
    </div>
  );
}
