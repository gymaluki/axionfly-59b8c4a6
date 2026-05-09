import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { GeneratingOverlay } from "@/components/ui/generating-overlay";

const LOVABLE_BASE_URL = "https://lovable.dev/invite/4QDCZAZ";

interface AIBuilderPickerProps {
  open: boolean;
  onClose: () => void;
  prompt: string;
}

// Copia SÍNCRONA via textarea + execCommand — funciona em iframe/preview
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
  const startedRef = useRef(false);

  // Auto-dispara o fluxo assim que abre — sem tela intermediária
  useEffect(() => {
    if (!open) {
      startedRef.current = false;
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    if (!normalizedPrompt) {
      toast.error("O prompt ainda não foi gerado. Gere o site novamente para continuar.");
      onClose();
      return;
    }

    try {
      sessionStorage.setItem("axionfly_lovable_prompt", normalizedPrompt);
      localStorage.setItem("axionfly_lovable_prompt", normalizedPrompt);
    } catch {
      /* noop */
    }

    // URL final com prompt embutido — Lovable cola sozinho, sem prompt de clipboard
    const targetUrl = `${LOVABLE_BASE_URL}?prompt=${encodeURIComponent(normalizedPrompt)}`;

    // Cópia como reforço (caso a URL fique grande demais)
    copySync(normalizedPrompt);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(normalizedPrompt).catch(() => {});
    }

    setGenerating(targetUrl);
  }, [open, normalizedPrompt, onClose]);

  const handleGenerationComplete = () => {
    const url = generating;
    setGenerating(null);
    onClose();
    if (url) {
      // Tenta abrir em nova aba primeiro (pode ser bloqueado se não for trigger direto do usuário)
      // Como estamos vindo de um timeout (onComplete do overlay), o navegador costuma bloquear.
      const win = window.open(url, "_blank", "noopener,noreferrer");
      
      // Fallback: se for bloqueado ou se o usuário estiver no iframe, navegamos na mesma aba
      if (!win) {
        window.location.assign(url);
      }
    }
  };

  return (
    <GeneratingOverlay
      open={open && generating !== null}
      durationMs={6000}
      onComplete={handleGenerationComplete}
    />
  );
};

export default AIBuilderPicker;
