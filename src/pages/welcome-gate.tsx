import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMe } from "@/hooks/useMe";
import { getNextPathForUser } from "@/lib/utils";
import { env } from "@/lib/env";

export default function WelcomeGate() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { data, loading, error } = useMe();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }
    if (!loading && data) {
      const next = getNextPathForUser(data);
      navigate(next, { replace: true });
    }
    if (!loading && error) {
      const statusCode = Number(error);
      if (statusCode === 401 || statusCode === 403) {
        // keyloack logout
        window.location.href = `${env.KEYCLOAK_URL}/protocol/openid-connect/logout?redirect_uri=${window.location.origin}`;
        navigate("/", { replace: true });
        return;
      }
      navigate("/welcome/invite", { replace: true });
    }
  }, [isAuthenticated, isLoading, loading, data, error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-xl text-primary" />
    </div>
  );
}
