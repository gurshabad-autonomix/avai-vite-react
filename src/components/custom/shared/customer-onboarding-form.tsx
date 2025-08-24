"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import KnowledgeBaseManager from "@/components/custom/knowledge-base/knowledge-base-manager";
import { useAuthenticatedFetch, useAuth } from "@/hooks/useAuth";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface UserResponse {
  users: User[];
  total: number;
}

interface CustomerOnboardingFormProps {
  submitUrl: string;
  requireOrgOwner?: boolean;
  showKnowledgeBaseOnSuccess?: boolean;
}

interface CreateCustomerResponse {
  orgId: string;
  businessName: string;
  orgOwnerId: string;
  website: string;
  address: string;
  provisionedTwilioNumber: string;
  locationId: string;
  createdAt: string;
  expiresAt: string;
  demo: boolean;
}

export default function CustomerOnboardingForm({
  submitUrl,
  requireOrgOwner = true,
  showKnowledgeBaseOnSuccess = true,
}: CustomerOnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [created, setCreated] = useState<CreateCustomerResponse | null>(null);

  const lastStep = requireOrgOwner ? 3 : 2;

  const { authenticatedFetch } = useAuthenticatedFetch();
  const { user: authUser } = useAuth();

  const step1Schema = useMemo(
    () =>
      z.object({
        businessName: z
          .string()
          .min(3, "Business name must be at least 3 characters")
          .max(100, "Business name must be less than 100 characters"),
        phone: z.string().refine((value) => /^\+1\d{10}$/.test(value), {
          message:
            "US phone number must be in E.164 format (e.g., +12223334444)",
        }),
      }),
    []
  );

  const step2OwnerSchema = useMemo(() => z.object({}), []);

  const step2AdminSchema = useMemo(
    () =>
      z.object({
        orgOwnerId: z.string().min(1, "Organization owner is required"),
      }),
    []
  );

  const step3Schema = useMemo(
    () =>
      z.object({
        website: z.string().min(1, "Website is required"),
        address: z.string().min(10, "Address must be detailed."),
      }),
    []
  );

  const formSchema = useMemo(() => {
    return requireOrgOwner
      ? step1Schema.merge(step2AdminSchema).merge(step3Schema)
      : step1Schema.merge(step2OwnerSchema).merge(step3Schema);
  }, [
    requireOrgOwner,
    step1Schema,
    step2AdminSchema,
    step2OwnerSchema,
    step3Schema,
  ]);

  type FormValues = z.infer<typeof formSchema> & {
    businessName: string;
    phone: string;
    website: string;
    address: string;
    orgOwnerId?: string;
  };

  useEffect(() => {
    if (!requireOrgOwner) return;
    const getUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const res = await authenticatedFetch("/admin/users");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = (await res.json()) as UserResponse;
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    getUsers();
  }, [authenticatedFetch, requireOrgOwner]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      businessName: "",
      phone: "",
      website: "",
      address: "",
      orgOwnerId: requireOrgOwner ? "" : undefined,
    },
  });

  const validateStep = useCallback(
    async (step: number) => {
      let isValid = false;
      switch (step) {
        case 1:
          isValid = await form.trigger(["businessName", "phone"]);
          break;
        case 2:
          if (requireOrgOwner) {
            isValid = await form.trigger(["orgOwnerId"]);
          } else {
            isValid = await form.trigger(["website", "address"]);
          }
          break;
        case 3:
          isValid = await form.trigger(["website", "address"]);
          break;
      }
      return isValid;
    },
    [form, requireOrgOwner]
  );

  const nextStep = useCallback(async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < lastStep) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, lastStep, validateStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  async function onSubmit(values: FormValues) {
    try {
      const selectedUserEmail = requireOrgOwner
        ? users.find((u) => u.id === values.orgOwnerId)?.email
        : authUser?.email;
      const orgOwnerId = requireOrgOwner ? values.orgOwnerId : authUser?.id;

      if (!selectedUserEmail) {
        toast.error("Unable to resolve contact email from selected user.");
        return;
      }
      if (!orgOwnerId) {
        toast.error("Unable to resolve organization owner.");
        return;
      }

      const postData = {
        businessName: values.businessName,
        orgOwnerId: orgOwnerId,
        website: values.website,
        address: values.address,
        provisionedTwilioNumber: values.phone,
      };

      const res = await authenticatedFetch(submitUrl, {
        method: "POST",
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          `HTTP error! status: ${JSON.stringify(
            error?.detail || error?.message,
            null,
            2
          )} ${res.status} `
        );
      }

      const data = (await res.json()) as CreateCustomerResponse;
      setCreated(data);
      toast.success("Customer created successfully");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Phone number")) {
          toast.error("Phone number is already in use.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to submit the form. Please try again. " + error);
      }
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  } as const;

  if (showKnowledgeBaseOnSuccess && created?.orgId && created?.locationId) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">
            Customer created:{" "}
            <span className="font-medium">{created.businessName}</span>
          </p>
        </div>
        <KnowledgeBaseManager
          orgId={created.orgId}
          locationId={created.locationId}
        />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="space-y-6"
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your business name"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Name must lie between 3 and 100 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start">
                        <FormLabel>Phone</FormLabel>
                        <FormControl className="w-full">
                          <PhoneInput
                            placeholder="Enter phone number"
                            {...field}
                            defaultCountry="US"
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a US phone number in E.164 format (e.g.,
                          +12223334444).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {requireOrgOwner && currentStep === 2 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="orgOwnerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select User</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoadingUsers}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingUsers ? (
                              <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                                Loading users...
                              </div>
                            ) : users.length > 0 ? (
                              users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.fullName} ({user.email})
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-users" disabled>
                                No users available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {((requireOrgOwner && currentStep === 3) ||
                (!requireOrgOwner && currentStep === 2)) && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (reference)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter website URL"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This website is for reference. Uploads/crawling happen
                          after creation.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            className="resize-none"
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-transparent"
          >
            Previous
          </Button>

          {currentStep < lastStep ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2"
            >
              Next
            </Button>
          ) : (
            <Button type="submit" className="flex items-center gap-2">
              Submit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
