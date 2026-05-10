import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Extension from "./pages/Extension";
import DesignStylesGuide from "./pages/DesignStylesGuide";
import FontsGuide from "./pages/FontsGuide";
import PedidosDemo from "./pages/PedidosDemo";
import QAGrid from "./pages/QAGrid";
import QAGridFrame from "./pages/QAGridFrame";
import NotFound from "./pages/NotFound";
import AffiliateRedirect from "./pages/AffiliateRedirect";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/extensao" element={<Extension />} />
          <Route path="/guia-design" element={<DesignStylesGuide />} />
          <Route path="/guia-fontes" element={<FontsGuide />} />
          <Route path="/pedidos-demo" element={<PedidosDemo />} />
          <Route path="/qa-grid" element={<QAGrid />} />
          <Route path="/qa-grid/frame" element={<QAGridFrame />} />
          <Route path="/u/:slug" element={<AffiliateRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
