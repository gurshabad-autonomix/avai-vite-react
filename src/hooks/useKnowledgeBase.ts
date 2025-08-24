/**
 * Hook for Knowledge Base API operations
 * Provides centralized access to knowledge base functionality
 */

import { useState } from "react";
import { toast } from "sonner";
import { useAuthenticatedFetch } from "./useAuth";

export interface KnowledgeBaseConfig {
  orgId: string;
  locationId: string;
}

export interface CrawlRequest {
  website: string;
  maxDepth: number;
}

export interface SearchRequest {
  query: string;
  topK?: number;
}

export interface SearchResult {
  content: string;
  metadata: {
    url?: string;
    title?: string;
    source?: string;
  };
  score: number;
}

export interface UploadProgress {
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  message?: string;
}

export const useKnowledgeBase = (config: KnowledgeBaseConfig) => {
  const { authenticatedFetch } = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );

  const makeRequest = async (url: string, options: RequestInit = {}) => {
    const response = await authenticatedFetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP ${response.status}`);
    }

    return response;
  };

  const crawlWebsite = async (request: CrawlRequest) => {
    setIsLoading(true);
    try {
      const url = `/knowledge-bases:ingest-crawl?orgId=${config.orgId}&locationId=${config.locationId}`;
      await makeRequest(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      toast.success("Website crawl started successfully");
      return true;
    } catch (error) {
      toast.error(
        `Failed to start crawl: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File, type: "pdf" | "docx" | "xlsx") => {
    setIsLoading(true);
    setUploadProgress({ progress: 0, status: "uploading" });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const url = `/knowledge-bases/uploads:${type}?orgId=${config.orgId}&locationId=${config.locationId}`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (!prev || prev.progress >= 90) return prev;
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 200);

      await makeRequest(url, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress({ progress: 100, status: "complete" });
      toast.success(`${file.name} uploaded successfully`);
      return true;
    } catch (error) {
      setUploadProgress({
        progress: 0,
        status: "error",
        message: error instanceof Error ? error.message : "Upload failed",
      });
      toast.error(
        `Failed to upload file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return false;
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress(null), 3000);
    }
  };

  const searchKnowledgeBase = async (
    request: SearchRequest
  ): Promise<SearchResult[]> => {
    setIsLoading(true);
    try {
      const url = `/knowledge-bases:search?orgId=${config.orgId}&locationId=${
        config.locationId
      }&query=${encodeURIComponent(request.query)}&topK=${request.topK || 3}`;
      const response = await makeRequest(url);
      const results = await response.json();
      return results;
    } catch (error) {
      toast.error(
        `Search failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    crawlWebsite,
    uploadFile,
    searchKnowledgeBase,
    isLoading,
    uploadProgress,
  };
};
