import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@iconify-icon/react";
import SignUpForm from "@/components/custom/auth/sign-up-form";
import { useCognitoAuth } from "@/hooks/useCognitoAuth";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useMe";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { getConsolePath, getProfileSetupPath } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { signIn } = useCognitoAuth();

  function handleSignIn() {
    signIn();
  }

  const { data: user, loading } = useMe();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // User is authenticated, redirect based on onboarding status and role
      if (user.onboarded) {
        const consolePath = getConsolePath(user.role);
        navigate(consolePath, { replace: true });
      } else {
        const setupPath = getProfileSetupPath(user.role);
        navigate(setupPath, { replace: true });
      }
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-xl text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center gap-4 justify-center">
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
        <Card className="w-[90%] md:w-[40%] bg-background backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-3xl font-primary">
              Create An Account
            </CardTitle>
            <CardDescription>
              Proceed with an invite code (for Admin/Sales)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
        </Card>
        <span className="text-muted-foreground">
          Already have an account?{" "}
          <Button onClick={handleSignIn} variant="link" className="p-0">
            Sign In
          </Button>
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-xl text-primary" />
    </div>
  );
}
