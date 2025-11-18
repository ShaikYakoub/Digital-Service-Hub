import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return new NextResponse("Razorpay signature missing", { status: 400 });
    }

    // 1. Verify the webhook signature
    const generated_signature = crypto
      .createHmac("sha256", webhookSecret)
      .update(text)
      .digest("hex");

    if (generated_signature !== signature) {
      return new NextResponse("Invalid webhook signature", { status: 400 });
    }

    const event = JSON.parse(text);

    // 2. We only care about the 'payment.captured' event
    if (event.event === "payment.captured") {
      const { userId, courseId } = event.payload.payment.entity.notes;

      if (!userId || !courseId) {
        return new NextResponse("Webhook Error: Missing metadata", { status: 400 });
      }

      // 3. Create the Purchase record in the database
      await db.purchase.create({
        data: {
          courseId: courseId,
          userId: userId,
        },
      });
    }

    // 4. Acknowledge receipt of the event
    return new NextResponse(null, { status: 200 });

  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}