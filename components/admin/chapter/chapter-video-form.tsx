"use client";

import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateChapter } from "@/actions/update-chapter";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { OurUploadDropzone as UploadDropzone } from "@/lib/uploadthing";

import ReactPlayer from "react-player";

interface ChapterVideoFormProps {
  initialData: {
    videoUrl: string | null;
  };
  courseId: string;
  chapterId: string;
}

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: { videoUrl: string }) => {
    try {
      const response = await updateChapter(chapterId, courseId, values);
      
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Chapter video updated");
        toggleEdit();
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      
      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <ReactPlayer
              url={initialData.videoUrl}
              controls
              width="100%"
              height="100%"
            />
          </div>
        )
      )}
      
      {isEditing && (
        <div className="mt-4">
          <UploadDropzone
            endpoint="courseVideo" // This MUST match the name in your core.ts
            onClientUploadComplete={(res) => {
              // This runs on the CLIENT after a successful upload
              if (res?.[0]?.url) {
                // Now we call our Server Action to save the URL
                onSubmit({ videoUrl: res[0].url });
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload Failed: ${error.message}`);
            }}
          />
          <div className="text-xs text-muted-foreground mt-2">
            Max 1GB. MP4, WEBM, or MOV.
          </div>
        </div>
      )}
    </div>
  );
};