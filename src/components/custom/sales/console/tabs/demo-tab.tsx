"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthenticatedFetch } from "@/hooks/useAuth";
import {
  type Demo,
  type DemosResponse,
} from "@/components/custom/admin/console/types";
import { DataTable } from "@/components/custom/data-table";
import { demoColumns } from "@/components/custom/admin/console/tabs/columns/demo-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateDemoForm from "./create-demo-form";

export default function DemoManagementTab() {
  const { authenticatedFetch } = useAuthenticatedFetch();
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDemos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authenticatedFetch("/admin/demos");

      if (!res.ok) {
        throw new Error(`Failed to fetch demos: ${res.status}`);
      }

      const data: DemosResponse = await res.json();
      setDemos(data.demos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching demos:", err);
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    fetchDemos();
  }, [fetchDemos]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl">Demo Management</CardTitle>
            <CardDescription>
              Monitor and manage demo customers (24-hour auto-expiry)
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Demo Management</CardTitle>
          <CardDescription>
            Monitor and manage demo customers (24-hour auto-expiry)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive">
            <p>Error loading demos: {error}</p>
            <Button onClick={fetchDemos} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-2xl">Demo Management</CardTitle>
          <CardDescription>
            Monitor and manage demo customers (24-hour auto-expiry)
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>New</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Demo</DialogTitle>
              <DialogDescription>Enter the required fields.</DialogDescription>
            </DialogHeader>
            <CreateDemoForm />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <DataTable
          data={demos}
          columns={demoColumns}
          searchKey="businessName"
          searchPlaceholder="Search demos by business name..."
        />
      </CardContent>
    </Card>
  );
}
