import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { initScrollReveal } from "./utils/scrollReveal";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/layout";
import { DashboardLayout } from "./components/dashboard-layout";
import { PortalLayout } from "./components/portal-layout";

import Landing from "./pages/landing";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Clients from "./pages/clients";
import ClientDetail from "./pages/client-detail";
import Sessions from "./pages/sessions";
import Packages from "./pages/packages";
import Bookings from "./pages/bookings";
import DashboardLeads from "./pages/dashboard-leads";
import PortalDashboard from "./pages/portal-dashboard";
import PortalSessions from "./pages/portal-sessions";
import PortalBook from "./pages/portal-book";
import PortalPackages from "./pages/portal-packages";
import PortalProfile from "./pages/portal-profile";
import NotFound from "./pages/not-found";

function LegacyClientRedirect() {
  const { id } = useParams();
  return <Navigate to={`/dashboard/clients/${id ?? ""}`} replace />;
}

function Settings() {
  return (
    <div className="text-white/60">
      <p className="text-lg">Settings coming soon.</p>
      <p className="text-sm mt-2">Profile, billing, integrations and account preferences will live here.</p>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    const cleanup = initScrollReveal();
    return cleanup;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Routes>
              <Route path="/" element={<Landing />} />

              {/* Public routes wrapped in marketing layout */}
              <Route path="/" element={<Layout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

              {/* Client portal */}
              <Route element={<ProtectedRoute role="CLIENT" />}>
                <Route path="/portal" element={<PortalLayout />}>
                  <Route index element={<Navigate to="/portal/dashboard" replace />} />
                  <Route path="dashboard" element={<PortalDashboard />} />
                  <Route path="sessions" element={<PortalSessions />} />
                  <Route path="book" element={<PortalBook />} />
                  <Route path="packages" element={<PortalPackages />} />
                  <Route path="profile" element={<PortalProfile />} />
                </Route>
              </Route>

              {/* Trainer dashboard with sidebar layout */}
              <Route element={<ProtectedRoute role="TRAINER" />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="leads" element={<DashboardLeads />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="clients/:id" element={<ClientDetail />} />
                  <Route path="sessions" element={<Sessions />} />
                  <Route path="packages" element={<Packages />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>

              {/* Legacy redirects */}
              <Route path="/clients" element={<Navigate to="/dashboard/clients" replace />} />
              <Route path="/clients/:id" element={<LegacyClientRedirect />} />
              <Route path="/sessions" element={<Navigate to="/dashboard/sessions" replace />} />
              <Route path="/packages" element={<Navigate to="/dashboard/packages" replace />} />
              <Route path="/bookings" element={<Navigate to="/dashboard/bookings" replace />} />
              <Route path="/leads" element={<Navigate to="/dashboard/leads" replace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
