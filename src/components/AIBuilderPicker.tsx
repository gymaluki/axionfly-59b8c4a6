import { useEffect, useRef, useState } from "react";
import { GeneratingOverlay } from "@/components/ui/generating-overlay";
import { ExternalLink, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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
        open={open && generating !== null}
        durationMs={8000}
        onComplete={handleGenerationComplete}
        showButton={readyToOpen}
        onButtonClick={handleOpenLovable}
        onClose={onClose}
      />

    </>
  );
};

export default AIBuilderPicker;
