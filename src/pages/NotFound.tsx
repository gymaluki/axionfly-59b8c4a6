import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05050A] text-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 max-w-md"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full" />
          <div className="relative w-24 h-24 rounded-3xl bg-[#0D0D12] border border-white/10 flex items-center justify-center mx-auto shadow-2xl">
            <ShieldAlert className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-6xl font-black tracking-tighter text-white">404</h1>
          <h2 className="text-xl font-bold text-white/90">Página não encontrada</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Ops! O link que você tentou acessar não existe ou foi movido. 
            Verifique o endereço e tente novamente.
          </p>
        </div>

        <div className="pt-4">
          <Button 
            variant="neon" 
            className="h-12 px-8 font-bold gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Dashboard
          </Button>
        </div>
        
        <div className="pt-8">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
            AxionFly Platform
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
