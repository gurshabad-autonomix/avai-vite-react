import { Routes, Route } from "react-router";
import Navbar from "@/components/custom/navbar";

import ProtectedLayout from "./layouts/protected";
import AuthPage from "@/pages/auth-page";

import DevPage from "./dev-page";

import AdminConsolePage from "@/pages/admin/console-page";
import AdminProfileSetupPage from "@/pages/admin/profile-setup-page";

import SalesConsolePage from "@/pages/sales/console-page";
import SalesProfileSetupPage from "@/pages/sales/profile-setup-page";
import { KnowledgeBaseDemo } from "@/components/custom/knowledge-base";

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
          <Route path="console" element={<AdminConsolePage />} />
        </Route>

        {/* SALES ROUTES */}
        <Route path="sales/profile-setup" element={<SalesProfileSetupPage />} />
        <Route path="sales" element={<ProtectedLayout />}>
          <Route path="console" element={<SalesConsolePage />} />
        </Route>

        {/* KNOWLEDGE BASE ROUTES */}
        <Route path="knowledge-base" element={<ProtectedLayout />}>
          <Route path="/knowledge-base" element={<KnowledgeBaseDemo />} />
        </Route>
      </Routes>
    </main>
  );
}
