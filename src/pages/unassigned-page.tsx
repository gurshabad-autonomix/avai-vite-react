import { useState } from "react";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthenticatedFetch, useAuth } from "@/hooks/useAuth";
import { getNextPathForUser } from "@/lib/utils";
import { useAtom } from "jotai";
import { meAtom } from "@/state/auth";
import type { MeResponse } from "@/types/auth";

const inviteSchema = z.object({
  code: z.string().min(1, { message: "Invite code is required" }),
});

export default function UnassignedUserPage() {
  const navigate = useNavigate();
  const { authenticatedFetch } = useAuthenticatedFetch();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [, setMe] = useAtom(meAtom);

  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { code: "" },
  });

  async function handleInviteSubmit(values: z.infer<typeof inviteSchema>) {
    setSubmitting(true);
    try {
      const res = await authenticatedFetch("/registration/upgrade-role", {
        method: "POST",
        body: JSON.stringify({ code: values.code }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Failed: ${res.status}`);
      }
      toast.success("Invite applied. Updating your access…");

      const meRes = await authenticatedFetch("/users/me");
      if (!meRes.ok) throw new Error("Failed to load profile");
      const me = (await meRes.json()) as MeResponse;
      setMe(me);
      const next = getNextPathForUser(me);
      navigate(next, { replace: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      toast.error(`Unable to apply invite: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-start justify-center pt-24">
      <div className="w-[90%] md:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-background/60 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="font-primary">
              Join with Invite Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleInviteSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. AVAI-1234-ABCD" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full font-primary font-semibold"
                >
                  {submitting ? "Applying…" : "Apply Invite"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="font-primary">
              Need an Organization?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Ask your administrator to create an organization and add your
                account.
              </p>
              {user?.email ? (
                <p>
                  Your email:{" "}
                  <span className="text-foreground">{user.email}</span>
                </p>
              ) : null}
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full"
                onClick={() => toast.info("Please contact your administrator.")}
              >
                Contact Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
