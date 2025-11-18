"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface LearnPageClientProps {
  courseId: string;
  firstChapterId: string | null;
}

export function LearnPageClient({ courseId, firstChapterId }: LearnPageClientProps) {
  const router = useRouter();

  useEffect(() => {
    if (firstChapterId) {
      router.push(`/learn/${courseId}/chapters/${firstChapterId}`);
    } else {
      router.push("/");
    }
  }, [courseId, firstChapterId, router]);

  return <div>Redirecting...</div>;
}
