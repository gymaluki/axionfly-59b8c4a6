import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, DollarSign, TrendingUp, ShoppingBag, Edit2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Sale {
  id: string;
  client_name: string;
  description: string | null;
  amount: number;
  status: string;
  sale_date: string;
}

const statusOptions = [
  { value: "pendente", label: "Pendente", color: "text-yellow-500" },
  { value: "pago", label: "Pago", color: "text-green-500" },
  { value: "cancelado", label: "Cancelado", color: "text-red-500" },
];

const VendasView = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("pendente");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);

  const demoSales: Sale[] = useMemo(() => {
    const now = new Date();
    const entries = [
      { client_name: "Barbearia Dom Corte", amount: 2800, status: "pago", daysAgo: 3 },
      { client_name: "Barbearia El Patrón", amount: 1500, status: "pago", daysAgo: 7 },
      { client_name: "Barbearia Vintage Club", amount: 1900, status: "pago", daysAgo: 12 },
      { client_name: "Barbearia Reis do Corte", amount: 1200, status: "pago", daysAgo: 15 },
      { client_name: "Navalha Negra Barbearia", amount: 1700, status: "pago", daysAgo: 18 },
      { client_name: "Barbearia Lenhador", amount: 1650, status: "pago", daysAgo: 22 },
      { client_name: "Studio Barber Premium", amount: 1786, status: "pago", daysAgo: 25 },
      { client_name: "Barbearia Old School SP", amount: 1400, status: "pago", daysAgo: 30 },
      { client_name: "Corte & Estilo Barbearia", amount: 1550, status: "pago", daysAgo: 35 },
      { client_name: "Barbearia Machado", amount: 1350, status: "pago", daysAgo: 38 },
      { client_name: "Dom Bigode Barbearia", amount: 1750, status: "pago", daysAgo: 42 },
      { client_name: "Barbearia Tropa do Corte", amount: 1300, status: "pago", daysAgo: 45 },
      { client_name: "Barbearia La Mafia", amount: 1600, status: "pago", daysAgo: 48 },
      { client_name: "Barbearia Cavalheiro", amount: 1450, status: "pago", daysAgo: 50 },
      { client_name: "Black Barber Studio", amount: 1800, status: "pago", daysAgo: 53 },
      { client_name: "Barbearia Corte Real", amount: 1831, status: "pago", daysAgo: 56 },
      { client_name: "Barbearia Império do Fade", amount: 2200, status: "pendente", daysAgo: 1 },
    ];
    return entries.map((e, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - e.daysAgo);
      return {
        id: `demo-${i}`,
        client_name: e.client_name,
        description: "Criação de site",
        amount: e.amount,
        status: e.status,
        sale_date: d.toISOString().split("T")[0],
      };
    });
  }, []);

  const fetchSales = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("sale_date", { ascending: false });
    const isOwner = user.email === "andreyhenriquev4@gmail.com";
    if (error) {
      toast.error("Erro ao carregar vendas");
      setSales(isOwner ? demoSales : []);
    } else {
      const realSales = (data as Sale[]) || [];
      setSales(isOwner ? [...realSales, ...demoSales] : realSales);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, [user]);

  const resetForm = () => {
    setClientName("");
    setDescription("");
    setAmount("");
    setStatus("pendente");
    setSaleDate(new Date().toISOString().split("T")[0]);
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!clientName.trim() || !amount) {
      toast.error("Preencha o nome do cliente e o valor");
      return;
    }

    const payload = {
      client_name: clientName.trim(),
      description: description.trim() || null,
      amount: parseFloat(amount),
      status,
      sale_date: saleDate,
      user_id: user!.id,
    };

    if (editingId) {
      const { error } = await supabase.from("sales").update(payload).eq("id", editingId);
      if (error) {
        toast.error("Erro ao atualizar venda");
        return;
      }
      toast.success("Venda atualizada!");
    } else {
      const { error } = await supabase.from("sales").insert(payload);
      if (error) {
        toast.error("Erro ao adicionar venda");
        return;
      }
      toast.success("Venda registrada!");
      const audio = new Audio("/sounds/sale-added.mpeg");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }

    resetForm();
    fetchSales();
  };

  const handleEdit = (sale: Sale) => {
    setClientName(sale.client_name);
    setDescription(sale.description || "");
    setAmount(String(sale.amount));
    setStatus(sale.status);
    setSaleDate(sale.sale_date);
    setEditingId(sale.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("sales").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir venda");
      return;
    }
    toast.success("Venda excluída");
    fetchSales();
  };

  const totalRevenue = sales.filter(s => s.status === "pago").reduce((sum, s) => sum + Number(s.amount), 0);
  const totalPending = sales.filter(s => s.status === "pendente").reduce((sum, s) => sum + Number(s.amount), 0);
  const totalSales = sales.length;

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Minhas Vendas</h2>
          <p className="text-muted-foreground text-sm mt-1">Registre e acompanhe todas as suas vendas</p>
        </div>
        <Button variant="neon" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4" /> Nova Venda
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#0d0d14]/40 backdrop-blur-md border border-white/5 rounded-3xl p-2 group hover:border-green-500/20 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-[#475569] flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-500/10 text-green-500">
                <DollarSign className="w-4 h-4" />
              </div>
              Receita (Pago)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-black text-foreground tracking-tight">{formatCurrency(totalRevenue)}</p>
              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+12.5%</span>
            </div>
            {/* Mini bar chart placeholder */}
            <div className="mt-6 flex items-end gap-1 h-12 h-16">
              {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  className="flex-1 bg-green-500/20 rounded-t-sm group-hover:bg-green-500/40 transition-colors"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0d0d14]/40 backdrop-blur-md border border-white/5 rounded-3xl p-2 group hover:border-yellow-500/20 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-[#475569] flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500">
                <TrendingUp className="w-4 h-4" />
              </div>
              Pendente
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-black text-foreground tracking-tight">{formatCurrency(totalPending)}</p>
              <span className="text-[10px] font-bold text-[#94a3b8] bg-white/5 px-2 py-1 rounded-full">venda futura</span>
            </div>
            <div className="mt-6 flex items-end gap-1 h-16">
              {[60, 40, 80, 50, 70, 30, 90].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                  className="flex-1 bg-yellow-500/20 rounded-t-sm group-hover:bg-yellow-500/40 transition-colors"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0d0d14]/40 backdrop-blur-md border border-white/5 rounded-3xl p-2 group hover:border-primary/20 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-[#475569] flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <ShoppingBag className="w-4 h-4" />
              </div>
              Total de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-black text-foreground tracking-tight">{totalSales}</p>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">+4 este mês</span>
            </div>
            <div className="mt-6 flex items-end gap-1 h-16">
              {[30, 60, 40, 100, 70, 50, 80].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 1 + i * 0.1, duration: 1 }}
                  className="flex-1 bg-primary/20 rounded-t-sm group-hover:bg-primary/40 transition-colors"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-border bg-secondary/20">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{editingId ? "Editar Venda" : "Nova Venda"}</CardTitle>
                <Button variant="ghost" size="icon" onClick={resetForm}><X className="w-4 h-4" /></Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Cliente *</label>
                    <Input placeholder="Nome do cliente" value={clientName} onChange={e => setClientName(e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Valor (R$) *</label>
                    <Input type="number" step="0.01" placeholder="0,00" value={amount} onChange={e => setAmount(e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Descrição</label>
                    <Input placeholder="Ex: Criação de site" value={description} onChange={e => setDescription(e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="bg-secondary/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Data</label>
                    <Input type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} className="bg-secondary/50 border-border" />
                  </div>
                </div>
                <Button variant="neon" onClick={handleSubmit} className="w-full">
                  <Check className="w-4 h-4" /> {editingId ? "Salvar Alterações" : "Registrar Venda"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-[#0d0d14]/40 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Descrição</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Valor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Data</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Carregando...</td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Nenhuma venda registrada ainda</td></tr>
            ) : (
              sales.map((sale, i) => {
                const statusInfo = statusOptions.find(s => s.value === sale.status) || statusOptions[0];
                return (
                  <motion.tr
                    key={sale.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "border-b border-white/5 hover:bg-primary/5 transition-all duration-200 group",
                      i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                    )}
                  >
                    <td className="px-6 py-4 font-bold text-foreground">{sale.client_name}</td>
                    <td className="px-6 py-4 text-sm text-[#94a3b8] hidden md:table-cell font-medium">{sale.description || "—"}</td>
                    <td className="px-6 py-4 font-black text-foreground tracking-tight">{formatCurrency(Number(sale.amount))}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border",
                        sale.status === "pago" ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                        sale.status === "pendente" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : 
                        "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#64748b] hidden md:table-cell font-bold">
                      {new Date(sale.sale_date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(sale)} className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(sale.id)} className="h-8 w-8 text-[#475569] hover:bg-red-500/10 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default VendasView;
