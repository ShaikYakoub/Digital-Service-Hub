"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { BookOpen, Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BuyButton } from "./buy-button";

// Simplified type for course cards that only need basic chapter info
type CourseWithBasicChapters = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  chapters: Array<{
    id: string;
    isPublished: boolean;
  }>;
};

interface CourseCardProps {
  course: CourseWithBasicChapters;
  isPurchased?: boolean;
  userId?: string;
}

// Helper to format the price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // You can change this to "INR"
  }).format(price);
};

export const CourseCard = ({
  course,
  isPurchased = false,
  userId,
}: CourseCardProps) => {
  const router = useRouter();
  const firstChapter = course.chapters.find((chapter) => chapter.isPublished);
  const href = firstChapter
    ? `/learn/${course.id}/chapters/${firstChapter.id}`
    : `/learn/${course.id}`;

  const isPaid = course.price && course.price > 0;

  const handleCardClick = () => {
    // Only navigate if user is logged in, or course is free, or course is purchased
    if (userId || !isPaid || isPurchased) {
      router.push(href);
    } else {
      // Redirect to login for paid courses when not logged in
      router.push("/auth/login");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, you'd add to cart functionality here
    console.log("Add to cart:", course.id);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, you'd toggle wishlist functionality here
    console.log("Toggle wishlist:", course.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group hover:shadow-lg transition-all overflow-hidden border rounded-lg p-3 h-full bg-white hover:border-black cursor-pointer"
    >
      <div className="relative w-full aspect-video rounded-md overflow-hidden mb-3">
        <Image
          src={course.imageUrl || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {/* Wishlist Icon */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>
      <div className="flex flex-col pt-2">
        <div className="text-lg md:text-base font-medium group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
          {course.title}
        </div>
        <div className="flex items-center gap-x-2 text-sm text-slate-500 mt-2">
          <BookOpen className="w-4 h-4" />
          <span>
            {course.chapters.length}{" "}
            {course.chapters.length === 1 ? "Chapter" : "Chapters"}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="font-bold text-lg text-black">
            {course.price ? formatPrice(course.price) : "Free"}
          </div>
          <div className="flex items-center gap-1">
            {course.price ? (
              <Badge variant="secondary" className="text-xs">
                Paid
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-xs text-black border-black"
              >
                Free
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
          {isPurchased ? (
            <Button className="w-full" variant="outline">
              Continue Learning
            </Button>
          ) : isPaid && userId ? (
            <div className="flex gap-2">
              <BuyButton courseId={course.id} courseTitle={course.title} />
              <Button
                onClick={handleAddToCart}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <ShoppingCart className="w-4 w-4 mr-1" />
                Cart
              </Button>
            </div>
          ) : isPaid ? (
            <Button className="w-full">Login to Purchase</Button>
          ) : (
            <Button className="w-full">Start Learning</Button>
          )}
        </div>
      </div>
    </div>
  );
};
