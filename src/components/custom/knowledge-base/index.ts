/**
 * Knowledge Base Components
 * Exports all knowledge base related components and utilities
 */

export { default as KnowledgeBaseManager } from "./knowledge-base-manager";
export { default as WebsiteCrawlForm } from "./website-crawl-form";
export { default as DocumentUpload } from "./document-upload";
export { default as KnowledgeSearch } from "./knowledge-search";
export { default as KnowledgeBaseDemo } from "./knowledge-base-demo";

// Re-export hook and types for convenience
export { useKnowledgeBase } from "@/hooks/useKnowledgeBase";
export type {
  KnowledgeBaseConfig,
  CrawlRequest,
  SearchRequest,
  SearchResult,
  UploadProgress,
  SupportedFileType,
} from "@/types/knowledge-base";
