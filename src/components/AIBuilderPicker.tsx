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
  const [generating, setGenerating] = useState<{ url: string; win: Window | null } | null>(null);
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

    // Persiste o prompt para qualquer fallback
    try {
      sessionStorage.setItem("axionfly_lovable_prompt", normalizedPrompt);
      localStorage.setItem("axionfly_lovable_prompt", normalizedPrompt);
    } catch {
      /* noop */
    }

    // URL final com o prompt embutido — Lovable lê e cola automaticamente,
    // assim o usuário NÃO precisa autorizar área de transferência no lovable.dev
    const targetUrl = `${LOVABLE_BASE_URL}?prompt=${encodeURIComponent(normalizedPrompt)}`;

    // Cópia (síncrona + Clipboard API) como reforço
    const okSync = copySync(normalizedPrompt);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(normalizedPrompt).catch(() => {});
    }

    // Pré-abre aba em branco usando o gesto que originou o open=true
    const newWindow = window.open("about:blank", "_blank");
    if (newWindow) {
      try {
        newWindow.opener = null;
        newWindow.document.write(`
          <html><head><title>Abrindo Lovable...</title><style>
            body{margin:0;background:#000;color:#60a5fa;font-family:ui-monospace,Menlo,monospace;
            display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px}
            .spinner{width:48px;height:48px;border:3px solid rgba(96,165,250,.2);border-top-color:#60a5fa;
            border-radius:50%;animation:s 1s linear infinite}
            @keyframes s{to{transform:rotate(360deg)}}
          </style></head><body>
            <div class="spinner"></div>
            <div>Preparando seu projeto no Lovable...</div>
          </body></html>
        `);
      } catch {
        /* noop */
      }
    }

    if (okSync) {
      toast.success("Prompt pronto! Abrindo Lovable...");
    }

    setGenerating({ url: targetUrl, win: newWindow });
  }, [open, normalizedPrompt, onClose]);

  const handleGenerationComplete = () => {
    if (generating) {
      try {
        if (generating.win && !generating.win.closed) {
          generating.win.location.href = generating.url;
        } else {
          window.open(generating.url, "_blank", "noopener,noreferrer");
        }
      } catch {
        window.open(generating.url, "_blank", "noopener,noreferrer");
      }
    }
    setGenerating(null);
    onClose();
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
