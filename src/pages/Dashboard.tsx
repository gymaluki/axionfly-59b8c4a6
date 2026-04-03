import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProspeccaoView from "@/components/views/ProspeccaoView";
import EbooksView from "@/components/views/EbooksView";
import SitesView from "@/components/views/SitesView";

type View = "prospeccao" | "ebooks" | "sites";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<View>("prospeccao");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        active={activeView}
        onNavigate={setActiveView}
        onSignOut={async () => {
          await signOut();
          navigate("/");
        }}
        userEmail={user.email}
      />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {activeView === "prospeccao" && <ProspeccaoView />}
        {activeView === "ebooks" && <EbooksView />}
        {activeView === "sites" && <SitesView />}
      </main>
    </div>
  );
};

export default Dashboard;
