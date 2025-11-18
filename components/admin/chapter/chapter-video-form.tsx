"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateChapter } from "@/actions/update-chapter";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { Progress } from "@/components/ui/progress";

// --- THIS IS THE FIX ---
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
// --- END OF FIX ---

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
  chapterId,
}: ChapterVideoFormProps) => {
  console.log("ChapterVideoForm rendering", {
    courseId,
    chapterId,
    initialData,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
        setUploadProgress(0);
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
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <ReactPlayer
              url={initialData.videoUrl!}
              controls={true}
              width="100%"
              height="100%"
            />
          </div>
        ))}

      {isEditing && (
        <div className="mt-4">
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-4">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <UploadDropzone
              endpoint="courseVideo"
              onClientUploadComplete={(res) => {
                console.log("UPLOADTHING: Upload complete!", res);
                if (res?.[0]?.url) {
                  toast.success("Upload complete! Saving to database...");
                  onSubmit({ videoUrl: res[0].url });
                }
              }}
              onUploadError={(error: Error) => {
                console.error("UPLOADTHING: Upload failed!", error);
                toast.error(`Upload Failed: ${error.message}`);
                setUploadProgress(0);
              }}
              onBeforeUploadBegin={(files) => {
                console.log("UPLOADTHING: Before upload begin", files);
                return files;
              }}
              onUploadBegin={(fileName: string) => {
                console.log("UPLOADTHING: Upload began for file:", fileName);
                toast.info(`Uploading: ${fileName}`);
                setUploadProgress(1);
              }}
              onUploadProgress={(progress: number) => {
                console.log("UPLOADTHING: Upload progress:", progress);
                setUploadProgress(progress);
              }}
              config={{
                mode: "auto",
              }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-4">
            Upload a video file (max 1GB). Supported formats: MP4, WEBM, MOV.
          </div>
        </div>
      )}
    </div>
  );
};
