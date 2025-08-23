import { Routes, Route } from "react-router";

import ProtectedLayout from "./layouts/protected";
import AuthPage from "@/pages/auth-page";

import DevPage from "./dev-page";

import AdminConsolePage from "@/pages/admin/console-page";
import AdminProfileSetupPage from "@/pages/admin/profile-setup-page";

import SalesConsolePage from "@/pages/sales/console-page";
import SalesProfileSetupPage from "@/pages/sales/profile-setup-page";
import OwnerNeedsOnboarding from "./owner/onboarding-page";
import OwnerConsolePage from "./owner/console-page";
import KnowledgeBaseDemo from "@/components/custom/knowledge-base/knowledge-base-demo";

export default function AppShell() {
  return (
    <main className="min-h-screen">
      <Routes>
        {/* Root route always decides based on role */}
        <Route index element={<AuthPage />} />

        <Route path="/dev" element={<DevPage />} />

        {/* ADMIN ROUTES */}
        <Route path="admin/profile-setup" element={<AdminProfileSetupPage />} />
        <Route path="admin" element={<ProtectedLayout />}>
          <Route path="console" element={<AdminConsolePage />} />
        </Route>

        {/* SALES ROUTES */}
        <Route path="sales/profile-setup" element={<SalesProfileSetupPage />} />
        <Route path="sales" element={<ProtectedLayout />}>
          <Route path="console" element={<SalesConsolePage />} />
        </Route>

        {/* OWNER ROUTES */}
        <Route path="owner/onboarding" element={<OwnerNeedsOnboarding />} />
        <Route path="owner" element={<ProtectedLayout />}>
          <Route path="console" element={<OwnerConsolePage />} />
        </Route>

        {/* KNOWLEDGE BASE ROUTES */}
        <Route path="knowledge-base" element={<ProtectedLayout />}>
          <Route path="/knowledge-base" element={<KnowledgeBaseDemo />} />
        </Route>
      </Routes>
    </main>
  );
}
