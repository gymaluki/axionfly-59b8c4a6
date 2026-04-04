import { useState, useEffect } from "react";
import { Plus, Trash2, DollarSign, TrendingUp, ShoppingBag, Edit2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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

  const fetchSales = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("sale_date", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar vendas");
    } else {
      setSales((data as Sale[]) || []);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-secondary/30 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" /> Receita (Pago)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-500" /> Pendente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPending)}</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" /> Total de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{totalSales}</p>
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
      <div className="glass rounded-xl overflow-hidden">
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{sale.client_name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{sale.description || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{formatCurrency(Number(sale.amount))}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                      {new Date(sale.sale_date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(sale)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(sale.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
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
