import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAccessControl } from "@/hooks/useAccessControl";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProspeccaoView from "@/components/views/ProspeccaoView";
import SitesView from "@/components/views/SitesView";
import VendasView from "@/components/views/VendasView";
import MembrosView from "@/components/views/MembrosView";
import AdminView from "@/components/views/AdminView";
import ContratoScriptView from "@/components/views/ContratoScriptView";
import PerfilView from "@/components/views/PerfilView";
import ExtensaoLovableView from "@/components/views/ExtensaoLovableView";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import OnboardingTour from "@/components/OnboardingTour";

type View = "prospeccao" | "sites" | "vendas" | "membros" | "admin" | "contrato" | "perfil" | "extensao-lovable";

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
  membros: "Área de Membros",
  vendas: "Minhas Vendas",
  contrato: "Contrato & Script",
  perfil: "Meu Perfil",
  "extensao-lovable": "Extensão Lovable",
  admin: "Painel Administrativo",
};

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const { hasAccess, isAdmin, loading: accessLoading } = useAccessControl(user);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const validViews: View[] = ["prospeccao", "sites", "vendas", "membros", "contrato", "perfil", "extensao-lovable", "admin"];
  const paramView = searchParams.get("view") as View | null;
  const [activeView, setActiveView] = useState<View>(
    paramView && validViews.includes(paramView) ? paramView : "sites"
  );
  const [userName, setUserName] = useState<string>("");

  const handleNavigate = useCallback((view: View) => {
    setActiveView(view);
    setSearchParams({ view });
  }, [setSearchParams]);

  useEffect(() => {
    if (!loading && !user) {
      navigate(`/auth?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`, { replace: true });
    }
  }, [user, loading, navigate, location.pathname, location.search]);

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
      <div className="flex min-h-screen w-full bg-[#0a0a0f] relative text-white">
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
          onNavigate={handleNavigate}
          onSignOut={async () => {
            await signOut();
            navigate("/");
          }}
          userEmail={user.email}
          userName={userName}
          isAdmin={isAdmin}
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
                  {activeView === "membros" && <MembrosView isAdmin={isAdmin} />}
                  {activeView === "contrato" && <ContratoScriptView />}
                  {activeView === "perfil" && <PerfilView />}
                  {activeView === "extensao-lovable" && <ExtensaoLovableView />}
                  {activeView === "admin" && isAdmin && <AdminView />}
                </motion.div>
              </AnimatePresence>
            </DashboardViewErrorBoundary>
          </main>
        </div>
      </div>

      <OnboardingTour userId={user.id} />
    </SidebarProvider>
  );
};

export default Dashboard;
