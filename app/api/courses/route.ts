import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";
    const category = searchParams.get("category") || "all";

    // Build the where clause for filtering
    const where: any = {
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // For now, we'll implement basic sorting. In a real app, you'd have categories
    let orderBy: any = { createdAt: "desc" };

    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "title":
        orderBy = { title: "asc" };
        break;
    }

    const courses = await db.course.findMany({
      where,
      include: {
        chapters: {
          where: { isPublished: true },
        },
      },
      orderBy,
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("[COURSES_API]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}