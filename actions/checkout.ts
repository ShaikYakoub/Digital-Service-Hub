"use server";

import Razorpay from "razorpay";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function checkout(courseId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "You must be logged in to purchase a course." };
    }

    const existingPurchase = await db.purchase.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existingPurchase) {
      return { error: "You already own this course." };
    }

    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
    });

    if (!course || !course.price) {
      return { error: "Course not found or is not for sale." };
    }

    const amount = course.price * 100;
    const currency = "INR";

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency,
      receipt: `receipt_order_${new Date().getTime()}`,
    });

    if (!razorpayOrder) {
      return { error: "Razorpay order creation failed." };
    }

    // Create a pending order in our DB
    await db.order.create({
      data: {
        userId,
        courseId,
        amount: course.price,
        razorpayOrderId: razorpayOrder.id,
      },
    });

    return { success: "Order created", order: razorpayOrder };

  } catch (error) {
    console.error("[CHECKOUT_ACTION]", error);
    return { error: "An unexpected error occurred." };
  }
}