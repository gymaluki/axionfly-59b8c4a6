import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { getSelectedPlan, getActiveAffiliate, resolveCheckoutUrl, clearAffiliateData } from "@/lib/affiliates";

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(!new URLSearchParams(location.search).get("isSignup"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const paymentRedirect = useMemo(() => {
    const val = new URLSearchParams(location.search).get("redirect_payment");
    if (!val) return null;
    
    // Se for um link da Cakto, retornamos ele exatamente como está
    if (val.includes("pay.cakto.com.br")) return val;
    
    // Same-origin paths
    if (val.startsWith("/") && !val.startsWith("//")) return val;
    
    try {
      const u = new URL(val, window.location.origin);
      if (u.origin === window.location.origin) return u.pathname + u.search + u.hash;
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

  const handleFinalRedirect = async (session: any) => {
    const selectedPlan = getSelectedPlan();
    const activeAffiliate = getActiveAffiliate();

    // Se já tem assinatura ativa, vai direto pro dashboard (NUNCA pro checkout)
    let hasActiveAccess = false;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("status, expires_at")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();
        if (sub && (!sub.expires_at || new Date(sub.expires_at) > new Date())) {
          hasActiveAccess = true;
        }
      }
    } catch (e) {
      console.error("Erro ao verificar assinatura:", e);
    }

    if (hasActiveAccess) {
      clearAffiliateData();
      navigate(redirectTo, { replace: true });
      return;
    }

    // Só redireciona para checkout em fluxo de cadastro novo (não login)
    if (selectedPlan && !isLogin) {
      const checkoutUrl = resolveCheckoutUrl(selectedPlan, activeAffiliate?.slug);
      toast.success("Conta pronta! Redirecionando para o pagamento...");
      setTimeout(() => clearAffiliateData(), 1000);
      window.location.href = checkoutUrl;
      return;
    }

    // Fallback para o redirecionamento via query param
    if (paymentRedirect) {
      toast.success("Redirecionando para o pagamento...");
      window.location.href = paymentRedirect;
    } else {
      navigate(redirectTo, { replace: true });
    }
  };

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
      if (!session) return;
      
      // Se estivermos em um fluxo de reset de senha, não redirecionamos automaticamente ainda
      const isResetPassword = new URLSearchParams(location.search).get("reset_password");
      if (isResetPassword) return;

      await claimPendingAccess();
      handleFinalRedirect(session);
    };

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await handleRedirect(session);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await handleRedirect(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectTo, paymentRedirect, location.search]);

  // Handle password reset logic
  useEffect(() => {
    const isResetPassword = new URLSearchParams(location.search).get("reset_password");
    if (isResetPassword) {
      setIsLogin(false); // Mostra o formulário de "cadastro" que servirá para nova senha
      toast.info("Defina sua nova senha abaixo.");
    }
  }, [location.search]);

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
      
      handleFinalRedirect({ user: true });
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

    toast.success("Conta criada com sucesso! Redirecionando...");
    // Auto-login after signup
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    
    if (signInErr) {
      console.error("Auto-login error:", signInErr);
      // If auto-login fails, try one more time or redirect to login
      setIsLogin(true);
      setLoading(false);
      return;
    }

    // Explicitly handle redirection after a successful sign-in
    handleFinalRedirect({ user: true });
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="glass rounded-2xl p-8 space-y-6 neon-border">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? "Entrar" : "Criar conta"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin ? "Bem-vindo de volta à AxionFly" : "Comece a criar sites com IA agora"}
            </p>
          </div>

          {/* Google Login */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full gap-3 bg-secondary/50 border-border hover:bg-secondary hover:border-primary/30 transition-all"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continuar com Google
            </Button>
          </motion.div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">ou continue com email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email) {
                        toast.error("Digite seu email primeiro para recuperar a senha.");
                        return;
                      }
                      const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: `${window.location.origin}/auth?reset_password=true`,
                      });
                      if (error) toast.error(error.message);
                      else toast.success("Email de recuperação enviado!");
                    }}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-secondary/50 border-border"
              />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" variant="neon" size="lg" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Mail className="w-4 h-4" />}
                {isLogin ? "Entrar" : "Criar conta"}
              </Button>
            </motion.div>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? "Cadastre-se" : "Entrar"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
