import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GeneratingOverlay } from "@/components/ui/generating-overlay";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const LOVABLE_BASE_URL = "https://lovable.dev/invite/4QDCZAZ";

interface AIBuilderPickerProps {
  open: boolean;
  onClose: () => void;
  prompt: string;
  siteName?: string;
  niche?: string;
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

export const AIBuilderPicker = ({ open, onClose, prompt, siteName, niche }: AIBuilderPickerProps) => {
  const { user } = useAuth();
  const normalizedPrompt = prompt.trim();
  const [readyToOpen, setReadyToOpen] = useState(false);
  const hasInitializedRef = useRef(false);

  const targetUrl = useMemo(() => {
    if (!normalizedPrompt) return "";
    return `${LOVABLE_BASE_URL}?prompt=${encodeURIComponent(normalizedPrompt)}`;
  }, [normalizedPrompt]);

  useEffect(() => {
    if (!open) {
      hasInitializedRef.current = false;
      setReadyToOpen(false);
      return;
    }

    if (hasInitializedRef.current || !normalizedPrompt) {
      return;
    }

    hasInitializedRef.current = true;
    setReadyToOpen(false);

    try {
      sessionStorage.setItem("axionfly_lovable_prompt", normalizedPrompt);
      localStorage.setItem("axionfly_lovable_prompt", normalizedPrompt);
    } catch {}

    copySync(normalizedPrompt);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(normalizedPrompt).catch(() => {});
    }
  }, [open, normalizedPrompt]);

  const handleGenerationComplete = useCallback(() => {
    setReadyToOpen(true);
  }, []);

  const handleOpenLovable = useCallback(async () => {
    if (user && targetUrl) {
      try {
        const { error } = await supabase.from("user_sites").insert({
          user_id: user.id,
          site_name: siteName || "Meu Site Profissional",
          niche: niche || "Geral",
          url: targetUrl,
        });
        
        if (error) {
          console.error("Error saving site:", error);
        }
      } catch (err) {
        console.error("Failed to save site to profile:", err);
      }
    }

    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
    setReadyToOpen(false);
    hasInitializedRef.current = false;
    onClose();
  }, [onClose, targetUrl, user, siteName, niche]);

  const handleClose = useCallback(() => {
    setReadyToOpen(false);
    hasInitializedRef.current = false;
    onClose();
  }, [onClose]);

  return (
    <GeneratingOverlay
      open={open && Boolean(normalizedPrompt)}
      durationMs={6000}
      onComplete={handleGenerationComplete}
      showButton={readyToOpen}
      onButtonClick={handleOpenLovable}
      onClose={handleClose}
    />
  );
};

export default AIBuilderPicker;
