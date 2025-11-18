"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Pencil,
  Loader2,
  Trash,
  Circle,
  Check,
} from "lucide-react";
import { createChapter } from "@/actions/create-chapter";
import { deleteChapter } from "@/actions/delete-chapter";
import { toast } from "sonner";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

interface Chapter {
  id: string;
  title: string;
  isPublished: boolean;
}

interface Course {
  id: string;
  chapters: Chapter[];
}

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleCreating = () => {
    setIsCreating((current) => !current);
    if (isCreating) {
      form.reset();
    }
  };

  const onAddChapter = async () => {
    try {
      const formData = new FormData();
      formData.append("title", "Untitled Chapter");
      formData.append("courseId", courseId);

      const result = await createChapter(formData);

      if (result.success && result.chapterId) {
        toast.success("Chapter created");
        router.push(`/admin/courses/${courseId}/chapters/${result.chapterId}`);
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("courseId", courseId);

      const result = await createChapter(formData);

      if (result.success && result.chapterId) {
        toast.success("Chapter created");
        toggleCreating();
        router.push(`/admin/courses/${courseId}/chapters/${result.chapterId}`);
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (chapterId: string) => {
    try {
      setDeletingId(chapterId);
      const result = await deleteChapter(chapterId, courseId);

      if (result.success) {
        toast.success("Chapter deleted");
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapters
        <Button onClick={onAddChapter} variant="ghost">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add chapter
        </Button>
      </div>

      {/* Chapter List */}
      <div className="text-sm mt-4">
        {!initialData.chapters.length && (
          <p className="text-sm mt-2 text-slate-500 italic">No chapters yet</p>
        )}
        <div className="space-y-2">
          {initialData.chapters.map((chapter: Chapter) => (
            <div
              key={chapter.id}
              className="flex items-center justify-between p-3 w-full bg-slate-200 border-slate-300 border rounded-md"
            >
              <div className="flex items-center gap-x-2">
                {chapter.title}
                {chapter.isPublished ? (
                  <span title="Published">
                    <Check className="h-4 w-4 text-green-600" />
                  </span>
                ) : (
                  <span title="Draft">
                    <Circle className="h-4 w-4 text-orange-500" />
                  </span>
                )}
              </div>

              <div className="ml-auto pr-2 flex items-center gap-x-2">
                {/* Edit Icon Link */}
                <a href={`/admin/courses/${courseId}/chapters/${chapter.id}`}>
                  <Pencil className="h-4 w-4 cursor-pointer hover:opacity-75 transition" />
                </a>
                {/* Delete Icon */}
                <button
                  onClick={() => onDelete(chapter.id)}
                  disabled={deletingId === chapter.id}
                >
                  {deletingId === chapter.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4 cursor-pointer hover:opacity-75 transition text-red-600" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
