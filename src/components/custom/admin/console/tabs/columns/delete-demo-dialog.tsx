"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthenticatedFetch } from "@/hooks/useAuth";
import { toast } from "sonner";
import { type Demo } from "@/components/custom/admin/console/types";

// Delete demo function
async function deleteDemoCustomer(
  orgId: string,
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>
): Promise<boolean> {
  try {
    const response = await authenticatedFetch(`/admin/demos/${orgId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast.success(`Demo customer deleted successfully.`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(
        `Failed to delete demo customer ${orgId}: ${response.status} - ${errorText}`
      );

      if (response.status === 400) {
        toast.error(`Error: Invalid request. ${errorText}`);
      } else if (response.status === 403) {
        toast.error(
          "Error: You do not have permission to perform this action."
        );
      } else if (response.status === 404) {
        toast.error("Error: Demo customer not found.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      return false;
    }
  } catch (error) {
    console.error("Network or unexpected error:", error);
    toast.error("A network error occurred. Please check your connection.");
    return false;
  }
}

interface DeleteDemoDialogProps {
  demo: Demo;
  onSuccess: () => void;
}

export function DeleteDemoDialog({ demo, onSuccess }: DeleteDemoDialogProps) {
  const { authenticatedFetch } = useAuthenticatedFetch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deleteDemoCustomer(demo.orgId, authenticatedFetch);
    setIsDeleting(false);

    if (success) {
      setIsOpen(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Demo Customer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the demo customer "
            {demo.businessName}"? This will permanently remove the customer,
            release phone numbers, and delete all associated knowledge base
            documents.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
