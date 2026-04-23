import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, ExternalLink, X, Check } from "lucide-react";
import { toast } from "sonner";

interface Builder {
  name: string;
  url: string;
  description: string;
  freeInfo: string;
  domain: string;
  bg: string;
  recommended?: boolean;
}

const logoUrl = (domain: string) => `https://logo.clearbit.com/${domain}`;
const fallbackFavicon = (domain: string) => `https://icons.duckduckgo.com/ip3/${domain}.ico`;

// Apenas IAs com plano gratuito real para criar sites
const builders: Builder[] = [
  { name: "Lovable", url: "https://lovable.dev/invite/4QDCZAZ", description: "Parceiro oficial AxionFly", freeInfo: "5 mensagens grátis/dia", domain: "lovable.dev", bg: "from-pink-500/30 to-purple-500/30", recommended: true },
  { name: "Bolt.new", url: "https://bolt.new", description: "Builder full-stack instantâneo", freeInfo: "1M tokens grátis/dia", domain: "bolt.new", bg: "from-blue-500/20 to-cyan-500/20" },
  { name: "v0 by Vercel", url: "https://v0.dev", description: "UI components com IA", freeInfo: "Plano gratuito mensal", domain: "v0.dev", bg: "from-zinc-500/20 to-slate-500/20" },
  { name: "Replit Agent", url: "https://replit.com", description: "Codifica e roda no navegador", freeInfo: "Conta grátis disponível", domain: "replit.com", bg: "from-orange-500/20 to-red-500/20" },
  { name: "Framer AI", url: "https://www.framer.com/ai", description: "Sites visuais animados", freeInfo: "Plano free para sempre", domain: "framer.com", bg: "from-blue-600/20 to-indigo-500/20" },
  { name: "Webflow AI", url: "https://webflow.com/ai", description: "No-code visual avançado", freeInfo: "Starter grátis", domain: "webflow.com", bg: "from-purple-500/20 to-violet-500/20" },
  { name: "Durable", url: "https://durable.co", description: "Site em 30 segundos", freeInfo: "Trial gratuito", domain: "durable.co", bg: "from-emerald-500/20 to-green-500/20" },
  { name: "Mixo", url: "https://mixo.io", description: "Landing pages instantâneas", freeInfo: "Plano free disponível", domain: "mixo.io", bg: "from-rose-500/20 to-pink-500/20" },
  { name: "Hocoos", url: "https://hocoos.com", description: "Site em 5 minutos", freeInfo: "Criação 100% grátis", domain: "hocoos.com", bg: "from-teal-500/20 to-cyan-500/20" },
  { name: "B12", url: "https://b12.io", description: "Sites profissionais com IA", freeInfo: "Rascunho grátis", domain: "b12.io", bg: "from-indigo-500/20 to-blue-500/20" },
  { name: "Typedream", url: "https://typedream.com", description: "Notion-like website builder", freeInfo: "Free starter", domain: "typedream.com", bg: "from-amber-500/20 to-orange-500/20" },
  { name: "Dorik AI", url: "https://dorik.com", description: "Sites com IA sem código", freeInfo: "Free forever plan", domain: "dorik.com", bg: "from-cyan-500/20 to-teal-500/20" },
];

interface AIBuilderPickerProps {
  open: boolean;
  onClose: () => void;
  prompt: string;
}

export const AIBuilderPicker = ({ open, onClose, prompt }: AIBuilderPickerProps) => {
  const [copying, setCopying] = useState<string | null>(null);

  const handlePick = async (builder: Builder) => {
    setCopying(builder.name);
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success(`Prompt copiado! Abrindo ${builder.name}...`);
    } catch {
      toast.error("Não consegui copiar o prompt automaticamente — cole manualmente.");
    }
    setTimeout(() => {
      const newWindow = window.open(builder.url, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
      setCopying(null);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-background/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-5xl bg-card border border-border rounded-2xl shadow-2xl my-4 sm:my-8 max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 p-4 sm:p-6 border-b border-border bg-card rounded-t-2xl shrink-0">
              <div className="space-y-2 min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Onde você quer criar seu site?
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                  Escolha a IA — vamos copiar o prompt e abrir a plataforma para você colar.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary transition-colors shrink-0"
                aria-label="Fechar"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {builders.map((builder, i) => (
                  <motion.button
                    key={builder.name}
                    type="button"
                    onClick={() => handlePick(builder)}
                    disabled={copying !== null}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.02 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative overflow-hidden rounded-2xl border bg-card p-3 sm:p-4 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      builder.recommended
                        ? "border-primary/60 ring-2 ring-primary/40 shadow-[0_0_30px_-10px_hsl(var(--primary)/0.6)] hover:border-primary mt-3"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {builder.recommended && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-lg whitespace-nowrap">
                        <Crown className="w-3 h-3" />
                        MAIS ESCOLHIDO
                      </div>
                    )}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${builder.bg} ${
                        builder.recommended ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      } transition-opacity pointer-events-none`}
                    />
                    <div className="relative z-10 flex flex-col h-full min-h-[130px]">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="w-11 h-11 rounded-xl bg-secondary border border-border flex items-center justify-center overflow-hidden p-1.5 shrink-0">
                          {copying === builder.name ? (
                            <Check className="w-5 h-5 text-primary" />
                          ) : (
                            <img
                              src={logoUrl(builder.domain)}
                              alt={`Logo ${builder.name}`}
                              className="w-full h-full object-contain"
                              loading="lazy"
                              onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                if (!img.dataset.fallback) {
                                  img.dataset.fallback = "1";
                                  img.src = fallbackFavicon(builder.domain);
                                } else {
                                  img.style.display = "none";
                                  const parent = img.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<span class="text-sm font-bold text-foreground">${builder.name.charAt(0)}</span>`;
                                  }
                                }
                              }}
                            />
                          )}
                        </div>
                        <ExternalLink
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            builder.recommended ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                          }`}
                        />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm mb-1 flex items-center gap-1.5 truncate">
                        <span className="truncate">{builder.name}</span>
                        {builder.recommended && <Crown className="w-3 h-3 text-primary fill-primary shrink-0" />}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{builder.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIBuilderPicker;
