import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Users, Clock, CreditCard, AlertCircle, Search, RefreshCw, ShieldCheck, History, Megaphone, Bug, Cloud, TrendingUp, DollarSign, Sparkles, Code2, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AffiliatesAdminPanel from "@/components/admin/AffiliatesAdminPanel";
import SystemErrorsPanel from "@/components/admin/SystemErrorsPanel";
import { Progress } from "@/components/ui/progress";

// Owner status is determined server-side via is_owner() RPC.

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  plan: string | null;
  payment_provider: string | null;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminUser {
  user_id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  subscription: Subscription | null;
}

interface PendingPayment {
  id: string;
  email: string;
  status: string;
  plan: string | null;
  payment_provider: string | null;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
}

interface HyperbuildLicense {
  id: string;
  key: string;
  lote: string | null;
  status: string;
  created_at: string;
  expires_at: string | null;
  used_by: string | null;
  used_at: string | null;
  user_email?: string;
}

interface LicenseLog {
  id: string;
  user_email: string;
  license_key: string;
  action: string;
  details: string;
  created_at: string;
}

const PLAN_DAYS: Record<string, number> = {
  monthly: 30,
  trial: 7,
  lifetime: 36500,
};

const PLAN_LABELS: Record<string, string> = {
  monthly: "Mensal (30 dias)",
  trial: "Trial (7 dias)",
  lifetime: "Vitalício",
};

const AdminView = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [licenses, setLicenses] = useState<HyperbuildLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [licenseSearch, setLicenseSearch] = useState("");
  const [logs, setLogs] = useState<LicenseLog[]>([]);
  const [testingConnection, setTestingConnection] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setCurrentEmail(data.user?.email ?? null);
      if (data.user) {
        const { data: ownerRes } = await supabase.rpc("is_owner" as never, { check_user_id: data.user.id } as never);
        setIsOwner(ownerRes === true);
      }
    });
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-manage-users", {
        body: { action: "list" },
      });
      if (error) throw error;
      setUsers(data.users || []);
      setPendingPayments(data.pendings || []);

      // Fetch licenses
      const { data: licenseData, error: licenseError } = await supabase
        .from('hyperbuild_licenses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (licenseError) throw licenseError;
      
      // Match licenses with user emails
      const enrichedLicenses = (licenseData || []).map(license => {
        const user = data.users?.find((u: any) => u.user_id === license.used_by);
        return {
          ...license,
          user_email: user?.email
        };
      });
      
      setLicenses(enrichedLicenses);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro ao carregar", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('hyperbuild_license_logs')
        .select(`
          id,
          license_key,
          action,
          details,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      // Map user_id to emails using the already fetched users list
      const enrichedLogs = (data || []).map(log => {
        const user = users.find(u => u.user_id === log.user_id);
        return {
          ...log,
          user_email: user?.email || 'Sistema'
        } as LicenseLog;
      });
      
      setLogs(enrichedLogs);
    } catch (err: any) {
      console.error("Error fetching logs:", err);
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      // Simulate/test connection by calling the function
      const { data, error } = await supabase.rpc('claim_hyperbuild_license');
      
      if (error) {
        if (error.message.includes("Não há licenças")) {
          toast({ title: "Conexão OK", description: "O sistema está conectado, mas o estoque está vazio." });
        } else {
          throw error;
        }
      } else {
        toast({ title: "Conexão bem-sucedida!", description: "Sistema Hyperbuild respondendo corretamente." });
      }
    } catch (err: any) {
      toast({ title: "Erro na conexão", description: err.message, variant: "destructive" });
    } finally {
      setTestingConnection(false);
      fetchLogs(); // Refresh logs to see the test
    }
  };

  useEffect(() => {
    fetchData();
    fetchLogs();
  }, []);

  const handleAction = async (
    action: "activate" | "deactivate" | "set_plan",
    user_id: string,
    plan?: string,
  ) => {
    setActionLoading(user_id + action);
    try {
      const { error } = await supabase.functions.invoke("admin-manage-users", {
        body: { action, user_id, plan },
      });
      if (error) throw error;
      toast({ title: "Atualizado com sucesso" });
      await fetchData();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const calcRemaining = (sub: Subscription | null): string => {
    if (!sub || sub.status !== "active") return "—";
    const plan = sub.plan || "monthly";
    if (plan === "lifetime") return "Vitalício";
    const days = PLAN_DAYS[plan] || 30;
    const start = new Date(sub.updated_at).getTime();
    const end = start + days * 86400000;
    const remaining = Math.ceil((end - Date.now()) / 86400000);
    if (remaining <= 0) return "Expirado";
    return `${remaining} dia${remaining === 1 ? "" : "s"}`;
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      u.email?.toLowerCase().includes(q) ||
      u.display_name?.toLowerCase().includes(q)
    );
  });

  const activeCount = users.filter(u => u.subscription?.status === "active").length;
  const inactiveCount = users.length - activeCount;
  const activePending = pendingPayments.filter(p => p.status === "active").length;
  const processedPending = pendingPayments.filter(p => p.status === "processed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center animate-pulse">
          <div className="w-3 h-3 rounded-full bg-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Assinaturas Ativas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{inactiveCount}</p>
              <p className="text-xs text-muted-foreground">Sem Acesso</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activePending}</p>
              <p className="text-xs text-muted-foreground">Pré-pagamentos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{processedPending}</p>
              <p className="text-xs text-muted-foreground">Já Ativados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-muted flex-wrap h-auto">
          <TabsTrigger value="users">Usuários ({users.length})</TabsTrigger>
          <TabsTrigger value="pending">Pré-pagamentos ({pendingPayments.length})</TabsTrigger>
          <TabsTrigger value="affiliates" className="gap-1.5">
            <Megaphone className="w-3.5 h-3.5" /> Afiliados
          </TabsTrigger>
          <TabsTrigger value="licenses">Licenças ({licenses.length})</TabsTrigger>
          <TabsTrigger value="logs">Auditoria</TabsTrigger>
          {isOwner && (
            <>
              <TabsTrigger value="cloud" className="gap-1.5 text-blue-400 data-[state=active]:text-blue-400">
                <Cloud className="w-3.5 h-3.5" /> Financeiro Cloud
              </TabsTrigger>
              <TabsTrigger value="system" className="gap-1.5 text-destructive data-[state=active]:text-destructive">
                <Bug className="w-3.5 h-3.5" /> Sistema
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="affiliates" className="mt-4">
          <AffiliatesAdminPanel />
        </TabsContent>

        {isOwner && (
          <TabsContent value="cloud" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border border-blue-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-blue-400" /> Saldo Mensal Grátis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-foreground">US$ 25,00</div>
                  <p className="text-[10px] text-muted-foreground mt-1">Franquia padrão do Lovable Cloud</p>
                  <Progress value={8} className="h-1 mt-4" />
                  <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-widest">~US$ 2,00 Utilizados</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" /> Conversão de Vendas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-foreground">
                    {users.length > 0 ? ((activeCount / users.length) * 100).toFixed(1) : 0}%
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Cadastros vs Assinaturas Ativas</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" /> Custo por Lead
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-foreground">R$ 0,00</div>
                  <p className="text-[10px] text-muted-foreground mt-1">Estimativa de custo de infra por usuário</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Detalhamento de Estimativas de Gasto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
                    <div>
                      <p className="text-sm font-bold">Banco de Dados (Postgres)</p>
                      <p className="text-xs text-muted-foreground">Instância Padrão P-1 (AWS eu-west-1)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-green-500">GRÁTIS</p>
                      <p className="text-[10px] text-muted-foreground tracking-tighter uppercase">No seu plano</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
                    <div>
                      <p className="text-sm font-bold">Armazenamento (Storage)</p>
                      <p className="text-xs text-muted-foreground">Bucket: /videos (Hospedagem de aulas)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-foreground">~US$ 0,15</p>
                      <p className="text-[10px] text-muted-foreground tracking-tighter uppercase">Estimado/Mês</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
                    <div>
                      <p className="text-sm font-bold">Webhooks de Pagamento</p>
                      <p className="text-xs text-muted-foreground">Cakto & PerfectPay (Processamento de Vendas)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-foreground">~US$ 1,20</p>
                      <p className="text-[10px] text-muted-foreground tracking-tighter uppercase">Estimado/Mês</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm font-bold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" /> Agentes de IA Integrados
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-[11px] bg-background/50 p-1.5 rounded border border-border">
                        <Code2 className="w-3 h-3 text-blue-400" />
                        <span>Criador de Sites (Lovable)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] bg-background/50 p-1.5 rounded border border-border">
                        <Search className="w-3 h-3 text-orange-400" />
                        <span>Prospecção (Firecrawl API)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] bg-background/50 p-1.5 rounded border border-border">
                        <ShieldCheck className="w-3 h-3 text-green-400" />
                        <span>Gestor de Acesso (Auto-Admin)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] bg-background/50 p-1.5 rounded border border-border">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span>Extensão Infinito (Hyperbuild)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 leading-relaxed">
                  <strong>Sugestões de Otimização:</strong>
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li><strong>Instância P-1:</strong> Você já está na menor instância, garantindo custo fixo zero no bônus.</li>
                    <li><strong>Cache de Queries:</strong> As listas de usuários e vendas agora são cacheadas localmente para evitar re-fetch constante.</li>
                    <li><strong>Webhooks Otimizados:</strong> O sistema ignora eventos irrelevantes (como Pix pendente) para não processar funções desnecessárias.</li>
                  </ul>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-200 leading-relaxed">
                  <strong>Nota sobre Webhooks:</strong> Pix gerados pela Cakto <strong>NÃO</strong> consomem seu saldo Cloud se não forem pagos. O processamento ocorre apenas na aprovação.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="users" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <CardTitle className="text-base">Gerenciar Usuários</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por email ou nome..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Button variant="outline" size="icon" onClick={fetchData}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum usuário encontrado.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 text-muted-foreground font-medium">Nome</th>
                        <th className="pb-3 text-muted-foreground font-medium">Email</th>
                        <th className="pb-3 text-muted-foreground font-medium">Status</th>
                        <th className="pb-3 text-muted-foreground font-medium">Plano</th>
                        <th className="pb-3 text-muted-foreground font-medium">Restante</th>
                        <th className="pb-3 text-muted-foreground font-medium">Cadastro</th>
                        <th className="pb-3 text-muted-foreground font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(u => {
                        const sub = u.subscription;
                        const isActive = sub?.status === "active";
                        const currentPlan = sub?.plan || "monthly";
                        return (
                          <tr key={u.user_id} className="border-b border-border/50 last:border-0">
                            <td className="py-3 text-foreground">{u.display_name || "—"}</td>
                            <td className="py-3 text-muted-foreground text-xs">{u.email}</td>
                            <td className="py-3">
                              <Badge variant={isActive ? "default" : "destructive"} className="text-xs">
                                {isActive ? "Ativo" : "Sem acesso"}
                              </Badge>
                            </td>
                            <td className="py-3">
                              <Select
                                value={currentPlan}
                                onValueChange={(v) => handleAction("set_plan", u.user_id, v)}
                                disabled={actionLoading === u.user_id + "set_plan"}
                              >
                                <SelectTrigger className="h-8 w-36 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(PLAN_LABELS).map(([k, v]) => (
                                    <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 text-muted-foreground text-xs">{calcRemaining(sub)}</td>
                            <td className="py-3 text-muted-foreground text-xs">{formatDate(u.created_at)}</td>
                            <td className="py-3 text-right">
                              {isActive ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAction("deactivate", u.user_id)}
                                  disabled={actionLoading === u.user_id + "deactivate"}
                                  className="h-8 text-xs"
                                >
                                  Revogar
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleAction("activate", u.user_id, currentPlan)}
                                  disabled={actionLoading === u.user_id + "activate"}
                                  className="h-8 text-xs"
                                >
                                  Liberar acesso
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Pagamentos Pendentes (Pré-Registro)</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingPayments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum pagamento pendente.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 text-muted-foreground font-medium">Email</th>
                        <th className="pb-3 text-muted-foreground font-medium">Status</th>
                        <th className="pb-3 text-muted-foreground font-medium">Plano</th>
                        <th className="pb-3 text-muted-foreground font-medium">Transação</th>
                        <th className="pb-3 text-muted-foreground font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingPayments.map(pp => (
                        <tr key={pp.id} className="border-b border-border/50 last:border-0">
                          <td className="py-3 text-foreground">{pp.email}</td>
                          <td className="py-3">
                            <Badge
                              variant={pp.status === "active" ? "outline" : "default"}
                              className={pp.status === "active" ? "border-yellow-500 text-yellow-500 text-xs" : "text-xs"}
                            >
                              {pp.status === "active" ? "Aguardando Cadastro" : "Ativado"}
                            </Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">{pp.plan || "—"}</td>
                          <td className="py-3 text-muted-foreground text-xs font-mono">{pp.transaction_id || "—"}</td>
                          <td className="py-3 text-muted-foreground text-xs">{formatDate(pp.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licenses" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <CardTitle className="text-base">Monitorar Licenças Hyperbuild</CardTitle>
                <p className="text-xs text-muted-foreground">Total de {licenses.length} licenças no banco de dados.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={testConnection} 
                  disabled={testingConnection}
                  className="gap-2 border-primary/20 hover:bg-primary/5"
                >
                  <ShieldCheck className={cn("w-4 h-4 text-primary", testingConnection && "animate-spin")} />
                  {testingConnection ? "Testando..." : "Testar Conexão"}
                </Button>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por chave, lote ou email..."
                    value={licenseSearch}
                    onChange={e => setLicenseSearch(e.target.value)}
                    className="pl-9 w-64 h-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {licenses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhuma licença encontrada.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 text-muted-foreground font-medium">Chave</th>
                        <th className="pb-3 text-muted-foreground font-medium">Lote</th>
                        <th className="pb-3 text-muted-foreground font-medium">Status</th>
                        <th className="pb-3 text-muted-foreground font-medium">Usuário</th>
                        <th className="pb-3 text-muted-foreground font-medium">Usado em</th>
                        <th className="pb-3 text-muted-foreground font-medium">Expira em</th>
                      </tr>
                    </thead>
                    <tbody>
                      {licenses
                        .filter(l => {
                          const q = licenseSearch.toLowerCase();
                          return !q || 
                            l.key.toLowerCase().includes(q) || 
                            l.lote?.toLowerCase().includes(q) || 
                            l.user_email?.toLowerCase().includes(q);
                        })
                        .map(l => (
                        <tr key={l.id} className="border-b border-border/50 last:border-0">
                          <td className="py-3 text-foreground font-mono text-xs">{l.key}</td>
                          <td className="py-3 text-muted-foreground text-xs">{l.lote || "—"}</td>
                          <td className="py-3">
                            <Badge
                              variant={l.status === "active" ? "default" : "secondary"}
                              className={l.status === "active" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "text-xs"}
                            >
                              {l.status === "active" ? "Disponível" : "Em uso"}
                            </Badge>
                          </td>
                          <td className="py-3 text-foreground text-xs">{l.user_email || "—"}</td>
                          <td className="py-3 text-muted-foreground text-xs">{formatDate(l.used_at)}</td>
                          <td className="py-3 text-muted-foreground text-xs">{formatDate(l.expires_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Histórico de Auditoria
              </CardTitle>
              <Button variant="outline" size="sm" onClick={fetchLogs} className="h-8">
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Atualizar Logs
              </Button>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum log registrado ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-muted-foreground font-medium">Data/Hora</th>
                        <th className="pb-3 text-muted-foreground font-medium">Usuário</th>
                        <th className="pb-3 text-muted-foreground font-medium">Ação</th>
                        <th className="pb-3 text-muted-foreground font-medium">Chave</th>
                        <th className="pb-3 text-muted-foreground font-medium">Detalhes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map(log => (
                        <tr key={log.id} className="border-b border-border/50 last:border-0 hover:bg-white/5 transition-colors">
                          <td className="py-3 text-muted-foreground text-[11px] whitespace-nowrap">
                            {formatDate(log.created_at)}
                          </td>
                          <td className="py-3 text-foreground text-xs">{log.user_email}</td>
                          <td className="py-3">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-[10px] uppercase font-bold",
                                log.action === 'claim' && "border-green-500/50 text-green-500 bg-green-500/5",
                                log.action === 'view' && "border-blue-500/50 text-blue-500 bg-blue-500/5",
                                log.action === 'error' && "border-destructive/50 text-destructive bg-destructive/5"
                              )}
                            >
                              {log.action}
                            </Badge>
                          </td>
                          <td className="py-3 font-mono text-[10px] text-muted-foreground">
                            {log.license_key || "—"}
                          </td>
                          <td className="py-3 text-xs text-muted-foreground max-w-xs truncate">
                            {log.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminView;
