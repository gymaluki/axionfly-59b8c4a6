import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DesignStylesGuide from "./pages/DesignStylesGuide";
import FontsGuide from "./pages/FontsGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checking) return null;
  if (isAuthenticated) {
    window.location.pathname === "/" || window.location.pathname === "/auth"
      ? (window.location.href = "/dashboard")
      : null;
    return null;
  }
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthRedirect><Index /></AuthRedirect>} />
          <Route path="/auth" element={<AuthRedirect><Auth /></AuthRedirect>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/guia-design" element={<DesignStylesGuide />} />
          <Route path="/guia-fontes" element={<FontsGuide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
