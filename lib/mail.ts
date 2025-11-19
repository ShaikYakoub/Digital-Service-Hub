import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `https://digital-service-3sym046r2-shaik-yakoubs-projects.vercel.app/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "sheikyaqoo@gmail.com", // Change this to your verified domain later
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  });
};