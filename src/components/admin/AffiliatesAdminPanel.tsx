import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DollarSign, Users, BarChart3, CheckCircle2, Search, RefreshCw, Plus, Pencil, Trash2,
  Copy, ExternalLink, AlertTriangle, Link2, ShieldCheck,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  id?: string;
  slug: string;
  name: string;
  email: string | null;
  monthly_url: string | null;
  quarterly_url: string | null;
  lifetime_url: string | null;
}

const PUBLIC_BASE = "https://www.axionfly.site";
const CAKTO_PRODUCTS = {
  monthly: "6u886t8_849513",
  quarterly: "uqn993t",
  lifetime: "wcv2cko_849541",
};

function extractAffiliateCode(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.searchParams.get("affiliate");
  } catch {
    return null;
  }
}

function validateCaktoUrl(url: string, expectedProduct: string): { ok: boolean; reason?: string } {
  if (!url || !url.trim()) return { ok: false, reason: "Link vazio" };
  try {
    const u = new URL(url);
    if (u.hostname !== "pay.cakto.com.br") return { ok: false, reason: "Domínio inválido (esperado pay.cakto.com.br)" };
    if (!u.pathname.includes(expectedProduct)) return { ok: false, reason: `Produto Cakto incorreto (esperado ${expectedProduct})` };
    if (!u.searchParams.get("affiliate")) return { ok: false, reason: "Sem parâmetro ?affiliate=" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "URL malformada" };
  }
}

const EMPTY: Affiliate = {
  slug: "", name: "", email: "", monthly_url: "", quarterly_url: "", lifetime_url: "",
};

export default function AffiliatesAdminPanel() {
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState<"today" | "7d" | "30d" | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [affiliateFilter, setAffiliateFilter] = useState<string>("all");

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Affiliate>(EMPTY);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Affiliate | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesRes, affRes] = await Promise.all([
        supabase.from("platform_sales").select("*").order("created_at", { ascending: false }).limit(500),
        supabase.from("affiliates").select("*").order("name"),
      ]);
      if (salesRes.error) throw salesRes.error;
      if (affRes.error) throw affRes.error;
      setSales((salesRes.data || []) as Sale[]);
      setAffiliates((affRes.data || []) as Affiliate[]);
    } catch (err: any) {
      toast({ title: "Erro ao carregar", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ============ AUDITORIA ============
  const audit = useMemo(() => {
    const issues: { level: "error" | "warn"; msg: string }[] = [];

    // slugs duplicados
    const slugCount: Record<string, number> = {};
    affiliates.forEach((a) => { slugCount[a.slug] = (slugCount[a.slug] || 0) + 1; });
    Object.entries(slugCount).forEach(([slug, n]) => {
      if (n > 1) issues.push({ level: "error", msg: `Slug duplicado: "${slug}" aparece ${n} vezes` });
    });

    // links inválidos
    affiliates.forEach((a) => {
      const m = validateCaktoUrl(a.monthly_url || "", CAKTO_PRODUCTS.monthly);
      if (!m.ok) issues.push({ level: "error", msg: `${a.name} (/${a.slug}) — Mensal: ${m.reason}` });
      const q = validateCaktoUrl(a.quarterly_url || "", CAKTO_PRODUCTS.quarterly);
      if (!q.ok) issues.push({ level: "error", msg: `${a.name} (/${a.slug}) — Trimestral: ${q.reason}` });
      const l = validateCaktoUrl(a.lifetime_url || "", CAKTO_PRODUCTS.lifetime);
      if (!l.ok) issues.push({ level: "error", msg: `${a.name} (/${a.slug}) — Vitalício: ${l.reason}` });
    });

    // códigos affiliate compartilhados
    const codeMap: Record<string, string[]> = {};
    affiliates.forEach((a) => {
      ["monthly_url", "quarterly_url", "lifetime_url"].forEach((k) => {
        const code = extractAffiliateCode((a as any)[k]);
        if (code) {
          codeMap[code] = codeMap[code] || [];
          if (!codeMap[code].includes(a.name)) codeMap[code].push(a.name);
        }
      });
    });
    Object.entries(codeMap).forEach(([code, names]) => {
      if (names.length > 1) {
        issues.push({ level: "warn", msg: `Código Cakto "${code}" compartilhado entre: ${names.join(", ")}` });
      }
    });

    return issues;
  }, [affiliates]);

  // ============ FILTROS ============
  const filteredSales = useMemo(() => {
    const now = Date.now();
    const ranges: Record<string, number> = {
      today: 24 * 3600 * 1000,
      "7d": 7 * 24 * 3600 * 1000,
      "30d": 30 * 24 * 3600 * 1000,
    };
    return sales.filter((s) => {
      if (periodFilter !== "all") {
        const cutoff = now - ranges[periodFilter];
        if (new Date(s.created_at).getTime() < cutoff) return false;
      }
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (affiliateFilter !== "all" && s.affiliate_slug !== affiliateFilter) return false;
      const q = search.toLowerCase();
      if (q && !s.email?.toLowerCase().includes(q) && !(s.affiliate_slug || "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sales, search, periodFilter, statusFilter, affiliateFilter]);

  const totalRevenue = filteredSales
    .filter((s) => s.status === "paid" || s.status === "active")
    .reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
  const paidCount = filteredSales.filter((s) => s.status === "paid" || s.status === "active").length;
  const pixCount = filteredSales.filter((s) => s.payment_method === "pix").length;

  const statusBadge = (status: string) => {
    if (status === "paid" || status === "active")
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Pago</Badge>;
    if (status === "pending")
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pendente</Badge>;
    if (status === "canceled")
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Cancelado</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  // ============ CRUD ============
  const openNew = () => { setEditing(EMPTY); setIsNew(true); setEditOpen(true); };
  const openEdit = (a: Affiliate) => { setEditing({ ...a }); setIsNew(false); setEditOpen(true); };

  const saveAffiliate = async () => {
    const e = editing;
    if (!e.slug.trim() || !e.name.trim()) {
      toast({ title: "Slug e nome são obrigatórios", variant: "destructive" });
      return;
    }
    if (!/^[a-z0-9_-]+$/i.test(e.slug)) {
      toast({ title: "Slug inválido", description: "Use apenas letras, números, _ ou -", variant: "destructive" });
      return;
    }
    const checks = [
      validateCaktoUrl(e.monthly_url || "", CAKTO_PRODUCTS.monthly),
      validateCaktoUrl(e.quarterly_url || "", CAKTO_PRODUCTS.quarterly),
      validateCaktoUrl(e.lifetime_url || "", CAKTO_PRODUCTS.lifetime),
    ];
    const bad = checks.find((c) => !c.ok);
    if (bad) {
      toast({ title: "Link Cakto inválido", description: bad.reason, variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        slug: e.slug.trim().toLowerCase(),
        name: e.name.trim(),
        email: e.email?.trim() || null,
        monthly_url: e.monthly_url?.trim() || null,
        quarterly_url: e.quarterly_url?.trim() || null,
        lifetime_url: e.lifetime_url?.trim() || null,
      };
      if (isNew) {
        const { error } = await supabase.from("affiliates").insert(payload);
        if (error) throw error;
        toast({ title: "Afiliado criado" });
      } else {
        const { error } = await supabase.from("affiliates").update(payload).eq("id", e.id!);
        if (error) throw error;
        toast({ title: "Afiliado atualizado" });
      }
      setEditOpen(false);
      await fetchData();
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    try {
      const { error } = await supabase.from("affiliates").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      toast({ title: "Afiliado excluído" });
      setDeleteTarget(null);
      await fetchData();
    } catch (err: any) {
      toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" });
    }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copiado`, description: text });
  };

  // ============ RENDER ============
  return (
    <div className="space-y-4">
      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold">R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">Receita ({periodFilter === "all" ? "tudo" : periodFilter})</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{paidCount}</p>
              <p className="text-xs text-muted-foreground">Vendas pagas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{pixCount}</p>
              <p className="text-xs text-muted-foreground">PIX gerados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{affiliates.length}</p>
              <p className="text-xs text-muted-foreground">Afiliados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AUDITORIA */}
      {audit.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Auditoria — {audit.length} aviso{audit.length === 1 ? "" : "s"}
            </CardTitle>
            <CardDescription className="text-xs">Inconsistências detectadas nos links e parâmetros de afiliado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1.5 pt-0 max-h-44 overflow-auto">
            {audit.map((i, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <Badge
                  variant="outline"
                  className={i.level === "error"
                    ? "bg-red-500/10 text-red-500 border-red-500/20 text-[9px]"
                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[9px]"}
                >
                  {i.level === "error" ? "ERRO" : "AVISO"}
                </Badge>
                <span className="opacity-80">{i.msg}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {audit.length === 0 && affiliates.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-3 flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Todos os parâmetros de afiliado estão corretos.</span>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="afiliados" className="w-full">
        <TabsList>
          <TabsTrigger value="afiliados">Afiliados</TabsTrigger>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
        </TabsList>

        {/* AFILIADOS — CRUD */}
        <TabsContent value="afiliados" className="space-y-3">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
              <div>
                <CardTitle className="text-base">Gestão de afiliados</CardTitle>
                <CardDescription className="text-xs">Criar, editar e excluir afiliados. Validação automática dos links Cakto.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={fetchData}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={openNew} className="h-9">
                  <Plus className="w-4 h-4 mr-1" /> Novo afiliado
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] uppercase tracking-wider">Nome</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider">Slug</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider">Email</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider">Códigos Cakto</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider">Vendas</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates.map((a) => {
                    const affSales = sales.filter((s) => s.affiliate_slug === a.slug && (s.status === "paid" || s.status === "active"));
                    const codes = [
                      extractAffiliateCode(a.monthly_url),
                      extractAffiliateCode(a.quarterly_url),
                      extractAffiliateCode(a.lifetime_url),
                    ].filter(Boolean) as string[];
                    const uniqueCodes = [...new Set(codes)];
                    return (
                      <TableRow key={a.id || a.slug}>
                        <TableCell className="text-sm font-bold">{a.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-mono">/{a.slug}</Badge>
                        </TableCell>
                        <TableCell className="text-xs opacity-70">{a.email || "—"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {uniqueCodes.map((c) => (
                              <Badge key={c} variant="outline" className="text-[9px] font-mono">{c}</Badge>
                            ))}
                            {uniqueCodes.length === 0 && <span className="text-[10px] opacity-30">sem código</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-primary">{affSales.length}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost" size="icon" className="h-8 w-8"
                              title="Copiar link público"
                              onClick={() => copy(`${PUBLIC_BASE}/?aff=${a.slug}`, "Link público")}
                            >
                              <Link2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="icon" className="h-8 w-8"
                              title="Testar checkout vitalício"
                              onClick={() => a.lifetime_url && window.open(a.lifetime_url, "_blank")}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(a)}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-500"
                              onClick={() => setDeleteTarget(a)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {affiliates.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                        Nenhum afiliado cadastrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VENDAS */}
        <TabsContent value="vendas">
          <Card className="bg-card border-border">
            <CardHeader className="space-y-3">
              <div className="flex flex-row items-center justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="text-base">Vendas recentes</CardTitle>
                  <CardDescription className="text-xs">Atualizado via webhook da Cakto.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar email ou slug..."
                      className="pl-9 w-56 h-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={fetchData}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["today", "7d", "30d", "all"] as const).map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={periodFilter === p ? "default" : "outline"}
                    onClick={() => setPeriodFilter(p)}
                    className="h-7 text-[10px] uppercase"
                  >
                    {p === "today" ? "Hoje" : p === "all" ? "Tudo" : p}
                  </Button>
                ))}
                <span className="w-px bg-border mx-1" />
                {(["all", "paid", "pending", "canceled"] as const).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={statusFilter === s ? "default" : "outline"}
                    onClick={() => setStatusFilter(s)}
                    className="h-7 text-[10px] uppercase"
                  >
                    {s === "all" ? "Todos" : s === "paid" ? "Pagos" : s === "pending" ? "Pendentes" : "Cancelados"}
                  </Button>
                ))}
                <span className="w-px bg-border mx-1" />
                <select
                  value={affiliateFilter}
                  onChange={(e) => setAffiliateFilter(e.target.value)}
                  className="h-7 text-[10px] uppercase rounded-md border border-input bg-background px-2"
                >
                  <option value="all">TODOS AFILIADOS</option>
                  {affiliates.map((a) => (
                    <option key={a.slug} value={a.slug}>/{a.slug} — {a.name}</option>
                  ))}
                </select>
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
                        <TableCell className="text-xs opacity-70">
                          {new Date(sale.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                        </TableCell>
                        <TableCell className="text-xs font-bold">{sale.email}</TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {sale.plan === "lifetime" ? "Vitalício" : sale.plan === "quarterly" ? "Trimestral" : "Mensal"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-bold">R$ {Number(sale.amount || 0).toFixed(2)}</TableCell>
                        <TableCell>{statusBadge(sale.status)}</TableCell>
                        <TableCell>
                          {sale.affiliate_slug ? (
                            <span className="text-xs font-bold text-primary uppercase">/{sale.affiliate_slug}</span>
                          ) : (
                            <span className="text-xs opacity-30">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RANKING */}
        <TabsContent value="ranking">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Performance por afiliado</CardTitle>
              <CardDescription className="text-xs">Ranking por receita convertida.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {affiliates
                .map((aff) => {
                  const affSales = sales.filter((s) => s.affiliate_slug === aff.slug && (s.status === "paid" || s.status === "active"));
                  const revenue = affSales.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
                  return { aff, count: affSales.length, revenue };
                })
                .sort((a, b) => b.revenue - a.revenue)
                .map(({ aff, count, revenue }, idx) => (
                  <div key={aff.slug} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold truncate">{aff.name}</span>
                          <Badge variant="outline" className="text-[9px] font-mono">/{aff.slug}</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {count} venda{count === 1 ? "" : "s"} · {aff.email || "sem email"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">R$ {revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              {affiliates.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6">Nenhum afiliado cadastrado.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG EDITAR/NOVO */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isNew ? "Novo afiliado" : `Editar — ${editing.name}`}</DialogTitle>
            <DialogDescription className="text-xs">
              Os links Cakto precisam conter <code className="text-primary">?affiliate=</code> e o produto correto.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Nome</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Slug (?aff=)</Label>
                <Input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase() })}
                  disabled={!isNew}
                  placeholder="ex: y"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input value={editing.email || ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Link Mensal (Cakto)</Label>
              <Input
                value={editing.monthly_url || ""}
                onChange={(e) => setEditing({ ...editing, monthly_url: e.target.value })}
                placeholder={`https://pay.cakto.com.br/${CAKTO_PRODUCTS.monthly}?affiliate=...`}
              />
            </div>
            <div>
              <Label className="text-xs">Link Trimestral (Cakto)</Label>
              <Input
                value={editing.quarterly_url || ""}
                onChange={(e) => setEditing({ ...editing, quarterly_url: e.target.value })}
                placeholder={`https://pay.cakto.com.br/${CAKTO_PRODUCTS.quarterly}?affiliate=...`}
              />
            </div>
            <div>
              <Label className="text-xs">Link Vitalício (Cakto)</Label>
              <Input
                value={editing.lifetime_url || ""}
                onChange={(e) => setEditing({ ...editing, lifetime_url: e.target.value })}
                placeholder={`https://pay.cakto.com.br/${CAKTO_PRODUCTS.lifetime}?affiliate=...`}
              />
            </div>
            {editing.slug && (
              <div className="p-2 rounded-md bg-muted/30 border border-border/50 flex items-center justify-between gap-2">
                <code className="text-[10px] truncate">{PUBLIC_BASE}/?aff={editing.slug}</code>
                <Button
                  size="sm" variant="ghost" className="h-7"
                  onClick={() => copy(`${PUBLIC_BASE}/?aff=${editing.slug}`, "Link público")}
                >
                  <Copy className="w-3 h-3 mr-1" /> Copiar
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={saveAffiliate} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG EXCLUIR */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir afiliado?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{deleteTarget?.name}</strong> (/{deleteTarget?.slug})? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </Dialog>
    </div>
  );
}
