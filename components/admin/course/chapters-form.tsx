"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createChapter } from "@/actions/create-chapter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Pencil } from "lucide-react";
import type { Course, Chapter } from "@prisma/client";
import {
    Form,
    FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// We need the full Course and Chapter types from Prisma

// Validation Schema
const formSchema = z.object({
  title: z.string().min(1),
});

interface ChaptersFormProps {
  // We pass in the full course object, which now *includes* chapters
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

export const ChaptersForm = ({
  initialData,
  courseId
}: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // For reordering later

  const toggleCreating = () => setIsCreating((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // We need to send the title AND the courseId
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("courseId", courseId);

      const response = await createChapter(formData);
      
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Chapter created");
        toggleCreating(); // Close the form
        form.reset(); // Clear the input
        router.refresh(); // Refresh the page to show the new chapter
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </form>
        </Form>
      )}

      {/* This is where we'll show the list of chapters */}
      {!isCreating && (
        <div className="text-sm mt-4">
         {initialData.chapters.map((chapter) => (
              <div 
                key={chapter.id}
                className="flex items-center justify-between p-3 w-full bg-slate-200 border-slate-300 border rounded-md"
              >
                {chapter.title}
                
                <div className="ml-auto pr-2 flex items-center gap-x-2">
                  {/* Edit Icon Link */}
                  <a href={`/admin/courses/${courseId}/chapters/${chapter.id}`}>
                     <Pencil className="h-4 w-4 cursor-pointer hover:opacity-75 transition" />
                  </a>
                </div>
              </div>
            ))}
          
          {/* We'll add a <ChapterList> component here later */}
          <div className="space-y-2">
            {initialData.chapters.map((chapter) => (
              <div 
                key={chapter.id}
                className="flex items-center p-3 w-full bg-slate-200 border-slate-300 border rounded-md"
              >
                {chapter.title}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};