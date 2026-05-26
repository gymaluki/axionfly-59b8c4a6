import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2, QrCode, CreditCard, ArrowLeft, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Nome amigável exibido no topo */
  planName: string;
  /** Plano enviado ao backend */
  planKey?: "monthly" | "lifetime";
  /** Preço exibido (texto) */
  priceLabel?: string;
  /** Sub-rótulo (ex. "à vista" ou "/mês") */
  priceHint?: string;
  /** Fallback de checkout (caso a API falhe) */
  fallbackUrl?: string | null;
}

type Step = "form" | "method";

const maskCPF = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  }
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
};

export default function CheckoutModal({
  open,
  onOpenChange,
  planName,
  planKey = "lifetime",
  priceLabel = "R$ 179,90",
  priceHint = "à vista",
  fallbackUrl,
}: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [method, setMethod] = useState<"pix" | "credit_card">("pix");
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [pixImage, setPixImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", cpf: "", phone: "" });

  useEffect(() => {
    if (open) {
      setStep("form");
      setMethod("pix");
      setPixCode(null);
      setPixImage(null);
      setCopied(false);
    }
  }, [open]);

  const canContinue =
    form.name.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.cpf.replace(/\D/g, "").length === 11 &&
    form.phone.replace(/\D/g, "").length >= 10;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;
    setStep("method");
  };

  const handleGenerate = async () => {
    setLoading(true);
    setPixCode(null);
    setPixImage(null);
    try {
      const { data, error } = await supabase.functions.invoke("cakto-create-checkout", {
        body: {
          plan: planKey,
          payment_method: method,
          customer: form,
        },
      });
      if (error) throw error;

      if (method === "pix") {
        if (data?.pix_code) {
          setPixCode(data.pix_code);
          setPixImage(data.pix_qr_image || null);
        } else if (data?.checkout_url) {
          window.open(data.checkout_url, "_blank");
        } else if (fallbackUrl) {
          window.open(fallbackUrl, "_blank");
        } else {
          toast.error("Não foi possível gerar o PIX. Tente novamente.");
        }
      } else {
        const url = data?.checkout_url || fallbackUrl;
        if (url) window.open(url, "_blank");
        else toast.error("Não foi possível abrir o pagamento por cartão.");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      if (fallbackUrl) {
        window.open(fallbackUrl, "_blank");
      } else {
        toast.error("Falha ao processar o checkout. Tente novamente em instantes.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyPix = async () => {
    if (!pixCode) return;
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success("Código PIX copiado!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md p-0 overflow-hidden border-primary/20 bg-[#0a0f1e] rounded-2xl">
        <DialogTitle className="sr-only">Checkout — {planName}</DialogTitle>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              {step === "method" && (
                <button
                  onClick={() => setStep("form")}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> voltar
                </button>
              )}
              <h2 className="text-xl font-black text-foreground">{planName}</h2>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            {priceLabel} <span className="opacity-60">•</span> {priceHint}
          </p>

          {/* Step 1 — Form */}
          {step === "form" && (
            <form onSubmit={handleContinue} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Nome completo</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg bg-[#0d1428] border border-primary/40 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg bg-[#0d1428] border border-border text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">CPF</label>
                  <input
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: maskCPF(e.target.value) })}
                    className="w-full h-12 px-4 rounded-lg bg-[#0d1428] border border-border text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">WhatsApp</label>
                  <input
                    inputMode="tel"
                    placeholder="(11) 90000-0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
                    className="w-full h-12 px-4 rounded-lg bg-[#0d1428] border border-border text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!canContinue}
                className="w-full h-12 rounded-lg text-base font-black text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
              >
                Continuar
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Pagamento processado de forma segura.
              </p>
            </form>
          )}

          {/* Step 2 — Method */}
          {step === "method" && (
            <div className="space-y-5">
              {/* Tabs */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#0d1428] p-1.5 border border-border">
                <button
                  onClick={() => setMethod("pix")}
                  className={`h-11 rounded-lg flex items-center justify-center gap-2 text-sm font-black transition-all ${
                    method === "pix"
                      ? "bg-[#020611] text-white shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <QrCode className="w-4 h-4" /> PIX
                </button>
                <button
                  onClick={() => setMethod("credit_card")}
                  className={`h-11 rounded-lg flex items-center justify-center gap-2 text-sm font-black transition-all ${
                    method === "credit_card"
                      ? "bg-[#020611] text-white shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Cartão
                </button>
              </div>

              {/* PIX result */}
              {method === "pix" && pixCode && (
                <div className="space-y-3 rounded-xl border border-primary/20 bg-[#0d1428] p-4">
                  {pixImage && (
                    <img
                      src={pixImage.startsWith("data:") ? pixImage : `data:image/png;base64,${pixImage}`}
                      alt="QR Code PIX"
                      className="w-48 h-48 mx-auto rounded-lg bg-white p-2"
                    />
                  )}
                  <button
                    onClick={copyPix}
                    className="w-full h-11 rounded-lg flex items-center justify-center gap-2 text-sm font-black bg-primary/15 border border-primary/40 text-primary hover:bg-primary/25 transition-all"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Código copiado" : "Copiar código PIX"}
                  </button>
                  <p className="text-[11px] text-center text-muted-foreground">
                    Após o pagamento, sua liberação é automática.
                  </p>
                </div>
              )}

              {!pixCode && (
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full h-12 rounded-lg text-base font-black text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-60 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {method === "pix" ? "Gerar PIX" : "Pagar com Cartão"}
                </button>
              )}

              <div className="flex items-center justify-center gap-3 opacity-50 text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>PIX</span> <span>•</span> <span>Mastercard</span> <span>•</span> <span>Visa</span> <span>•</span> <span>Boleto</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
