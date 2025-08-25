// components/demos/demo-columns.tsx
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type Demo } from "@/components/custom/admin/console/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KnowledgeBaseManager } from "@/components/custom/knowledge-base";
import { DeleteDemoDialog } from "./delete-demo-dialog";

export const demoColumns: ColumnDef<Demo>[] = [
  {
    accessorKey: "businessName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
        >
          BUSINESS NAME
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-center">
        {row.getValue("businessName")}
      </div>
    ),
  },
  {
    accessorKey: "website",
    header: "WEBSITE",
    cell: ({ row }) => (
      <div className="text-center">
        <a
          href={row.getValue("website")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {row.getValue("website")}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "ADDRESS",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "provisionedTwilioNumber",
    header: "PHONE NUMBER",
    cell: ({ row }) => (
      <div className="font-mono text-center">
        {row.getValue("provisionedTwilioNumber")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
        >
          CREATED
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-muted-foreground text-center">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "expiresAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
        >
          EXPIRES
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("expiresAt"));
      return (
        <div className="text-muted-foreground text-center">
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "expired",
    header: "STATUS",
    cell: ({ row }) => {
      const isExpired = row.getValue("expired");
      return (
        <div className="flex justify-center">
          <Badge variant={isExpired ? "destructive" : "outline"}>
            {isExpired ? "Expired" : "Active"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="font-medium text-muted-foreground text-center">
        ACTIONS
      </div>
    ),
    enableHiding: false,
    cell: ({ row, table }) => {
      const demo = row.original;
      const hasLocation = Boolean(demo.locationId);

      // Get refresh function from table meta if available
      const refreshData = (table.options.meta as { refreshData?: () => void })
        ?.refreshData;

      return (
        <div className="flex justify-center space-x-2">
          {hasLocation ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Manage</Button>
              </DialogTrigger>
              <DialogContent className="w-[80vw] max-w-[80vw] sm:max-w-[80vw] md:max-w-[80vw] lg:max-w-[80vw]">
                <DialogHeader>
                  <DialogTitle>Knowledge Base</DialogTitle>
                  <DialogDescription>
                    Upload documents, crawl website, and search knowledge for
                    this demo.
                  </DialogDescription>
                </DialogHeader>
                {/* Render KB Manager inline for the demo org/location */}
                <KnowledgeBaseManager
                  orgId={demo.orgId}
                  locationId={demo.locationId as string}
                />
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="bg-transparent"
              disabled
            >
              No KB
            </Button>
          )}

          <DeleteDemoDialog
            demo={demo}
            onSuccess={() => refreshData && refreshData()}
          />
        </div>
      );
    },
  },
];
