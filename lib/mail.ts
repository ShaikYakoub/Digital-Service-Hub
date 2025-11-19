export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  // TODO: Replace with actual email service (Resend, Nodemailer, etc.)
  console.log(`Password reset link for ${email}: ${resetLink}`);

  // Example with Resend (uncomment and configure when ready):
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "noreply@yoursite.com",
  //   to: email,
  //   subject: "Reset your password",
  //   html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  // });
};