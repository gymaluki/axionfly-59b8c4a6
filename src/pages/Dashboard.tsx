import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProspeccaoView from "@/components/views/ProspeccaoView";
import EbooksView from "@/components/views/EbooksView";
import SitesView from "@/components/views/SitesView";
import { AnimatePresence, motion } from "framer-motion";

type View = "prospeccao" | "ebooks" | "sites";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<View>("sites");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
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

  return (
    <div className="flex min-h-screen bg-background relative">
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
      />
      <main className="flex-1 p-6 md:p-8 overflow-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === "prospeccao" && <ProspeccaoView />}
            {activeView === "ebooks" && <EbooksView />}
            {activeView === "sites" && <SitesView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
