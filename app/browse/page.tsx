"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CourseCard } from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface Course {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  chapters: Array<{
    id: string;
    isPublished: boolean;
  }>;
}

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>([]);

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const category = searchParams.get("category") || "all";

  const fetchCourses = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (sort) params.set("sort", sort);
      if (category) params.set("category", category);

      const response = await fetch(`/api/courses?${params}`);
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, [search, sort, category]);

  useEffect(() => {
    fetchCourses();
    fetchUserData();
  }, [fetchCourses]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/purchases");
      if (response.ok) {
        const data = await response.json();
        setUserId(data.userId);
        setPurchasedCourseIds(data.purchasedCourseIds || []);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleFilterSubmit = (formData: FormData) => {
    const search = formData.get("search") as string;
    const sort = formData.get("sort") as string;
    const category = formData.get("category") as string;

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    if (category) params.set("category", category);

    router.push(`/browse?${params}`);
  };

  const categories = ["all", "programming", "design", "business", "marketing"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Courses
          </h1>
          <p className="text-gray-600">
            Discover and learn from our collection of courses
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <form
            action={handleFilterSubmit}
            className="flex flex-col md:flex-row gap-4"
          >
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search courses..."
                  defaultValue={search}
                  className="pl-10"
                  name="search"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="w-full md:w-48">
              <select
                defaultValue={sort}
                name="sort"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-48">
              <select
                defaultValue={category}
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Apply Filters Button */}
            <Button type="submit" className="w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </form>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {loading
              ? "Loading..."
              : `${courses.length} course${
                  courses.length !== 1 ? "s" : ""
                } found`}
            {search && ` for "${search}"`}
          </p>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
              >
                <div className="aspect-video bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isPurchased={purchasedCourseIds.includes(course.id)}
                userId={userId || undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
