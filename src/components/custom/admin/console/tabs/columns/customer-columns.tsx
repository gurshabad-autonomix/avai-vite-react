// components/customers/customer-columns.tsx
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type Customer } from "@/components/custom/admin/console/types";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const customerColumns: ColumnDef<Customer>[] = [
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
    accessorKey: "contactEmail",
    header: "CONTACT EMAIL",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("contactEmail")}</div>
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
    id: "actions",
    header: () => (
      <div className="font-medium text-muted-foreground text-center">
        ACTIONS
      </div>
    ),
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(customer.orgId)}
              >
                Copy Customer ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit customer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
