import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  let session = null;

  try {
    session = await auth();
  } catch (error) {
    console.error("Auth error in navbar:", error);
  }

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href={
                isAdmin
                  ? "/admin/dashboard"
                  : session?.user
                  ? "/dashboard"
                  : "/"
              }
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Digital Service Hub
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                {!isAdmin && (
                  <Link href="/browse">
                    <Button variant="ghost" size="sm">
                      Browse Courses
                    </Button>
                  </Link>
                )}
                {!isAdmin && (
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">
                      Profile
                    </Button>
                  </Link>
                )}
                <span className="text-sm text-gray-700 hidden sm:block">
                  {session.user.name || session.user.email}
                </span>
                {isAdmin && (
                  <Link href="/admin/courses">
                    <Button variant="outline" size="sm">
                      Manage Courses
                    </Button>
                  </Link>
                )}
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <Button variant="outline" size="sm" type="submit">
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/browse">
                  <Button variant="ghost" size="sm">
                    Browse Courses
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="sm">Login</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
