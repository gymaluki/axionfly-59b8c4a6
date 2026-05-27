import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ArrowLeft, 
  BarChart3, 
  Calendar as CalendarIcon,
  Search,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import WebhookManagerPanel from "@/components/admin/WebhookManagerPanel";
import LandingVideosPanel from "@/components/admin/LandingVideosPanel";

interface Sale {
  id: string;
  email: string;
  amount: number;
  status: string;
  payment_method: string;
  plan: string;
  affiliate_slug: string | null;
  created_at: string;
}

interface Affiliate {
  slug: string;
  name: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error || !adminUser) {
        toast.error("Acesso negado. Apenas administradores podem acessar esta página.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchData();
    } catch (err) {
      console.error(err);
      navigate("/");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesRes, affRes] = await Promise.all([
        supabase.from("platform_sales").select("*").order("created_at", { ascending: false }),
        supabase.from("affiliates").select("slug, name")
      ]);

      if (salesRes.error) throw salesRes.error;
      if (affRes.error) throw affRes.error;

      setSales(salesRes.data || []);
      setAffiliates(affRes.data || []);
    } catch (err: any) {
      toast.error("Erro ao carregar dados: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter(s => 
    s.email.toLowerCase().includes(search.toLowerCase()) || 
    (s.affiliate_slug || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = sales
    .filter(s => s.status === "paid" || s.status === "active")
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const totalPixGenerated = sales.filter(s => s.payment_method === "pix").length;
  const paidSalesCount = sales.filter(s => s.status === "paid" || s.status === "active").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
      case "active":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Pago</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pendente</Badge>;
      case "canceled":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2 cursor-pointer hover:underline" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Voltar para o site</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Painel de Afiliados</h1>
            <p className="text-muted-foreground">Bem-vindo, Andrey. Acompanhe a performance global do projeto.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={fetchData} variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10">
              <TrendingUp className="w-4 h-4 mr-2" />
              Atualizar Dados
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
              <p className="text-[10px] text-green-500 mt-1 flex items-center gap-1 font-bold">
                <TrendingUp className="w-3 h-3" />
                Vendas convertidas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Vendas Pagas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{paidSalesCount}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold">Total de assinaturas ativas</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">PIX Gerados</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{totalPixGenerated}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold">Intenções de compra via PIX</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Afiliados Ativos</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{affiliates.length}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold">Parceiros registrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sales Table */}
          <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-white/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Vendas Recentes</CardTitle>
                  <CardDescription className="text-xs">Acompanhamento em tempo real das transações da Cakto.</CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar por email ou afiliado..." 
                    className="pl-10 bg-black/20 border-white/10 h-9 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/[0.02]">
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Data</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cliente</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Plano</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Valor</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Afiliado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground">Carregando dados...</TableCell></TableRow>
                  ) : filteredSales.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground">Nenhuma venda encontrada.</TableCell></TableRow>
                  ) : (
                    filteredSales.map((sale) => (
                      <TableRow key={sale.id} className="hover:bg-white/[0.02] border-white/5">
                        <TableCell className="text-xs font-medium opacity-70">
                          {new Date(sale.created_at).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell className="text-xs font-bold">{sale.email}</TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter">
                            {sale.plan === 'lifetime' ? 'Vitalício' : 'Mensal'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-black">R$ {Number(sale.amount).toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(sale.status)}</TableCell>
                        <TableCell>
                          {sale.affiliate_slug ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span className="text-xs font-black text-primary uppercase">{sale.affiliate_slug}</span>
                            </div>
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

          {/* Affiliates List */}
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Performance por Afiliado</CardTitle>
                <CardDescription className="text-xs">Ranking de vendas por parceiro.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {affiliates.map((aff) => {
                  const affSales = sales.filter(s => s.affiliate_slug === aff.slug && (s.status === "paid" || s.status === "active"));
                  const affRevenue = affSales.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                  
                  return (
                    <div key={aff.slug} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                          {aff.name}
                          <Badge className="bg-primary/20 text-primary border-primary/20 text-[9px] font-black tracking-tighter uppercase px-1.5 py-0 h-auto">
                            ?aff={aff.slug}
                          </Badge>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-bold">{affSales.length} vendas convertidas</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-primary">R$ {affRevenue.toFixed(2)}</div>
                        <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Total</div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/20 to-transparent border-primary/30">
              <CardHeader>
                <CardTitle className="text-lg">Dica do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-relaxed opacity-80">
                  As vendas são registradas automaticamente via Webhook da Cakto. Para que um afiliado receba crédito, ele deve enviar o link com o parâmetro <code className="bg-black/40 px-1 rounded">?aff=slug</code>.
                </p>
                <Button variant="link" className="text-primary text-xs font-black uppercase tracking-widest p-0 mt-4 h-auto">
                  Configurar Webhook <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Painel do Webhook */}
        <div className="pt-4">
          <div className="mb-4">
            <h2 className="text-2xl font-black tracking-tight">Gerenciar Webhook</h2>
            <p className="text-xs text-muted-foreground">Trocar token, testar e ver histórico de eventos — tudo sem precisar pedir ajuda.</p>
          </div>
          <WebhookManagerPanel />
        </div>

        {/* Vídeos da Landing */}
        <div className="pt-4">
          <div className="mb-4">
            <h2 className="text-2xl font-black tracking-tight">Vídeos da Landing</h2>
            <p className="text-xs text-muted-foreground">Atualize o vídeo do Computador e do Celular exibidos na home.</p>
          </div>
          <LandingVideosPanel />
        </div>

      </div>
    </div>
  );
}