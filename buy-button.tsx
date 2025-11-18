"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { checkout } from "@/actions/checkout";
import { Button } from "@/components/ui/button";

// This tells TypeScript what the Razorpay object on the window will look like.
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface BuyButtonProps {
  courseId: string;
  courseTitle: string;
}

export const BuyButton = ({ courseId, courseTitle }: BuyButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const router = useRouter();

  const handlePurchase = () => {
    startTransition(async () => {
      const result = await checkout(courseId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success && result.order) {
        const order = result.order;

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: order.amount,
          currency: order.currency,
          name: "SY Dev Solutions",
          description: `Purchase of ${courseTitle}`,
          order_id: order.id,
          // This handler function gets called after the payment is successful.
          handler: function (response: any) {
            toast.success("Payment successful! Granting access...");
            // The webhook will handle the database update.
            // We just need to refresh the page to show the "Go to Course" button.
            router.refresh();
          },
          prefill: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    });
  };

  return (
    <Button onClick={handlePurchase} disabled={isPending}>
      {isPending ? "Processing..." : "Buy Now"}
    </Button>
  );
};
