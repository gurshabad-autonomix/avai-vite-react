import Navbar from "@/components/custom/navbar";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="flex flex-col">
      <Navbar />
      <div className="pt-28">
        <Outlet />
      </div>
    </section>
  );
}
