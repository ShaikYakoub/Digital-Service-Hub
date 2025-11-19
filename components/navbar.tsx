"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/login", redirect: true });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <Link
              href={
                isAdmin
                  ? "/admin/dashboard"
                  : session?.user
                  ? "/dashboard"
                  : "/"
              }
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo-small.svg"
                alt="Logo"
                width={32}
                height={32}
                className="text-gray-900"
              />
              <span className="hidden sm:inline text-lg font-bold text-gray-900">
                Digital Service Hub
              </span>
              <span className="sm:hidden text-lg font-bold text-gray-900">
                DSH
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <>
                {!isAdmin && (
                  <>
                    <Link href="/browse">
                      <Button variant="ghost" size="sm">
                        Browse
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="ghost" size="sm">
                        Profile
                      </Button>
                    </Link>
                  </>
                )}
                <span className="text-sm text-gray-700 hidden lg:block">
                  {session.user.name || session.user.email}
                </span>
                {isAdmin && (
                  <Link href="/admin/courses">
                    <Button variant="outline" size="sm">
                      Manage Courses
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/browse">
                  <Button variant="ghost" size="sm">
                    Browse
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="sm">Login</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            {session?.user ? (
              <>
                <div className="px-2 py-2 text-sm text-gray-700 border-b">
                  {session.user.name || session.user.email}
                </div>
                {!isAdmin && (
                  <>
                    <Link
                      href="/browse"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        Browse Courses
                      </Button>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        Profile
                      </Button>
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <Link
                    href="/admin/courses"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      Manage Courses
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/browse" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Browse Courses
                  </Button>
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
