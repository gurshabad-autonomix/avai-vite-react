"use client";
import { useState, useEffect } from "react";
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
  CloudUpload,
  Paperclip,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthenticatedFetch } from "@/hooks/useCognitoAuth";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface UserResponse {
  users: User[];
  total: number;
}

const step1Schema = z.object({
  customerEmail: z.string().email("Please enter a valid email address"),
});

const step2Schema = z.object({
  businessName: z
    .string()
    .min(3, "Business name must be at least 3 characters")
    .max(100, "Business name must be less than 100 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  orgOwnerId: z.string().min(1, "Organization owner is required"),
});

const step3Schema = z.object({
  knowledgeBase: z.string().min(1, "Knowledge base URL is required"),
  browseFiles: z.string().optional(),
  address: z.string().min(10, "Address must be detailed."),
});

const formSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export default function CreateDemoForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<File[] | null>(null);
  const [direction, setDirection] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const { authenticatedFetch } = useAuthenticatedFetch();

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
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
  }

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      customerEmail: "",
      businessName: "",
      phone: "",
      knowledgeBase: "",
      browseFiles: "",
      address: "",
      orgOwnerId: "",
    },
  });

  const validateStep = async (step: number) => {
    let isValid = false;

    switch (step) {
      case 1:
        isValid = await form.trigger(["customerEmail"]);
        break;
      case 2:
        isValid = await form.trigger(["businessName", "phone", "orgOwnerId"]);
        break;
      case 3:
        isValid = await form.trigger(["knowledgeBase", "address"]);
        break;
    }

    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 3) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const postData = {
        businessName: values.businessName,
        contactEmail: values.customerEmail,
        orgOwnerId: values.orgOwnerId,
        website: values.knowledgeBase || "string", // Use empty string or default
        address: values.address,
        provisionedTwilioNumber: values.phone,
      };

      const res = await authenticatedFetch("/admin/demos", {
        method: "POST",
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

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
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the customer email which they have used to
                          sign in.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 2 && (
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
                            defaultCountry="IN"
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a number you have provisioned in Twilio, in
                          E.164 format.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

              {currentStep === 3 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="knowledgeBase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Knowledge Base</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter website URL"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the URL of your website which will be used to
                          train AVAI.
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
                        {/* <FormDescription>
                          This is the URL of your website which will be used to
                          train AVAI.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="browseFiles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select File</FormLabel>
                        <FormControl>
                          <FileUploader
                            value={files}
                            onValueChange={setFiles}
                            dropzoneOptions={dropZoneConfig}
                            className="relative bg-background rounded-lg p-2"
                          >
                            <FileInput
                              id="fileInput"
                              className="outline-dashed outline-1 outline-slate-500"
                              {...field}
                            >
                              <div className="flex items-center justify-center flex-col p-8 w-full ">
                                <CloudUpload className="text-gray-500 w-10 h-10" />
                                <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>
                                  &nbsp; or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  SVG, PNG, JPG or GIF
                                </p>
                              </div>
                            </FileInput>
                            <FileUploaderContent>
                              {files &&
                                files.length > 0 &&
                                files.map((file, i) => (
                                  <FileUploaderItem key={i} index={i}>
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span>{file.name}</span>
                                  </FileUploaderItem>
                                ))}
                            </FileUploaderContent>
                          </FileUploader>
                        </FormControl>
                        <FormDescription>
                          Select a file to upload.
                        </FormDescription>
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
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="submit" className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Submit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
