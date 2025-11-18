"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Upload, Camera } from "lucide-react";
import { toast } from "sonner";
import { updateProfile, updatePassword } from "@/actions/update-profile";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(session?.user?.image || "");

  const user = session?.user;

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleSaveProfile = async (formData: FormData) => {
    setIsLoading(true);
    try {
      if (profileImage) {
        formData.append("image", profileImage);
      }

      const result = await updateProfile(formData);

      if (result.success) {
        toast.success("Profile updated successfully!");
        await update();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const newPassword = formData.get("new-password") as string;
      const confirmPassword = formData.get("confirm-password") as string;

      if (newPassword !== confirmPassword) {
        toast.error("New passwords don't match");
        setIsLoading(false);
        return;
      }

      const result = await updatePassword(formData);

      if (result.success) {
        toast.success("Password changed successfully!");
        // Reset form
        (formData as any).target?.reset();
      } else {
        toast.error(result.error || "Failed to change password");
      }
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                  {profileImage || user.image ? (
                    <Image
                      src={profileImage || user.image || ""}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-blue-600">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">
                    {user.name || "No name set"}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      setProfileImage(res[0].url);
                      toast.success("Image uploaded!");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed: ${error.message}`);
                  }}
                  appearance={{
                    button:
                      "bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 ut-uploading:cursor-not-allowed ut-uploading:bg-blue-400",
                    container: "w-full flex justify-center",
                    allowedContent: "hidden",
                  }}
                />
              </div>

              <form action={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={user.name || ""}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user.email || ""}
                    placeholder="Enter your email"
                    disabled
                  />
                  <p className="text-xs text-gray-500">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
              <CardDescription>
                Your learning progress and account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {/* We'll implement this later */}0
                  </div>
                  <div className="text-sm text-gray-600">Courses Purchased</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {/* We'll implement this later */}0
                  </div>
                  <div className="text-sm text-gray-600">Courses Completed</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Account Type</h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    {user.role === "ADMIN" ? "Administrator" : "Student"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role === "ADMIN" ? "Admin" : "Student"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    name="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    name="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
