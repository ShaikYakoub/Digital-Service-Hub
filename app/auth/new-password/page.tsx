import { Metadata } from "next";
import { NewPasswordForm } from "./new-password-form";

export const metadata: Metadata = {
  title: "New Password",
};

interface NewPasswordPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function NewPasswordPage({ searchParams }: NewPasswordPageProps) {
  const token = typeof searchParams.token === "string" ? searchParams.token : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>
        <NewPasswordForm token={token} />
      </div>
    </div>
  );
}