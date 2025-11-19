import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

// For Vercel deployment, you'll need to set up an email service like Resend
// For now, this will log the reset token - in production, send an email

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
    });

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return NextResponse.json({
        message: "If an account with that email exists, we've sent you a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // In a real implementation, you'd store this in the database
    // For now, we'll just log it
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Token expires: ${resetTokenExpiry}`);

    // TODO: Send email with reset link
    // const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    // await sendEmail(email, "Password Reset", `Click here to reset: ${resetUrl}`);

    return NextResponse.json({
      message: "If an account with that email exists, we've sent you a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}