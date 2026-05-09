import { useEffect, useRef, useState } from "react";
import { GeneratingOverlay } from "@/components/ui/generating-overlay";

const LOVABLE_BASE_URL = "https://lovable.dev/projects/05dc5255-abe9-4867-8917-0cab3eafda1b";

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
  const [needsManualOpen, setNeedsManualOpen] = useState(false);
  const startedRef = useRef(false);
  const popupRef = useRef<Window | null>(null);

  useEffect(() => {
    if (!open) {
      startedRef.current = false;
      popupRef.current = null;
      setNeedsManualOpen(false);
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

    // Abre a nova aba IMEDIATAMENTE (ainda dentro da janela do gesto do usuário).
    // Mantemos ela em about:blank até a animação terminar — aí redirecionamos.
    try {
      popupRef.current = window.open("about:blank", "_blank", "noopener,noreferrer");
    } catch {
      popupRef.current = null;
    }

    setGenerating(targetUrl);
  }, [open, normalizedPrompt, onClose]);

  const handleGenerationComplete = () => {
    const url = generating;
    if (!url) {
      onClose();
      return;
    }

    const popup = popupRef.current;
    if (popup && !popup.closed) {
      try {
        popup.location.href = url;
        popupRef.current = null;
        setGenerating(null);
        onClose();
        return;
      } catch {
        // cross-origin block — cai pro fallback
      }
    }

    // Fallback: tenta abrir agora (pode ser bloqueado, então oferece botão manual)
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (win) {
      setGenerating(null);
      onClose();
    } else {
      // Popup bloqueado — mostra botão "Abrir Lovable" pro usuário clicar
      setNeedsManualOpen(true);
    }
  };

  const handleManualOpen = () => {
    if (generating) {
      window.open(generating, "_blank", "noopener,noreferrer");
    }
    setGenerating(null);
    setNeedsManualOpen(false);
    onClose();
  };

  if (open && needsManualOpen && generating) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-[#0d0d14] border border-white/10 rounded-2xl p-8 max-w-md mx-4 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Abrir no Lovable</h2>
          <p className="text-sm text-[#9ca3af]">
            Seu navegador bloqueou a abertura automática. Clique abaixo para continuar no Lovable.
          </p>
          <button
            onClick={handleManualOpen}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#4f6ef7] to-[#7b5cff] text-white font-bold shadow-[0_0_30px_rgba(79,110,247,0.45)] hover:scale-[1.02] transition-transform"
          >
            Abrir Lovable em nova aba
          </button>
        </div>
      </div>
    );
  }

  return (
    <GeneratingOverlay
      open={open && generating !== null && !needsManualOpen}
      durationMs={6000}
      onComplete={handleGenerationComplete}
    />
  );
};

export default AIBuilderPicker;
