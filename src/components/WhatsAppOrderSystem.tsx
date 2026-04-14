import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ShoppingCart, X, ArrowLeft, ArrowRight, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: number;
  name: string;
  desc: string;
  price: number;
  category: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: "Margherita", desc: "Molho de tomate, mussarela, manjericão fresco", price: 39.90, category: "Tradicionais" },
  { id: 2, name: "Calabresa", desc: "Calabresa fatiada, cebola, mussarela, orégano", price: 42.90, category: "Tradicionais" },
  { id: 3, name: "Portuguesa", desc: "Presunto, ovo, cebola, azeitona, mussarela", price: 44.90, category: "Tradicionais" },
  { id: 4, name: "Quatro Queijos", desc: "Mussarela, provolone, parmesão, gorgonzola", price: 48.90, category: "Especiais" },
  { id: 5, name: "Frango com Catupiry", desc: "Frango desfiado, catupiry, milho, mussarela", price: 46.90, category: "Especiais" },
  { id: 6, name: "Pepperoni", desc: "Pepperoni importado, mussarela, molho de tomate", price: 49.90, category: "Especiais" },
  { id: 7, name: "Napolitana", desc: "Tomate fatiado, mussarela, parmesão, manjericão", price: 41.90, category: "Tradicionais" },
  { id: 8, name: "Bacon Cheddar", desc: "Bacon crocante, cheddar, mussarela, cebola caramelizada", price: 52.90, category: "Premium" },
  { id: 9, name: "Costela BBQ", desc: "Costela desfiada, molho BBQ, cebola roxa, mussarela", price: 56.90, category: "Premium" },
  { id: 10, name: "Brigadeiro", desc: "Brigadeiro, granulado, leite condensado", price: 44.90, category: "Doces" },
  { id: 11, name: "Romeu & Julieta", desc: "Goiabada, mussarela, canela", price: 42.90, category: "Doces" },
  { id: 12, name: "Prestígio", desc: "Chocolate, coco ralado, leite condensado", price: 44.90, category: "Doces" },
];

const PAYMENT_METHODS = ["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "PIX"];
const PIZZARIA_NAME = "Pizzaria Demo";
const WHATSAPP_NUMBER = "5511999999999";

type CartMap = Record<number, number>;

interface WhatsAppOrderSystemProps {
  pizzariaName?: string;
  whatsappNumber?: string;
  menuItems?: MenuItem[];
}

export default function WhatsAppOrderSystem({
  pizzariaName = PIZZARIA_NAME,
  whatsappNumber = WHATSAPP_NUMBER,
  menuItems = MENU_ITEMS,
}: WhatsAppOrderSystemProps) {
  const [cart, setCart] = useState<CartMap>({});
  const [showModal, setShowModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);

  // Form fields
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [pagamento, setPagamento] = useState("");
  const [observacao, setObservacao] = useState("");

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find((m) => m.id === Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const categories = [...new Set(menuItems.map((m) => m.category))];

  const addItem = useCallback((id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  }, []);

  const openCheckout = () => {
    setCheckoutStep(0);
    setShowModal(true);
  };

  const sendWhatsApp = () => {
    const lines = [`🍕 *PEDIDO - ${pizzariaName}*`, ""];
    lines.push(`👤 *Nome:* ${nome}`);
    lines.push(`📍 *Endereço:* ${endereco}`);
    lines.push(`💳 *Pagamento:* ${pagamento}`);
    lines.push("");
    lines.push("📋 *Itens do Pedido:*");
    Object.entries(cart).forEach(([id, qty]) => {
      const item = menuItems.find((m) => m.id === Number(id));
      if (item) {
        lines.push(`• ${qty}x ${item.id}. ${item.name} — R$ ${(item.price * qty).toFixed(2).replace(".", ",")}`);
      }
    });
    lines.push("");
    lines.push(`💰 *Total:* R$ ${totalPrice.toFixed(2).replace(".", ",")}`);
    if (observacao.trim()) {
      lines.push("");
      lines.push(`📝 *Observação:* ${observacao}`);
    }

    const msg = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");

    // Reset
    setCart({});
    setNome("");
    setEndereco("");
    setPagamento("");
    setObservacao("");
    setShowModal(false);
  };

  const canProceed = nome.trim().length > 0 && endereco.trim().length > 0 && pagamento.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto pb-24">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">📋 Cardápio</h2>
        <p className="text-sm text-muted-foreground mt-1">Escolha seus itens e faça seu pedido via WhatsApp</p>
      </div>

      {/* Menu by category */}
      {categories.map((cat) => (
        <div key={cat} className="mb-8">
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-primary rounded-full" />
            {cat}
          </h3>
          <div className="grid gap-3">
            {menuItems.filter((m) => m.category === cat).map((item) => {
              const qty = cart[item.id] || 0;
              return (
                <motion.div
                  key={item.id}
                  layout
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
                    qty > 0
                      ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                      : "border-border bg-card/50 hover:border-border/80"
                  )}
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono">#{item.id}</span>
                      <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.desc}</p>
                    <p className="text-sm font-bold text-primary mt-1">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2">
                    {qty > 0 && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-full border border-border bg-secondary/50 flex items-center justify-center text-foreground hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </motion.button>
                    )}
                    {qty > 0 && (
                      <motion.span
                        key={qty}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="w-6 text-center font-bold text-foreground text-sm tabular-nums"
                      >
                        {qty}
                      </motion.span>
                    )}
                    <button
                      onClick={() => addItem(item.id)}
                      className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Floating cart button */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.button
            initial={{ scale: 0, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 40 }}
            onClick={openCheckout}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3.5 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all font-semibold"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Finalizar Pedido</span>
            <span className="bg-primary-foreground text-primary text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
                <h3 className="text-lg font-bold text-foreground">
                  {checkoutStep === 0 ? "📦 Dados da Entrega" : "📋 Revisão do Pedido"}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                <AnimatePresence mode="wait">
                  {checkoutStep === 0 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Nome *</label>
                        <Input
                          placeholder="Seu nome completo"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          className="bg-secondary/50 border-border h-11"
                          autoFocus
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Endereço de entrega *</label>
                        <Input
                          placeholder="Rua, número, bairro"
                          value={endereco}
                          onChange={(e) => setEndereco(e.target.value)}
                          className="bg-secondary/50 border-border h-11"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Forma de pagamento *</label>
                        <div className="grid grid-cols-2 gap-2">
                          {PAYMENT_METHODS.map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setPagamento(m)}
                              className={cn(
                                "p-2.5 rounded-xl border text-sm font-medium transition-all duration-200",
                                pagamento === m
                                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                                  : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
                              )}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Observação</label>
                        <Input
                          placeholder="Ex: sem cebola, borda recheada"
                          value={observacao}
                          onChange={(e) => setObservacao(e.target.value)}
                          className="bg-secondary/50 border-border h-11"
                        />
                      </div>

                      <Button
                        variant="neon"
                        className="w-full mt-2"
                        onClick={() => setCheckoutStep(1)}
                        disabled={!canProceed}
                      >
                        Revisar Pedido
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="space-y-4"
                    >
                      {/* Summary */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1.5 px-3 rounded-lg bg-secondary/30 border border-border">
                          <span className="text-muted-foreground">👤 Nome</span>
                          <span className="font-medium text-foreground">{nome}</span>
                        </div>
                        <div className="flex justify-between py-1.5 px-3 rounded-lg bg-secondary/30 border border-border">
                          <span className="text-muted-foreground">📍 Endereço</span>
                          <span className="font-medium text-foreground text-right max-w-[55%]">{endereco}</span>
                        </div>
                        <div className="flex justify-between py-1.5 px-3 rounded-lg bg-secondary/30 border border-border">
                          <span className="text-muted-foreground">💳 Pagamento</span>
                          <span className="font-medium text-foreground">{pagamento}</span>
                        </div>
                        {observacao.trim() && (
                          <div className="flex justify-between py-1.5 px-3 rounded-lg bg-secondary/30 border border-border">
                            <span className="text-muted-foreground">📝 Obs</span>
                            <span className="font-medium text-foreground text-right max-w-[55%]">{observacao}</span>
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-foreground">Itens do Pedido</h4>
                        {Object.entries(cart).map(([id, qty]) => {
                          const item = menuItems.find((m) => m.id === Number(id));
                          if (!item) return null;
                          return (
                            <div key={id} className="flex justify-between items-center py-2 px-3 rounded-lg bg-secondary/30 border border-border text-sm">
                              <span className="text-foreground">
                                {qty}x {item.name}
                              </span>
                              <span className="font-medium text-primary">
                                R$ {(item.price * qty).toFixed(2).replace(".", ",")}
                              </span>
                            </div>
                          );
                        })}
                        <div className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-primary/10 border border-primary/20 text-sm font-bold">
                          <span className="text-foreground">Total</span>
                          <span className="text-primary text-base">
                            R$ {totalPrice.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setCheckoutStep(0)}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Voltar
                        </Button>
                        <Button
                          variant="neon"
                          className="flex-1"
                          onClick={sendWhatsApp}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Enviar WhatsApp
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
