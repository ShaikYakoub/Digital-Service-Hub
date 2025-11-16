import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-gray-900 p-6 text-white">
        <h2 className="text-2xl font-bold text-white mb-8">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/admin/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link href="/admin/courses" className="hover:text-gray-300">
            Courses
          </Link>
        </nav>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
        {children}
      </main>
    </div>
  );
}