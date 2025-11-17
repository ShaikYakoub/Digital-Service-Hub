import { CoursesList } from "@/components/courses-list";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {session?.user?.name || "Student"}!
      </h1>
      
      {/* This Server Component will fetch and display all courses */}
      <CoursesList />
    </div>
  );
}