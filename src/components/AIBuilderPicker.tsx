import { useEffect, useRef, useState } from "react";
import { GeneratingOverlay } from "@/components/ui/generating-overlay";
import { ExternalLink, Check } from "lucide-react";

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
    console.log("Generation complete - showing button");
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

  return (
    <>
      <GeneratingOverlay
        open={open && generating !== null && !readyToOpen}
        durationMs={6000}
        onComplete={handleGenerationComplete}
      />

      {open && readyToOpen && generating && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-primary/30 bg-[#0a0a14] p-8 text-center shadow-[0_0_60px_-10px_hsl(var(--primary)/0.5)]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Tudo pronto!</h2>
            <p className="mt-2 text-sm text-blue-200/70">
              Seu prompt foi gerado e copiado. Clique no botão abaixo para abrir o Lovable e colar o comando.
            </p>
            <button
              onClick={handleOpenLovable}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-500 px-6 py-3.5 font-bold text-white shadow-[0_0_30px_rgba(36,99,235,0.45)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink className="h-5 w-5" />
              Clique aqui para finalizar
            </button>
            <button
              onClick={() => { setReadyToOpen(false); setGenerating(null); onClose(); }}
              className="mt-3 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIBuilderPicker;
