"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// 1. Import our new server actions
import { publishCourse, unpublishCourse } from "@/actions/publish-course";

interface CoursePublishButtonProps {
  initialData: {
    isPublished: boolean;
  };
  courseId: string;
}

export const CoursePublishButton = ({
  initialData,
  courseId
}: CoursePublishButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onPublish = async () => {
    try {
      setIsLoading(true);
      const response = await publishCourse(courseId);
      
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Course published");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }
  
  const onUnpublish = async () => {
    try {
      setIsLoading(true);
      const response = await unpublishCourse(courseId);
      
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Course unpublished");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={initialData.isPublished ? onUnpublish : onPublish}
        disabled={isLoading}
        variant="outline"
        size="sm"
      >
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {initialData.isPublished ? "Unpublish" : "Publish"}
      </Button>
    </div>
  );
};