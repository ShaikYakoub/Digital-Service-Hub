import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `https://digital-service-dbqb1v755-shaik-yakoubs-projects.vercel.app/auth/forgot-password/new-password?token=${token}`;

  try {
    console.log(`Attempting to send password reset email to: ${email}`);

    const result = await resend.emails.send({
      from: "onboarding@resend.dev", // Use a more professional from address
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    });

    console.log(`Email sent successfully. ID: ${result.data?.id}`);
    return result;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Failed to send reset email. Please try again.");
  }
};