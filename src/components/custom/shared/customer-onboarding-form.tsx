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
  useDemoNumberPool?: boolean;
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
  useDemoNumberPool = false,
}: CustomerOnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [created, setCreated] = useState<CreateCustomerResponse | null>(null);
  const [demoNumbers, setDemoNumbers] = useState<
    Array<{
      id: string;
      phoneNumber: string;
      available?: boolean;
      assignedToOrgId?: string | null;
      assignedAt?: string | null;
      createdAt?: string;
    }>
  >([]);
  const [isLoadingDemoNumbers, setIsLoadingDemoNumbers] = useState(false);

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
        websiteUrl: z
          .union([z.string().url("Enter a valid URL"), z.literal("")])
          .optional(),
        address: z.object({
          street1: z.string().min(1, "Street address is required"),
          street2: z.string().optional(),
          city: z.string().min(1, "City is required"),
          state: z.string().min(2, "State is required"),
          postalCode: z.string().min(3, "Postal code is required"),
          country: z.string().min(2, "Country is required"),
        }),
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
    websiteUrl?: string;
    address: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
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

  useEffect(() => {
    if (!useDemoNumberPool) return;
    const fetchDemoNumbers = async () => {
      setIsLoadingDemoNumbers(true);
      try {
        const res = await authenticatedFetch("/admin/demo-phone-numbers");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = (await res.json()) as {
          availableNumbers: Array<{
            id: string;
            phoneNumber: string;
          }>;
          stats?: {
            totalNumbers: number;
            availableNumbers: number;
            assignedNumbers: number;
          };
        };
        setDemoNumbers(data.availableNumbers || []);
      } catch (error) {
        console.error("Error fetching demo phone numbers:", error);
      } finally {
        setIsLoadingDemoNumbers(false);
      }
    };
    fetchDemoNumbers();
  }, [authenticatedFetch, useDemoNumberPool]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      businessName: "",
      phone: "",
      websiteUrl: "",
      address: {
        street1: "",
        street2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US",
      },
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
            isValid = await form.trigger([
              "websiteUrl",
              "address.street1",
              "address.city",
              "address.state",
              "address.postalCode",
              "address.country",
            ]);
          }
          break;
        case 3:
          isValid = await form.trigger([
            "websiteUrl",
            "address.street1",
            "address.city",
            "address.state",
            "address.postalCode",
            "address.country",
          ]);
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

  const formatAddressString = useCallback(
    (addr: FormValues["address"]): string => {
      const parts: string[] = [];
      if (addr.street1) parts.push(addr.street1);
      if (addr.street2) parts.push(addr.street2);
      const cityState = addr.state ? `${addr.city}, ${addr.state}` : addr.city;
      const cityStatePostal = addr.postalCode
        ? `${cityState} ${addr.postalCode}`
        : cityState;
      if (cityStatePostal) parts.push(cityStatePostal);
      if (addr.country) parts.push(addr.country);
      return parts.filter(Boolean).join(", ");
    },
    []
  );

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
        website: values.websiteUrl || undefined,
        address: formatAddressString(values.address),
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
                        <FormLabel>
                          {useDemoNumberPool ? "Demo Number" : "Phone"}
                        </FormLabel>
                        {useDemoNumberPool ? (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={
                              isLoadingDemoNumbers || demoNumbers.length === 0
                            }
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={
                                    isLoadingDemoNumbers
                                      ? "Loading available demo numbers..."
                                      : demoNumbers.length === 0
                                      ? "No demo numbers available"
                                      : "Select a demo number"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {demoNumbers.length > 0 ? (
                                demoNumbers.map((num) => (
                                  <SelectItem
                                    key={num.id}
                                    value={num.phoneNumber}
                                  >
                                    {num.phoneNumber}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-numbers" disabled>
                                  No demo numbers available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        ) : (
                          <FormControl className="w-full">
                            <PhoneInput
                              placeholder="Enter phone number"
                              {...field}
                              defaultCountry="US"
                            />
                          </FormControl>
                        )}
                        <FormDescription>
                          {useDemoNumberPool
                            ? "Select a preassigned demo number from the pool."
                            : "Enter a US phone number in E.164 format (e.g., +12223334444)."}
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
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com (optional)"
                            type="url"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional reference URL. Uploads/crawling happen after
                          creation.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="address.street1"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Main St"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.street2"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>
                            Apartment, suite, etc. (optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Apt 4B"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Region</FormLabel>
                          <FormControl>
                            <Input placeholder="State" type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ZIP / Postal code"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Country"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
