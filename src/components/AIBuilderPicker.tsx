import { useEffect, useRef, useState } from "react";
import { GeneratingOverlay } from "@/components/ui/generating-overlay";
import { ExternalLink, Check } from "lucide-react";
import { motion } from "framer-motion";

const LOVABLE_BASE_URL = "https://lovable.dev/invite/4QDCZAZ";

interface AIBuilderPickerProps {
  open: boolean;
  onClose: () => void;
  prompt: string;
}

const copySync = (text: string): boolean => {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    ta.style.top = "0";
    ta.style.left = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
};

export const AIBuilderPicker = ({ open, onClose, prompt }: AIBuilderPickerProps) => {
  const normalizedPrompt = prompt.trim();
  const [generating, setGenerating] = useState<string | null>(null);
  const [readyToOpen, setReadyToOpen] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      startedRef.current = false;
      setReadyToOpen(false);
      setGenerating(null);
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    if (!normalizedPrompt) {
      onClose();
      return;
    }

    try {
      sessionStorage.setItem("axionfly_lovable_prompt", normalizedPrompt);
      localStorage.setItem("axionfly_lovable_prompt", normalizedPrompt);
    } catch {}

    const targetUrl = `${LOVABLE_BASE_URL}?prompt=${encodeURIComponent(normalizedPrompt)}`;

    copySync(normalizedPrompt);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(normalizedPrompt).catch(() => {});
    }

    setGenerating(targetUrl);
  }, [open, normalizedPrompt, onClose]);

  const handleGenerationComplete = () => {
    setReadyToOpen(true);
  };

  const handleOpenLovable = () => {
    if (generating) {
      window.open(generating, "_blank", "noopener,noreferrer");
    }
    setReadyToOpen(false);
    setGenerating(null);
    onClose();
  };

  // If readyToOpen is true, show the final modal
  if (open && readyToOpen && generating) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md rounded-2xl border border-primary/40 bg-[#0a0a14] p-8 text-center shadow-[0_0_80px_-10px_hsl(var(--primary)/0.6)]"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-green-500/30 bg-green-500/10 shadow-[0_0_30px_-5px_rgba(34,197,94,0.4)]">
            <Check className="h-10 w-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Tudo pronto!</h2>
          <p className="mt-4 text-base text-blue-100/80 leading-relaxed">
            Seu prompt foi gerado e copiado automaticamente.
          </p>
          <p className="mt-2 text-sm text-blue-300/60 leading-relaxed">
            Clique no botão abaixo para finalizar e abrir o editor. Lá, basta colar com <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-mono border border-white/10">Ctrl+V</kbd>.
          </p>
          <button
            onClick={handleOpenLovable}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 px-6 py-4 font-bold text-white shadow-[0_0_40px_rgba(36,99,235,0.5)] transition-all hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(36,99,235,0.6)] active:scale-[0.98]"
          >
            <ExternalLink className="h-5 w-5" />
            Clique aqui para finalizar
          </button>
          <button
            onClick={() => { setReadyToOpen(false); setGenerating(null); onClose(); }}
            className="mt-4 w-full py-2 text-sm font-medium text-white/30 hover:text-white/60 transition-colors"
          >
            Voltar
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <GeneratingOverlay
      open={open && generating !== null && !readyToOpen}
      durationMs={6000}
      onComplete={handleGenerationComplete}
    />
  );
};

// Add framer-motion import to the top if not already present
// ... keep existing code

export default AIBuilderPicker;
