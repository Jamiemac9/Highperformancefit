import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/layout";

import Landing from "./pages/landing";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Clients from "./pages/clients";
import ClientDetail from "./pages/client-detail";
import Sessions from "./pages/sessions";
import Packages from "./pages/packages";
import Bookings from "./pages/bookings";
import Leads from "./pages/leads";
import Portal from "./pages/portal";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/" element={<Layout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
                {/* Trainer Routes */}
                <Route element={<ProtectedRoute role="TRAINER" />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="clients/:id" element={<ClientDetail />} />
                  <Route path="sessions" element={<Sessions />} />
                  <Route path="packages" element={<Packages />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="leads" element={<Leads />} />
                </Route>

                {/* Client Routes */}
                <Route element={<ProtectedRoute role="CLIENT" />}>
                  <Route path="portal" element={<Portal />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
