/**
 * Website Crawl Form Component
 * Allows users to initiate website crawling for knowledge base ingestion
 */

"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useKnowledgeBase,
  type KnowledgeBaseConfig,
} from "@/hooks/useKnowledgeBase";

const formSchema = z.object({
  website: z
    .string()
    .min(1, "Website URL is required")
    .url("Please enter a valid URL")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "URL must start with http:// or https://"
    ),
  maxDepth: z
    .number()
    .min(1, "Max depth must be at least 1")
    .max(10, "Max depth cannot exceed 10"),
});

type FormData = z.infer<typeof formSchema>;

interface WebsiteCrawlFormProps {
  config: KnowledgeBaseConfig;
  onSuccess?: () => void;
}

export default function WebsiteCrawlForm({
  config,
  onSuccess,
}: WebsiteCrawlFormProps) {
  const { crawlWebsite, isLoading } = useKnowledgeBase(config);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      website: "",
      maxDepth: 2,
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      const success = await crawlWebsite(values);
      if (success) {
        form.reset();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Crawl submission error", error);
      toast.error("Failed to start website crawl. Please try again.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Crawl Website
        </CardTitle>
        <CardDescription>
          Add content from a website to your knowledge base. We'll crawl the
          site and extract relevant information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the website URL you want to crawl and add to your
                    knowledge base
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxDepth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Crawl Depth</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    How many levels deep to crawl (1-10). Higher values take
                    longer but capture more content.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-full font-primary font-semibold text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Crawl...
                </>
              ) : (
                "Start Website Crawl"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
