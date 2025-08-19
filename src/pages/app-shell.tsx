import { Routes, Route } from "react-router";
import Navbar from "@/components/custom/navbar";

import AuthPage from "@/pages/auth-page";
import ConsolePage from "@/pages/admin/console-page";
import ProfileSetupPage from "./admin/profile-setup-page";
import ProtectedLayout from "./layouts/protected";

export default function AppShell() {
  const isAuthenticated = false;
  return (
    <main className="min-h-screen">
      <Routes>
        <Route index element={isAuthenticated ? <Navbar /> : <AuthPage />} />
        <Route path="admin/profile-setup" element={<ProfileSetupPage />} />
        <Route path="admin" element={<ProtectedLayout />}>
          <Route path="console" element={<ConsolePage />} />
        </Route>
      </Routes>
    </main>
  );
}
