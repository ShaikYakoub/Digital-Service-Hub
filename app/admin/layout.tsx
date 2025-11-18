export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content - Full Width */}
      <main className="w-full">{children}</main>
    </div>
  );
}
