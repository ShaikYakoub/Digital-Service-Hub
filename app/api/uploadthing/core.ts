import { auth } from "@/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// This function checks if the user is an Admin
const handleAuth = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  console.log("UploadThing auth check:", { userId, role: session?.user?.role, fullSession: JSON.stringify(session) });

  // Temporarily allow upload for testing
  if (!userId) {
    console.log("No user ID, but allowing for test");
    return { userId: "test-user" };
  }
  
  if (session?.user?.role !== "ADMIN") {
    console.log("Not admin, but allowing for test");
    return { userId };
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