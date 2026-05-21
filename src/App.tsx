import { lazy, Suspense, Component, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Recarrega a página quando um chunk dinâmico falha (deploy novo derruba os antigos)
const isChunkLoadError = (err: any) => {
  const msg = String(err?.message || err || "");
  return (
    /Loading chunk [\d]+ failed/i.test(msg) ||
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /ChunkLoadError/i.test(msg)
  );
};

if (typeof window !== "undefined") {
  const tryReload = () => {
    const key = "__chunk_reload_at";
    const last = Number(sessionStorage.getItem(key) || 0);
    if (Date.now() - last > 10_000) {
      sessionStorage.setItem(key, String(Date.now()));
      window.location.reload();
    }
  };
  window.addEventListener("error", (e) => {
    if (isChunkLoadError(e.error || e.message)) tryReload();
  });
  window.addEventListener("unhandledrejection", (e) => {
    if (isChunkLoadError(e.reason)) tryReload();
  });
}

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError(error: any) {
    if (isChunkLoadError(error)) {
      window.location.reload();
      return { hasError: true };
    }
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    if (isChunkLoadError(error)) window.location.reload();
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#05050a", color: "#fff", fontFamily: "system-ui", padding: 24, textAlign: "center" }}>
          <div>
            <p style={{ fontSize: 18, marginBottom: 12 }}>Tivemos um problema ao carregar a página.</p>
            <button onClick={() => window.location.reload()} style={{ padding: "10px 20px", borderRadius: 8, background: "#1e3a8a", color: "#fff", border: "none", cursor: "pointer" }}>
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const RouteFallback = () => (
  <div style={{ minHeight: "100vh", background: "#05050a" }} />
);
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import FloatingSupport from "./components/FloatingSupport";
import { captureAffiliateFromUrl } from "@/lib/affiliates";
import { useEffect } from "react";

const AffiliateTracker = () => {
  useEffect(() => {
    // Não limpa mais nada aqui, apenas captura se houver na URL
    captureAffiliateFromUrl();
  }, []);
  return null;
};

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
        <AffiliateTracker />
        <AppErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
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
            <Route path="/jv" element={<AffiliateRedirect slug="jv" />} />
            <Route path="/zk" element={<AffiliateRedirect slug="zk" />} />
            <Route path="/kx" element={<AffiliateRedirect slug="kx" />} />
            <Route path="/c" element={<AffiliateRedirect slug="c" />} />
            <Route path="/q" element={<AffiliateRedirect slug="q" />} />
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
        </AppErrorBoundary>
        <FloatingSupport />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
