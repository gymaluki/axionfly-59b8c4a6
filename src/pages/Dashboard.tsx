import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAccessControl } from "@/hooks/useAccessControl";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProspeccaoView from "@/components/views/ProspeccaoView";
import SitesView from "@/components/views/SitesView";
import VendasView from "@/components/views/VendasView";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";

type View = "prospeccao" | "sites" | "vendas";

class DashboardViewErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Dashboard view render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center space-y-3 max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
              <ShieldX className="w-7 h-7 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Não foi possível carregar esta área</h2>
            <p className="text-sm text-muted-foreground">Atualize a página e tente novamente.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const viewTitles: Record<View, string> = {
  sites: "Criador de Sites",
  prospeccao: "Busca de Leads",
  vendas: "Minhas Vendas",
};

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const { hasAccess, loading: accessLoading } = useAccessControl(user);
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<View>("sites");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch profile display name
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.display_name) setUserName(data.display_name);
      });
  }, [user]);

  if (loading || accessLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"
        >
          <div className="w-5 h-5 rounded-full bg-primary" />
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Acesso Restrito</h1>
          <p className="text-muted-foreground">
            Você precisa adquirir um plano para acessar a plataforma. Após o pagamento, seu acesso será liberado automaticamente.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={async () => { await signOut(); navigate("/"); }}>
              Voltar
            </Button>
            <Button variant="neon" onClick={() => navigate("/#pricing")}>
              Ver Planos
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background relative">
        {/* Grid Background */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <DashboardSidebar
          active={activeView}
          onNavigate={setActiveView}
          onSignOut={async () => {
            await signOut();
            navigate("/");
          }}
          userEmail={user.email}
          userName={userName}
        />

        <div className="flex-1 flex flex-col relative z-10">
          <header className="h-14 flex items-center gap-4 border-b border-border px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold text-foreground">{viewTitles[activeView]}</h1>
          </header>

          <main className="flex-1 p-6 md:p-8 overflow-auto">
            <DashboardViewErrorBoundary>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeView === "prospeccao" && <ProspeccaoView />}
                  {activeView === "sites" && <SitesView />}
                  {activeView === "vendas" && <VendasView />}
                </motion.div>
              </AnimatePresence>
            </DashboardViewErrorBoundary>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
