import { Routes, Route } from "react-router";
import Navbar from "@/components/custom/navbar";

import AuthPage from "@/pages/auth-page";
import ConsolePage from "@/pages/admin/console-page";
import AdminProfileSetupPage from "./admin/profile-setup-page";
import ProtectedLayout from "./layouts/protected";
import DevPage from "./dev-page";
import SalesProfileSetupPage from "./sales/profile-setup-page";

export default function AppShell() {
  const isAuthenticated = false;
  return (
    <main className="min-h-screen">
      <Routes>
        <Route index element={isAuthenticated ? <Navbar /> : <AuthPage />} />
        <Route path="/dev" element={<DevPage />} />
        {/* ADMIN ROUTES */}
        <Route path="admin/profile-setup" element={<AdminProfileSetupPage />} />
        <Route path="admin" element={<ProtectedLayout />}>
          <Route path="console" element={<ConsolePage />} />
        </Route>

        {/* SALES ROUTES */}
        <Route path="sales/profile-setup" element={<SalesProfileSetupPage />} />
      </Routes>
    </main>
  );
}
