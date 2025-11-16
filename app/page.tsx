import { auth, signOut } from "@/auth"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Digital Service Hub</h1>
      
      {session ? (
        <div className="text-center">
          <p className="text-xl text-green-600">
            Logged in as: {session.user?.email}
          </p>
          <p>Role: {session.user?.role || "USER"}</p>
          
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <button className="mt-4 rounded bg-red-500 px-4 py-2 text-white">
              Sign Out
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-red-500 mb-4">Not logged in</p>
          <Link 
            href="/auth/login"
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            Go to Login
          </Link>
        </div>
      )}
    </div>
  )
}