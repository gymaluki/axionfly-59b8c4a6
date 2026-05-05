import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, User, Lock, History, Users2, Trash2, ExternalLink, Check, Calendar, CreditCard, Rocket, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  const [caktoClientId, setCaktoClientId] = useState("");
  const [caktoClientSecret, setCaktoClientSecret] = useState("");
  const [caktoProductImageUrl, setCaktoProductImageUrl] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savingCakto, setSavingCakto] = useState(false);

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
      .select("display_name, cakto_client_id, cakto_client_secret, cakto_product_image_url")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setDisplayName(data?.display_name ?? "");
        setCaktoClientId(data?.cakto_client_id ?? "");
        setCaktoClientSecret(data?.cakto_client_secret ?? "");
        setCaktoProductImageUrl(data?.cakto_product_image_url ?? "");
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

  const handleSaveCakto = async () => {
    if (!user) return;
    setSavingCakto(true);
    const { error } = await supabase
      .from("profiles")
      .update({ 
        cakto_client_id: caktoClientId.trim() || null,
        cakto_client_secret: caktoClientSecret.trim() || null
      })
      .eq("user_id", user.id);
    setSavingCakto(false);
    if (error) {
      toast.error("Erro ao salvar credenciais Cakto");
      return;
    }
    toast.success("Credenciais Cakto atualizadas!");
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
      className="space-y-10"
    >
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-[#0d0d14]/40 backdrop-blur-md border border-white/5 p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="relative group">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-3xl md:text-5xl font-black text-white shadow-[0_0_40px_rgba(37,99,235,0.3)] ring-4 ring-[#0d0d14]">
            {displayName ? displayName.slice(0, 2).toUpperCase() : user?.email?.slice(0, 2).toUpperCase()}
          </div>
          <div className="absolute bottom-1 right-1 w-6 h-6 md:w-8 md:h-8 bg-green-500 border-4 border-[#0d0d14] rounded-full animate-pulse shadow-lg" />
        </div>
        <div className="text-center md:text-left space-y-3">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">{displayName || "Usuário"}</h2>
            <p className="text-[#94a3b8] font-medium text-base">{user?.email}</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
              <Check className="w-3.5 h-3.5" /> Membro Ativo
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#475569] text-xs font-black uppercase tracking-widest">
              Plano Vitalício
            </span>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="bg-[#0d0d14] border border-white/5 p-1 rounded-2xl h-14 w-full justify-start gap-2 mb-6">
              <TabsTrigger value="dados" className="flex-1 md:flex-none h-full rounded-xl gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                <User className="w-4 h-4" /> Dados
              </TabsTrigger>
              <TabsTrigger value="senha" className="flex-1 md:flex-none h-full rounded-xl gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                <Lock className="w-4 h-4" /> Senha
              </TabsTrigger>
              <TabsTrigger value="historico" className="flex-1 md:flex-none h-full rounded-xl gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                <History className="w-4 h-4" /> Buscas
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex-1 md:flex-none h-full rounded-xl gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                <Users2 className="w-4 h-4" /> Leads
              </TabsTrigger>
              <TabsTrigger value="integracoes" className="flex-1 md:flex-none h-full rounded-xl gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                <ExternalLink className="w-4 h-4" /> Integrações
              </TabsTrigger>
            </TabsList>
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
        {/* INTEGRAÇÕES */}
        <TabsContent value="integracoes">
          <div className="glass rounded-xl p-6 space-y-6 max-w-xl">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Cakto API</h3>
              <p className="text-sm text-muted-foreground">
                Insira suas credenciais da Cakto para que possamos automatizar a criação de seus produtos.
                Você encontra essas chaves no menu de API dentro do seu painel Cakto.
              </p>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Client ID</Label>
                <Input
                  value={caktoClientId}
                  onChange={(e) => setCaktoClientId(e.target.value)}
                  placeholder="Seu Client ID"
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Client Secret</Label>
                <Input
                  type="password"
                  value={caktoClientSecret}
                  onChange={(e) => setCaktoClientSecret(e.target.value)}
                  placeholder="Seu Client Secret"
                  className="bg-secondary/50"
                />
              </div>
              <Button onClick={handleSaveCakto} variant="neon" disabled={savingCakto} className="w-full sm:w-auto">
                {savingCakto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Salvar Credenciais
              </Button>
            </div>
            
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-xs text-blue-400 leading-relaxed">
                As chaves são usadas apenas para autenticar chamadas à API da Cakto em seu nome.
              </p>
            </div>
          </div>
        </TabsContent>
          </Tabs>
        </div>

        {/* Account Summary Sidebar */}
        <div className="space-y-6">
          <Card className="bg-[#0d0d14]/40 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary" /> Resumo da Conta
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#475569]" />
                    <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">Cadastro</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">Maio 2026</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">Status</span>
                  </div>
                  <span className="text-sm font-bold text-green-500">Ativo</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <History className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">Buscas</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{history.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">Leads</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{leads.length}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] text-[#475569] font-black uppercase tracking-widest text-center">AxionFly Premium v1.4</p>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default PerfilView;
