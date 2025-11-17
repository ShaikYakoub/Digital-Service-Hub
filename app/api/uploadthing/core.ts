import { auth } from "@/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// This function checks if the user is an Admin
const handleAuth = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return { userId };
};

// This is your "File Router"
export const ourFileRouter = {
  // Define an "uploader" for course videos
  courseVideo: f({ video: { maxFileSize: "1GB", maxFileCount: 1 } })
    // Run handleAuth to make sure the user is an Admin
    .middleware(() => handleAuth())
    // This code runs *after* the upload is complete
    .onUploadComplete(({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File url:", file.url);
      // We don't need to do anything here,
      // as our form will handle the DB update
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;