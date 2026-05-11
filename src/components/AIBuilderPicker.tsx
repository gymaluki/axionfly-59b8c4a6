import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GeneratingOverlay } from "@/components/ui/generating-overlay";
import { supabase } from "@/integrations/supabase/client";

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
  const [readyToOpen, setReadyToOpen] = useState(false);
  const hasInitializedRef = useRef(false);

  const targetUrl = useMemo(() => {
    if (!normalizedPrompt) return "";
    return `${LOVABLE_BASE_URL}?prompt=${encodeURIComponent(normalizedPrompt)}`;
  }, [normalizedPrompt]);

  const saveSiteToHistory = useCallback(async () => {
    if (!normalizedPrompt || !targetUrl) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Extract a name from the prompt if possible, or use a default
      let siteName = "Meu Site Profissional";
      const nameMatch = normalizedPrompt.match(/chamada ["']([^"']+)["']/i);
      if (nameMatch && nameMatch[1]) {
        siteName = nameMatch[1];
      }

      await supabase.from("user_sites").insert({
        user_id: user.id,
        prompt: normalizedPrompt,
        url: targetUrl,
        site_name: siteName
      });
    } catch (error) {
      console.error("Error saving site to history:", error);
    }
  }, [normalizedPrompt, targetUrl]);

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

    // Save to database as soon as it's initialized
    saveSiteToHistory();
  }, [open, normalizedPrompt, saveSiteToHistory]);

  const handleGenerationComplete = useCallback(() => {
    setReadyToOpen(true);
  }, []);

  const handleOpenLovable = useCallback(() => {
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
    setReadyToOpen(false);
    hasInitializedRef.current = false;
    onClose();
  }, [onClose, targetUrl]);

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
