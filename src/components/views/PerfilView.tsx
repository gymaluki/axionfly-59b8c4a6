import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, User, Lock, History, Users2, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SearchHistoryItem {
  id: string;
  query: string;
  nicho: string | null;
  location: string | null;
  results_count: number;
  created_at: string;
}

interface ContactedLeadItem {
  id: string;
  lead_name: string;
  phone: string | null;
  website: string | null;
  source_url: string | null;
  status: string;
  created_at: string;
}

const PerfilView = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [leads, setLeads] = useState<ContactedLeadItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setDisplayName(data?.display_name ?? "");
      });

    const loadAll = async () => {
      setLoadingData(true);
      const [h, l] = await Promise.all([
        supabase
          .from("search_history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("contacted_leads")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(100),
      ]);
      if (h.data) setHistory(h.data as SearchHistoryItem[]);
      if (l.data) setLeads(l.data as ContactedLeadItem[]);
      setLoadingData(false);
    };
    loadAll();
  }, [user]);

  const handleSaveName = async () => {
    if (!user) return;
    setSavingName(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() || null })
      .eq("user_id", user.id);
    setSavingName(false);
    if (error) {
      toast.error("Erro ao salvar nome");
      return;
    }
    toast.success("Nome atualizado!");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    if (newPassword.length < 6) {
      toast.error("A nova senha precisa ter pelo menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas novas não coincidem");
      return;
    }

    setChangingPassword(true);

    // Verifica senha atual reautenticando
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      toast.error("Senha atual incorreta");
      setChangingPassword(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setChangingPassword(false);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

    toast.success("Senha alterada com sucesso!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const deleteHistory = async (id: string) => {
    const { error } = await supabase.from("search_history").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover");
      return;
    }
    setHistory((h) => h.filter((x) => x.id !== id));
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from("contacted_leads").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover");
      return;
    }
    setLeads((l) => l.filter((x) => x.id !== id));
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">Meu Perfil</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie seus dados, senha e veja seu histórico
        </p>
      </div>

      <Tabs defaultValue="dados" className="w-full">
        <TabsList>
          <TabsTrigger value="dados" className="gap-2">
            <User className="w-4 h-4" /> Dados
          </TabsTrigger>
          <TabsTrigger value="senha" className="gap-2">
            <Lock className="w-4 h-4" /> Senha
          </TabsTrigger>
          <TabsTrigger value="historico" className="gap-2">
            <History className="w-4 h-4" /> Buscas
          </TabsTrigger>
          <TabsTrigger value="leads" className="gap-2">
            <Users2 className="w-4 h-4" /> Leads contatados
          </TabsTrigger>
        </TabsList>

        {/* DADOS */}
        <TabsContent value="dados">
          <div className="glass rounded-xl p-6 space-y-4 max-w-xl">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email ?? ""} disabled className="bg-secondary/50" />
            </div>
            <div className="space-y-2">
              <Label>Nome de exibição</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Seu nome"
                className="bg-secondary/50"
              />
            </div>
            <Button onClick={handleSaveName} variant="neon" disabled={savingName}>
              {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Salvar
            </Button>
          </div>
        </TabsContent>

        {/* SENHA */}
        <TabsContent value="senha">
          <form
            onSubmit={handleChangePassword}
            className="glass rounded-xl p-6 space-y-4 max-w-xl"
          >
            <div className="space-y-2">
              <Label>Senha atual</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Nova senha</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmar nova senha</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="bg-secondary/50"
              />
            </div>
            <Button type="submit" variant="neon" disabled={changingPassword}>
              {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Alterar senha
            </Button>
            <p className="text-xs text-muted-foreground">
              Se você se cadastrou com Google, não é possível alterar a senha por aqui.
            </p>
          </form>
        </TabsContent>

        {/* HISTÓRICO */}
        <TabsContent value="historico">
          <div className="glass rounded-xl overflow-hidden">
            {loadingData ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : history.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                Você ainda não fez nenhuma busca.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Nicho</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Local</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Resultados</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Data</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{h.nicho || "—"}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{h.location || "—"}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{h.results_count}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(h.created_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => deleteHistory(h.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>

        {/* LEADS */}
        <TabsContent value="leads">
          <div className="glass rounded-xl overflow-hidden">
            {loadingData ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : leads.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                Nenhum lead contatado ainda. Marque leads como contatados na Busca de Leads.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Negócio</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Telefone</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Data</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {l.lead_name}
                          {l.source_url && (
                            <a href={l.source_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 text-muted-foreground" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{l.phone || "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{l.status}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(l.created_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => deleteLead(l.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default PerfilView;
