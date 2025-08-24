import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@iconify-icon/react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { signIn, signUp, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  function handleSignIn() {
    signIn();
  }

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/welcome", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-xl text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
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
            <CardTitle className="text-3xl font-primary">Welcome</CardTitle>
            <CardDescription>Sign in or create an account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={handleSignIn} className="w-full rounded-full">
              Sign In
            </Button>
            <Button
              onClick={() => signUp()}
              variant="outline"
              className="w-full rounded-full"
            >
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-xl text-primary" />
    </div>
  );
}
