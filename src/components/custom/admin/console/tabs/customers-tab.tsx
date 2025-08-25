// components/customers/customer-management-tab.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuthenticatedFetch } from "@/hooks/useAuth";
import {
  type Customer,
  type CustomersResponse,
} from "@/components/custom/admin/console/types";
import { DataTable } from "@/components/custom/data-table";
import { customerColumns } from "./columns/customer-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CustomerManagementTab() {
  const { authenticatedFetch } = useAuthenticatedFetch();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authenticatedFetch("/admin/customers");

      if (!res.ok) {
        throw new Error(`Failed to fetch customers: ${res.status}`);
      }

      const data: CustomersResponse = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Customer Management</CardTitle>
          <CardDescription>Manage all production customers</CardDescription>
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
          <CardTitle className="text-2xl">Customer Management</CardTitle>
          <CardDescription>Manage all production customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive">
            <p>Error loading customers: {error}</p>
            <Button onClick={fetchCustomers} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Customer Management</CardTitle>
        <CardDescription>Manage all production customers</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={customers}
          columns={customerColumns}
          searchKey="businessName"
          searchPlaceholder="Search customers by business name..."
        />
      </CardContent>
    </Card>
  );
}
