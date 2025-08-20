/**
 * TypeScript types for Knowledge Base API
 * Comprehensive type definitions for all API interactions
 */

// Base configuration types
export interface KnowledgeBaseConfig {
  orgId: string;
  locationId: string;
}

// Request types
export interface CrawlRequest {
  website: string;
  maxDepth: number;
}

export interface SearchRequest {
  query: string;
  topK?: number;
}

// Response types
export interface SearchResult {
  content: string;
  metadata: {
    url?: string;
    title?: string;
    source?: string;
    filename?: string;
    page?: number;
    timestamp?: string;
  };
  score: number;
}

export interface CrawlResponse {
  jobId: string;
  status: "started" | "processing" | "completed" | "failed";
  message?: string;
  totalPages?: number;
  processedPages?: number;
}

export interface UploadResponse {
  fileId: string;
  filename: string;
  status: "uploaded" | "processing" | "completed" | "failed";
  message?: string;
  size?: number;
  type?: string;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Upload progress types
export interface UploadProgress {
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  message?: string;
}

// File types
export type SupportedFileType = "pdf" | "docx" | "xlsx";

export interface FileUploadItem {
  file: File;
  id: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
  type?: SupportedFileType;
}

// Activity tracking types
export interface ActivityItem {
  id: string;
  type: "upload" | "crawl" | "search";
  timestamp: Date;
  description: string;
  status: "success" | "error" | "pending";
  metadata?: Record<string, unknown>;
}

// Hook return types
export interface UseKnowledgeBaseReturn {
  crawlWebsite: (request: CrawlRequest) => Promise<boolean>;
  uploadFile: (file: File, type: SupportedFileType) => Promise<boolean>;
  searchKnowledgeBase: (request: SearchRequest) => Promise<SearchResult[]>;
  isLoading: boolean;
  uploadProgress: UploadProgress | null;
  error: ApiError | null;
}

// Component prop types
export interface KnowledgeBaseManagerProps {
  orgId: string;
  locationId: string;
  className?: string;
}

export interface WebsiteCrawlFormProps {
  config: KnowledgeBaseConfig;
  onSuccess?: (jobId?: string) => void;
  onError?: (error: ApiError) => void;
}

export interface DocumentUploadProps {
  config: KnowledgeBaseConfig;
  onSuccess?: (fileName: string, fileId?: string) => void;
  onError?: (error: ApiError) => void;
  maxFileSize?: number;
  acceptedTypes?: SupportedFileType[];
}

export interface KnowledgeSearchProps {
  config: KnowledgeBaseConfig;
  defaultQuery?: string;
  maxResults?: number;
  onResultClick?: (result: SearchResult) => void;
}
