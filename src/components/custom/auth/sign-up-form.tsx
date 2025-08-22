"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthenticatedFetch, useCognitoAuth } from "@/hooks/useCognitoAuth";
import { env } from "@/lib/env";

const formSchema = z.object({
  secretCode: z.string({ error: "Required" }).min(1, { error: "Required" }),
  email: z.email().min(1, { error: "Required" }),
});

export default function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      secretCode: "",
      email: "",
    },
  });
  const { signIn } = useCognitoAuth();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch(`${env.API_ENDPOINT}/registration/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: values.secretCode,
          email: values.email,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to validate code");
      }
      toast.success(
        "A temporary password has been assigned to you. Please check your email inbox."
      );
      signIn();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secretCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invite Code</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full rounded-full font-primary font-semibold text-base"
        >
          Continue
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background/10 backdrop-blur-2xl rounded-full border text-muted-foreground relative z-10 px-2">
            OR
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full font-primary font-semibold text-base"
        >
          Create an Organization
        </Button>
      </form>
    </Form>
  );
}
