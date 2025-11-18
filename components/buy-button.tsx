"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { checkout } from "@/actions/checkout";
import { verifyPayment } from "@/actions/payment-verification"; // We'll create this
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react"; // To get user details

// This is a global type, but we define it here for clarity
declare var Razorpay: any;

interface BuyButtonProps {
  courseId: string;
  courseTitle?: string;
}

export const BuyButton = ({ courseId, courseTitle }: BuyButtonProps) => {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const handlePayment = async () => {
    startTransition(async () => {
      try {
        const response = await checkout(courseId);

        if (response?.error) {
          toast.error(response.error);
          return;
        }

        const order = response.order;
        if (!order) {
          toast.error("Failed to create order.");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Course Purchase",
          description: courseTitle
            ? `Purchase of ${courseTitle}`
            : "Complete your payment",
          order_id: order.id,
          handler: async function (paymentResponse: any) {
            const verificationResponse = await verifyPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (verificationResponse?.error) {
              toast.error(verificationResponse.error);
            }
            if (verificationResponse?.success) {
              toast.success(verificationResponse.success);
              // The page will be revalidated by the action
            }
          },
          prefill: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Payment failed", error);
        toast.error("Payment failed. Please try again.");
      }
    });
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isPending}
      className="w-full mt-4"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buy Now"}
    </Button>
  );
};
