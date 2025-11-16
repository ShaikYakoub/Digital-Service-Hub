export default function AdminDashboard() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-3xl font-bold text-green-600">
        Welcome to the Admin Dashboard!
      </h1>
      <p>(Only Admins can see this)</p>
    </div>
  )
}