/**
 * Knowledge Base Manager Component
 * Main component that combines all knowledge base functionality
 */

"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, Upload, Globe, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import WebsiteCrawlForm from "./website-crawl-form";
import DocumentUpload from "./document-upload";
import KnowledgeSearch from "./knowledge-search";
import type { KnowledgeBaseConfig } from "@/hooks/useKnowledgeBase";

interface KnowledgeBaseManagerProps {
  orgId: string;
  locationId: string;
}

export default function KnowledgeBaseManager({
  orgId,
  locationId,
}: KnowledgeBaseManagerProps) {
  const [activeTab, setActiveTab] = useState("search");

  const config: KnowledgeBaseConfig = {
    orgId,
    locationId,
  };

  const handleSuccess = (message: string) => {
    console.log(message);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Database className="h-6 w-6" />
            Knowledge Base Manager
          </CardTitle>
          <CardDescription className="flex items-center gap-4">
            <span>Manage your AI knowledge base content and search</span>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                Org: {orgId}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Location: {locationId}
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Files
          </TabsTrigger>
          <TabsTrigger value="crawl" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Crawl Website
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <KnowledgeSearch config={config} />
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <DocumentUpload
            config={config}
            onSuccess={(fileName) => handleSuccess(`Uploaded ${fileName}`)}
          />
        </TabsContent>

        <TabsContent value="crawl" className="space-y-6">
          <WebsiteCrawlForm
            config={config}
            onSuccess={() => handleSuccess("Website crawl started")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
