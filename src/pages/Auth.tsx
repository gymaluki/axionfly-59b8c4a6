import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Mail, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const paymentRedirect = useMemo(() => {
    const val = new URLSearchParams(location.search).get("redirect_payment");
    if (!val) return null;
    // Same-origin paths
    if (val.startsWith("/") && !val.startsWith("//")) return val;
    try {
      const u = new URL(val, window.location.origin);
      if (u.origin === window.location.origin) return u.pathname + u.search + u.hash;
      // Allow Cakto checkout URLs (afiliado-aware)
      if (u.hostname === "pay.cakto.com.br") return u.toString();
    } catch { /* ignore */ }
    return null;
  }, [location.search]);

  const redirectTo = useMemo(() => {
    const redirect = new URLSearchParams(location.search).get("redirect");

    if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//") || redirect.startsWith("/auth")) {
      return "/dashboard";
    }

    return redirect;
  }, [location.search]);

  const claimPendingAccess = async () => {
    try {
      const { error } = await supabase.rpc("claim_pending_access" as never);

      if (error) {
        console.error("Erro ao ativar acesso pendente:", error);
      }
    } catch (error) {
      console.error("Erro inesperado ao ativar acesso pendente:", error);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    const handleRedirect = async (session: any) => {
      if (session) {
        await claimPendingAccess();

        if (paymentRedirect) {
          // User logged in and has a payment to complete
          toast.success("Conta pronta! Redirecionando para o pagamento...");
          setTimeout(() => {
            window.location.href = paymentRedirect;
          }, 1500);
        } else {
          navigate(redirectTo, { replace: true });
        }
      }
    };

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleRedirect(session);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void handleRedirect(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectTo, paymentRedirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Login realizado com sucesso!");
      return;
    }

    // Tenta cadastro via edge function (suporta senha mestra com 1 mês grátis)
    const { data: fnData, error: fnError } = await supabase.functions.invoke(
      "signup-with-master-password",
      { body: { email, password } },
    );

    if (fnError || (fnData && fnData.error)) {
      toast.error(fnData?.error ?? fnError?.message ?? "Erro ao criar conta.");
      setLoading(false);
      return;
    }

    if (fnData?.masterAccess) {
      // Já está confirmado — faz login direto
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr) {
        toast.error(signInErr.message);
        setLoading(false);
        return;
      }
      toast.success("Conta criada com 1 mês de acesso liberado!");
      return;
    }

    toast.success("Conta criada! Confirme seu email para entrar.");
    setIsLogin(true);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth${window.location.search}`,
      });

      if (result.error) {
        toast.error("Erro ao fazer login com Google");
        setGoogleLoading(false);
        return;
      }

      if (result.redirected) {
        return;
      }

      toast.success("Login realizado com sucesso!");
      navigate(redirectTo, { replace: true });
    } catch {
      toast.error("Erro ao fazer login com Google");
    }
    setGoogleLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1B3A5C] flex items-center justify-center text-white mx-auto shadow-xl">
            <PlayCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Projeto Live</h1>
            <p className="text-muted-foreground text-sm">Acesse sua plataforma de estudos</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#F0F0F0] shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#FAFAFA] border-[#E5E5E5] h-12 rounded-xl focus:ring-[#1B3A5C]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Senha</Label>
                <button type="button" className="text-[10px] font-bold text-[#1B3A5C] hover:underline">Esqueci minha senha</button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#FAFAFA] border-[#E5E5E5] h-12 rounded-xl focus:ring-[#1B3A5C]"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#1B3A5C] hover:bg-[#1B3A5C]/90 text-white h-12 rounded-xl font-bold transition-all" 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Entrar na plataforma"}
            </Button>
          </form>

          {/* Google Login Placeholder (Keeping logic, updating UI) */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#F0F0F0]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-white px-3 text-muted-foreground">ou</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-xl border-[#E5E5E5] hover:bg-[#FAFAFA] transition-all font-bold text-[#1A1A1A]"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
            ) : (
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Entrar com Google
          </Button>
        </div>
        
        <p className="text-center text-[10px] text-muted-foreground font-medium max-w-[200px] mx-auto uppercase tracking-widest leading-relaxed">
          Acesso exclusivo para alunos matriculados
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
