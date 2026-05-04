import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Users, Clock, CreditCard, AlertCircle, Search, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-manage-users", {
        body: { action: "list" },
      });
      if (error) throw error;
      setUsers(data.users || []);
      setPendingPayments(data.pendings || []);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro ao carregar", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        <TabsList className="bg-muted">
          <TabsTrigger value="users">Usuários ({users.length})</TabsTrigger>
          <TabsTrigger value="pending">Pré-pagamentos ({pendingPayments.length})</TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
};

export default AdminView;
