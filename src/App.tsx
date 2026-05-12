import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";

const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Extension = lazy(() => import("./pages/Extension"));
const DesignStylesGuide = lazy(() => import("./pages/DesignStylesGuide"));
const FontsGuide = lazy(() => import("./pages/FontsGuide"));
const PedidosDemo = lazy(() => import("./pages/PedidosDemo"));
const QAGrid = lazy(() => import("./pages/QAGrid"));
const QAGridFrame = lazy(() => import("./pages/QAGridFrame"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AffiliateRedirect = lazy(() => import("./pages/AffiliateRedirect"));
const Legal = lazy(() => import("./pages/Legal"));
const Termos = lazy(() => import("./pages/Termos"));
const Privacidade = lazy(() => import("./pages/Privacidade"));
const Cookies = lazy(() => import("./pages/Cookies"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

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
        <Suspense fallback={null}>
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
            <Route path="/u" element={<AffiliateRedirect slug="u" />} />
            <Route path="/d" element={<AffiliateRedirect slug="d" />} />
            <Route path="/e" element={<AffiliateRedirect slug="e" />} />
            <Route path="/o" element={<AffiliateRedirect slug="o" />} />
            <Route path="/l" element={<AffiliateRedirect slug="l" />} />
            <Route path="/s" element={<AffiliateRedirect slug="s" />} />
            <Route path="/n" element={<AffiliateRedirect slug="n" />} />
            <Route path="/u/:slug" element={<AffiliateRedirect />} />
            <Route path="/:slug" element={<AffiliateRedirect />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
