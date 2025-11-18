"use client";

import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateCourse } from "@/actions/update-course";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, Paperclip } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { Progress } from "@/components/ui/progress";

interface ImageFormProps {
  initialData: {
    imageUrl: string | null;
  };
  courseId: string;
}

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const toggleEdit = () => {
    if (!isLoading && uploadProgress === 0) {
      setIsEditing((current) => !current);
    }
  };

  const onUploadComplete = async (url: string) => {
    setIsLoading(true);
    setUploadProgress(100);
    try {
      const response = await updateCourse(courseId, { imageUrl: url });

      if (response.error) {
        toast.error(response.error);
        setIsLoading(false);
        setUploadProgress(0);
      } else {
        toast.success("Course image updated");
        setIsEditing(false);
        setIsLoading(false);
        setUploadProgress(0);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            {/* We use standard img tag to avoid Next.js config errors for now */}
            <img
              src={initialData.imageUrl}
              alt="Upload"
              className="object-cover rounded-md w-full h-full"
            />
          </div>
        ))}

      {isEditing && (
        <div className="mt-4 space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const url = e.target.value.trim();
                if (url) {
                  onUploadComplete(url);
                }
              }}
            />
          </div>

          {/* Upload Button with Icon and Text */}
          <div className="relative">
            <style jsx global>{`
              .custom-upload-button label[data-ut-element="label"],
              .custom-upload-button input[type="file"] {
                display: none !important;
              }
            `}</style>

            {(uploadProgress > 0 || isLoading) && (
              <div className="mb-4">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {isLoading
                    ? "Saving to database..."
                    : `Uploading... ${uploadProgress}%`}
                </p>
              </div>
            )}

            <div className="custom-upload-button">
              <UploadButton
                endpoint="courseImage"
                disabled={isLoading || uploadProgress > 0}
                onClientUploadComplete={(res) => {
                  console.log("Image upload complete!", res);
                  if (res?.[0]?.url) {
                    toast.success("Upload complete! Saving to database...");
                    onUploadComplete(res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error("Image upload failed!", error);
                  toast.error(`Upload Failed: ${error.message}`);
                  setUploadProgress(0);
                  setIsLoading(false);
                }}
                onUploadBegin={() => {
                  console.log("File selected, upload beginning...");
                  setUploadProgress(1);
                }}
                onBeforeUploadBegin={(files) => {
                  console.log("Starting image upload...", files);
                  setUploadProgress(5);
                  return files;
                }}
                onUploadProgress={(progress) => {
                  console.log("Image upload progress:", progress);
                  setUploadProgress(progress);
                }}
                appearance={{
                  button:
                    "flex items-center gap-2 text-sm text-gray-900 hover:text-gray-700 transition-colors bg-transparent border-0 p-0 h-auto font-medium cursor-pointer",
                  allowedContent: "hidden",
                  container: "w-auto flex items-center",
                }}
                content={{
                  button: (
                    <div className="flex items-center gap-2 text-gray-900">
                      <Paperclip className="h-5 w-5 text-gray-900" />
                      <span className="text-sm font-medium text-gray-900">
                        Choose image
                      </span>
                    </div>
                  ),
                  allowedContent: () => null,
                }}
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
