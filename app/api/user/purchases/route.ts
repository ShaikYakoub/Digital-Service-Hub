import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const purchases = await db.purchase.findMany({
      where: { userId: session.user.id },
      select: { courseId: true },
    });

    const purchasedCourseIds = purchases.map(p => p.courseId);

    return NextResponse.json({
      userId: session.user.id,
      purchasedCourseIds
    });
  } catch (error) {
    console.error("[USER_PURCHASES_API]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}