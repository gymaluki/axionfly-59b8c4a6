import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Users, BarChart3, CheckCircle2, Search, RefreshCw, Save, Copy, Link as LinkIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Sale {
  id: string;
  email: string;
  amount: number;
  status: string;
  payment_method: string | null;
  plan: string | null;
  affiliate_slug: string | null;
  created_at: string;
}

interface Affiliate {
  slug: string;
  name: string;
  email: string | null;
  monthly_url: string | null;
  quarterly_url: string | null;
  lifetime_url: string | null;
}

export default function AffiliatesAdminPanel() {
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [search, setSearch] = useState("");
  const [edits, setEdits] = useState<Record<string, Partial<Affiliate>>>({});
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://www.axionfly.site";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesRes, affRes] = await Promise.all([
        supabase.from("platform_sales").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("affiliates").select("slug, name, email, monthly_url, quarterly_url, lifetime_url").order("slug"),
      ]);
      if (salesRes.error) throw salesRes.error;
      if (affRes.error) throw affRes.error;
      setSales((salesRes.data || []) as Sale[]);
      setAffiliates((affRes.data || []) as Affiliate[]);
      setEdits({});
    } catch (err: any) {
      toast({ title: "Erro ao carregar", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredSales = sales.filter((s) =>
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    (s.affiliate_slug || "").toLowerCase().includes(search.toLowerCase()),
  );

  const totalRevenue = sales
    .filter((s) => s.status === "paid" || s.status === "active")
    .reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const paidCount = sales.filter((s) => s.status === "paid" || s.status === "active").length;
  const pixCount = sales.filter((s) => s.payment_method === "pix").length;

  const statusBadge = (status: string) => {
    if (status === "paid" || status === "active")
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Pago</Badge>;
    if (status === "pending")
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pendente</Badge>;
    if (status === "canceled")
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Cancelado</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  const updateField = (slug: string, field: keyof Affiliate, value: string) => {
    setEdits((p) => ({ ...p, [slug]: { ...p[slug], [field]: value } }));
  };

  const getValue = (aff: Affiliate, field: keyof Affiliate) => {
    const e = edits[aff.slug];
    if (e && field in e) return (e as any)[field] ?? "";
    return (aff as any)[field] ?? "";
  };

  const isDirty = (slug: string) => !!edits[slug] && Object.keys(edits[slug]).length > 0;

  const saveAffiliate = async (aff: Affiliate) => {
    setSavingSlug(aff.slug);
    try {
      const patch = edits[aff.slug] || {};
      const { error } = await supabase
        .from("affiliates")
        .update({
          name: patch.name ?? aff.name,
          email: patch.email ?? aff.email,
          monthly_url: patch.monthly_url ?? aff.monthly_url,
          quarterly_url: patch.quarterly_url ?? aff.quarterly_url,
          lifetime_url: patch.lifetime_url ?? aff.lifetime_url,
          updated_at: new Date().toISOString(),
        })
        .eq("slug", aff.slug);
      if (error) throw error;
      toast({ title: "Salvo", description: `Afiliado /${aff.slug} atualizado.` });
      await fetchData();
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSavingSlug(null);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: text });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-xl font-bold">R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">Receita total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
            <div>
              <p className="text-xl font-bold">{paidCount}</p>
              <p className="text-xs text-muted-foreground">Vendas pagas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-blue-500" /></div>
            <div>
              <p className="text-xl font-bold">{pixCount}</p>
              <p className="text-xs text-muted-foreground">PIX gerados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><Users className="w-5 h-5 text-purple-500" /></div>
            <div>
              <p className="text-xl font-bold">{affiliates.length}</p>
              <p className="text-xs text-muted-foreground">Afiliados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Editor de afiliados */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Gerenciar afiliados</CardTitle>
            <CardDescription className="text-xs">Edite os links da Cakto manualmente. O link curto é o que você compartilha.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className="w-3.5 h-3.5 mr-1" />Recarregar</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {affiliates.map((aff) => {
            const shortLink = `${baseUrl}/${aff.slug}`;
            return (
              <div key={aff.slug} className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Badge className="text-sm font-mono px-3 py-1">/{aff.slug}</Badge>
                    <Input
                      className="h-8 w-48 text-sm font-bold"
                      value={getValue(aff, "name")}
                      onChange={(e) => updateField(aff.slug, "name", e.target.value)}
                    />
                    <Input
                      className="h-8 w-64 text-xs"
                      placeholder="email@exemplo.com"
                      value={getValue(aff, "email")}
                      onChange={(e) => updateField(aff.slug, "email", e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copy(shortLink)}
                      className="flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
                    >
                      <LinkIcon className="w-3 h-3" />
                      {shortLink}
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  {([
                    ["monthly_url", "Mensal"],
                    ["quarterly_url", "Trimestral"],
                    ["lifetime_url", "Vitalício"],
                  ] as const).map(([field, label]) => (
                    <div key={field} className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{label} (Cakto)</Label>
                      <Input
                        className="h-9 text-xs font-mono"
                        placeholder="https://pay.cakto.com.br/...?affiliate=..."
                        value={getValue(aff, field)}
                        onChange={(e) => updateField(aff.slug, field, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => saveAffiliate(aff)}
                    disabled={!isDirty(aff.slug) || savingSlug === aff.slug}
                  >
                    <Save className="w-3.5 h-3.5 mr-1" />
                    {savingSlug === aff.slug ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="text-base">Vendas recentes</CardTitle>
              <CardDescription className="text-xs">Atualizado via webhook da Cakto.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por email ou afiliado..." className="pl-9 w-56 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={fetchData}><RefreshCw className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] uppercase tracking-wider">Data</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Cliente</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Plano</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Valor</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wider">Afiliado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Carregando...</TableCell></TableRow>
                ) : filteredSales.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Nenhuma venda encontrada.</TableCell></TableRow>
                ) : (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="text-xs opacity-70">{new Date(sale.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</TableCell>
                      <TableCell className="text-xs font-bold">{sale.email}</TableCell>
                      <TableCell className="text-xs"><Badge variant="outline" className="text-[10px] uppercase">{sale.plan === "lifetime" ? "Vitalício" : sale.plan === "quarterly" ? "Trimestral" : "Mensal"}</Badge></TableCell>
                      <TableCell className="text-xs font-bold">R$ {Number(sale.amount || 0).toFixed(2)}</TableCell>
                      <TableCell>{statusBadge(sale.status)}</TableCell>
                      <TableCell>{sale.affiliate_slug ? <span className="text-xs font-bold text-primary uppercase">{sale.affiliate_slug}</span> : <span className="text-xs opacity-30">—</span>}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Performance por afiliado</CardTitle>
            <CardDescription className="text-xs">Ranking de vendas convertidas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {affiliates.length === 0 && (<p className="text-xs text-muted-foreground text-center py-4">Nenhum afiliado cadastrado.</p>)}
            {affiliates
              .map((aff) => {
                const affSales = sales.filter((s) => s.affiliate_slug === aff.slug && (s.status === "paid" || s.status === "active"));
                const revenue = affSales.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
                return { aff, count: affSales.length, revenue };
              })
              .sort((a, b) => b.revenue - a.revenue)
              .map(({ aff, count, revenue }) => (
                <div key={aff.slug} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold truncate">{aff.name}</span>
                      <Badge variant="outline" className="text-[9px] font-mono">/{aff.slug}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{count} venda{count === 1 ? "" : "s"} · {aff.email || "sem email"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">R$ {revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
