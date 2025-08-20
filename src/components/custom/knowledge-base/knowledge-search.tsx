/**
 * Knowledge Base Search Component
 * Provides semantic search functionality for the knowledge base
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Loader2, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useKnowledgeBase,
  type KnowledgeBaseConfig,
  type SearchResult,
} from "@/hooks/useKnowledgeBase";

const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  topK: z.number().min(1).max(20).default(5),
});

type SearchFormData = z.input<typeof searchSchema>;

interface KnowledgeSearchProps {
  config: KnowledgeBaseConfig;
}

export default function KnowledgeSearch({ config }: KnowledgeSearchProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { searchKnowledgeBase, isLoading } = useKnowledgeBase(config);

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
      topK: 5,
    },
  });

  const onSubmit = async (values: SearchFormData) => {
    try {
      setHasSearched(true);
      const searchResults = await searchKnowledgeBase({
        query: values.query,
        topK: values.topK,
      });
      setResults(searchResults);
    } catch (error) {
      console.error("Search error", error);
      setResults([]);
    }
  };

  const formatScore = (score: number) => {
    return (score * 100).toFixed(1);
  };

  const getSourceIcon = (source: string) => {
    if (source.includes("http")) {
      return <ExternalLink className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Knowledge Base
        </CardTitle>
        <CardDescription>
          Search through your knowledge base content using semantic similarity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Search Query</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What would you like to know?"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topK"
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel>Results</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 5)
                        }
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full font-primary font-semibold text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Search Results
                {results.length > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({results.length} results)
                  </span>
                )}
              </h3>
            </div>

            {results.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="space-y-2">
                  <Search className="h-8 w-8 mx-auto text-muted-foreground" />
                  <h4 className="text-lg font-medium">No results found</h4>
                  <p className="text-muted-foreground">
                    Try different keywords or check if content has been added to
                    your knowledge base.
                  </p>
                </div>
              </Card>
            ) : (
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-4 pr-4">
                  {results.map((result, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {result.metadata.source &&
                              getSourceIcon(result.metadata.source)}
                            <h4 className="font-medium truncate">
                              {result.metadata.title ||
                                result.metadata.url ||
                                `Result ${index + 1}`}
                            </h4>
                          </div>
                          <Badge variant="secondary">
                            {formatScore(result.score)}% match
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {result.content}
                        </p>

                        {result.metadata.url && (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            <a
                              href={result.metadata.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline truncate"
                            >
                              {result.metadata.url}
                            </a>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
