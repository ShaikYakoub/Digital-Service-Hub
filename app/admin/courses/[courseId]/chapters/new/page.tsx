"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createChapter } from "@/actions/create-chapter";
import { toast } from "sonner";
import { use } from "react";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export default function NewChapterPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { courseId } = use(params);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("courseId", courseId);

      const result = await createChapter(formData);

      if (result.success) {
        toast.success("Chapter created");
        router.push(`/admin/courses/${courseId}`);
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="w-full">
        <Link
          href={`/admin/courses/${courseId}`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to course setup
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Create a new chapter</h1>
            <span className="text-sm text-slate-700">
              Add a chapter to your course
            </span>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chapter Title</FormLabel>
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
            <div className="flex items-center gap-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push(`/admin/courses/${courseId}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button disabled={!isValid || isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create chapter"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
