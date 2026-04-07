import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, CreditCard, AlertCircle } from "lucide-react";

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

interface Profile {
  user_id: string;
  display_name: string | null;
}

const AdminView = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [subsRes, pendingRes, profilesRes] = await Promise.all([
        supabase.from("subscriptions").select("*").order("updated_at", { ascending: false }),
        supabase.from("pending_payments").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("user_id, display_name"),
      ]);

      if (subsRes.data) setSubscriptions(subsRes.data);
      if (pendingRes.data) setPendingPayments(pendingRes.data as PendingPayment[]);
      if (profilesRes.data) {
        const map: Record<string, string> = {};
        profilesRes.data.forEach((p: Profile) => {
          if (p.display_name) map[p.user_id] = p.display_name;
        });
        setProfiles(map);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const activeSubs = subscriptions.filter(s => s.status === "active");
  const inactiveSubs = subscriptions.filter(s => s.status !== "active");
  const activePending = pendingPayments.filter(p => p.status === "active");
  const processedPending = pendingPayments.filter(p => p.status === "processed");

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

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
              <p className="text-2xl font-bold text-foreground">{activeSubs.length}</p>
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
              <p className="text-2xl font-bold text-foreground">{inactiveSubs.length}</p>
              <p className="text-xs text-muted-foreground">Inativas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activePending.length}</p>
              <p className="text-xs text-muted-foreground">Pagamentos Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{processedPending.length}</p>
              <p className="text-xs text-muted-foreground">Já Ativados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger value="subscriptions">Assinaturas ({subscriptions.length})</TabsTrigger>
          <TabsTrigger value="pending">Pagamentos Pendentes ({pendingPayments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Todas as Assinaturas</CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhuma assinatura encontrada.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 text-muted-foreground font-medium">Usuário</th>
                        <th className="pb-3 text-muted-foreground font-medium">Status</th>
                        <th className="pb-3 text-muted-foreground font-medium">Plano</th>
                        <th className="pb-3 text-muted-foreground font-medium">Provedor</th>
                        <th className="pb-3 text-muted-foreground font-medium">Atualizado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map(sub => (
                        <tr key={sub.id} className="border-b border-border/50 last:border-0">
                          <td className="py-3 text-foreground">
                            {profiles[sub.user_id] || sub.user_id.slice(0, 8) + "..."}
                          </td>
                          <td className="py-3">
                            <Badge variant={sub.status === "active" ? "default" : "destructive"} className="text-xs">
                              {sub.status === "active" ? "Ativo" : "Inativo"}
                            </Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">{sub.plan || "—"}</td>
                          <td className="py-3 text-muted-foreground">{sub.payment_provider || "—"}</td>
                          <td className="py-3 text-muted-foreground text-xs">{formatDate(sub.updated_at)}</td>
                        </tr>
                      ))}
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
