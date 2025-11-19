import { Toaster } from "sonner"; // 1. Import
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { WhatsAppButton } from "@/components/whatsapp-button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Service Hub",
  description: "Learn and master new skills with our comprehensive courses",
  icons: {
    icon: [{ url: "/logo-small.svg", type: "image/svg+xml" }],
  },
};

// Force dynamic rendering for all pages since we use auth in navbar
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">
            <Toaster />
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </Providers>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
