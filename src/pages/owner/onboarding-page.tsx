import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMe } from "@/hooks/useMe";
import { Icon } from "@iconify-icon/react";

export default function OwnerNeedsOnboarding() {
  const { data } = useMe();
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-4">
      <a href="/" className="flex items-center gap-2">
        <Icon
          icon="qlementine-icons:wave-16"
          width="50"
          height="50"
          className="text-primary"
        />
        <span className="text-4xl hidden md:flex font-semibold tracking-tight font-primary">
          All Voice AI
        </span>
      </a>
      <Card className="bg-background w-[90%] md:w-[40%]">
        <CardHeader>
          <CardTitle className="text-3xl font-primary">Account Setup</CardTitle>
          <CardDescription>
            This account is currently in the process of being setup. Your
            account is created and awaiting final setup. An AllVoiceAI
            representative will configure your phone numbers and knowledge base
            shortly. You will be notified once it's complete.
          </CardDescription>
          <CardContent className="px-0 py-4">
            <div className="bg-gradient-to-r from-primary/5 border to-secondary/5 p-4 rounded-2xl flex flex-col gap-3">
              <span className="font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Account Email
              </span>
              <div className="flex items-center gap-2">
                <Input disabled value={data?.email} />
                <Button
                  type="button"
                  // variant="outline"
                  onClick={() => navigator.clipboard.writeText(data?.email!)}
                >
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
