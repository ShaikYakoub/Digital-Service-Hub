"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

interface VerifyPaymentArgs {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function verifyPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: VerifyPaymentArgs) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Authentication failed." };
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return { error: "Payment verification failed." };
    }

    const pendingOrder = await db.order.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!pendingOrder) {
      return { error: "Order not found." };
    }

    if (pendingOrder.userId !== userId) {
      return { error: "Order does not belong to the current user." };
    }

    const { courseId } = pendingOrder;

    const existingPurchase = await db.purchase.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existingPurchase) {
      return { success: "You have already purchased this course." };
    }

    await db.purchase.create({
      data: {
        courseId,
        userId,
      },
    });

    // Optionally, delete the pending order
    await db.order.delete({
      where: { id: pendingOrder.id },
    });

    revalidatePath(`/learn/${courseId}`);
    revalidatePath(`/`);

    return { success: "Payment successful! You now own the course." };

  } catch (error) {
    console.error("[VERIFY_PAYMENT_ACTION]", error);
    return { error: "An unexpected error occurred." };
  }
}
