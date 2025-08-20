/**
 * Document Upload Component
 * Handles drag & drop upload for PDF, DOCX, and XLSX files
 */

"use client";

import { useState } from "react";
import { FileText, Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-upload";
import {
  useKnowledgeBase,
  type KnowledgeBaseConfig,
} from "@/hooks/useKnowledgeBase";
import { toast } from "sonner";

interface DocumentUploadProps {
  config: KnowledgeBaseConfig;
  onSuccess?: (fileName: string) => void;
}

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/msword": [".doc"],
  "application/vnd.ms-excel": [".xls"],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface UploadItem {
  file: File;
  id: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export default function DocumentUpload({
  config,
  onSuccess,
}: DocumentUploadProps) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const { uploadFile, uploadProgress } = useKnowledgeBase(config);

  const getFileType = (file: File): "pdf" | "docx" | "xlsx" | null => {
    const extension = file.name.toLowerCase().split(".").pop();
    switch (extension) {
      case "pdf":
        return "pdf";
      case "docx":
      case "doc":
        return "docx";
      case "xlsx":
      case "xls":
        return "xlsx";
      default:
        return null;
    }
  };

  const handleFileUpload = async (file: File) => {
    const fileType = getFileType(file);
    if (!fileType) {
      toast.error(`Unsupported file type: ${file.name}`);
      return;
    }

    const uploadId = `${file.name}-${Date.now()}`;
    const newItem: UploadItem = {
      file,
      id: uploadId,
      status: "uploading",
      progress: 0,
    };

    setUploadItems((prev) => [...prev, newItem]);

    try {
      const success = await uploadFile(file, fileType);

      setUploadItems((prev) =>
        prev.map((item) =>
          item.id === uploadId
            ? { ...item, status: success ? "success" : "error", progress: 100 }
            : item
        )
      );

      if (success) {
        onSuccess?.(file.name);
      }
    } catch (error) {
      setUploadItems((prev) =>
        prev.map((item) =>
          item.id === uploadId
            ? {
                ...item,
                status: "error",
                progress: 0,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : item
        )
      );
    }
  };

  const handleFilesChange = (newFiles: File[] | null) => {
    setFiles(newFiles);
    if (newFiles) {
      newFiles.forEach(handleFileUpload);
      setFiles(null); // Clear selection after starting uploads
    }
  };

  const removeUploadItem = (id: string) => {
    setUploadItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getStatusIcon = (status: UploadItem["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "uploading":
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Documents
        </CardTitle>
        <CardDescription>
          Upload PDF, DOCX, or XLSX files to add to your knowledge base. Max
          file size: 50MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUploader
          value={files}
          onValueChange={handleFilesChange}
          dropzoneOptions={{
            accept: ACCEPTED_FILE_TYPES,
            maxSize: MAX_FILE_SIZE,
            multiple: true,
          }}
        >
          <FileInput className="border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="rounded-full bg-muted p-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  Drop files here or click to browse
                </h3>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, DOCX, and XLSX files up to 50MB
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">.pdf</Badge>
                <Badge variant="secondary">.docx</Badge>
                <Badge variant="secondary">.xlsx</Badge>
              </div>
            </div>
          </FileInput>

          {files && files.length > 0 && (
            <FileUploaderContent>
              {files.map((file, index) => (
                <FileUploaderItem key={index} index={index}>
                  <FileText className="h-4 w-4 stroke-current" />
                  <span className="text-sm">{file.name}</span>
                </FileUploaderItem>
              ))}
            </FileUploaderContent>
          )}
        </FileUploader>

        {/* Upload Progress List */}
        {uploadItems.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Upload Progress</h4>
            {uploadItems.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="truncate max-w-[200px]">
                      {item.file.name}
                    </span>
                    <Badge
                      variant={
                        item.status === "success"
                          ? "default"
                          : item.status === "error"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUploadItem(item.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {item.status === "uploading" && uploadProgress && (
                  <Progress value={uploadProgress.progress} className="h-2" />
                )}

                {item.error && (
                  <p className="text-xs text-red-500">{item.error}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
