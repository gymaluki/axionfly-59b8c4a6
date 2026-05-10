import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Code2, Cpu, Zap, CheckCircle2, ExternalLink } from "lucide-react";

interface GeneratingOverlayProps {
  open: boolean;
  durationMs?: number;
  onComplete?: () => void;
  showButton?: boolean;
  onButtonClick?: () => void;
  onClose?: () => void;
}

const CODE_LINES = [
  "$ initializing axionfly engine...",
  "→ loading neural prompt model v3.2",
  "✓ context window: 128k tokens ready",
  "import { LovableAI } from '@axionfly/core';",
  "const project = new LovableAI({ tier: 'pro' });",
  "→ analyzing niche keywords...",
  "→ optimizing conversion structure...",
  "✓ landing sections: hero, features, cta",
  "→ generating responsive layout grid...",
  "→ injecting framer-motion animations...",
  "✓ tailwind tokens compiled",
  "→ wiring supabase auth + database...",
  "→ deploying edge functions...",
  "✓ SEO metadata generated",
  "✓ pixel tracking configured",
  "→ finalizing premium prompt payload...",
  "→ transferring to lovable.dev...",
  "✓ handshake complete — opening editor",
];

const STAGES = [
  { icon: Sparkles, label: "Analisando seu nicho", sub: "Cruzando dados de conversão" },
  { icon: Code2, label: "Gerando prompt profissional", sub: "Estruturando arquitetura do site" },
  { icon: Cpu, label: "Otimizando para vendas", sub: "Aplicando gatilhos mentais" },
  { icon: Zap, label: "Conectando ao Lovable", sub: "Abrindo editor com seu projeto" },
  { icon: CheckCircle2, label: "Tudo pronto!", sub: "Cole o prompt (Ctrl+V) e publique" },
];

export const GeneratingOverlay = ({ 
  open, 
  durationMs = 6000, 
  onComplete,
  showButton = false,
  onButtonClick,
  onClose
}: GeneratingOverlayProps) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setVisibleLines([]);
      setStageIndex(0);
      setProgress(0);
      return;
    }

    const start = Date.now();
    const stageStep = durationMs / STAGES.length;
    const lineInterval = Math.max(120, durationMs / CODE_LINES.length);

    let lineIdx = 0;
    const lineTimer = window.setInterval(() => {
      if (lineIdx < CODE_LINES.length) {
        setVisibleLines((prev) => [...prev, CODE_LINES[lineIdx]]);
        lineIdx++;
      }
    }, lineInterval);

    const progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(pct);
      setStageIndex(Math.min(STAGES.length - 1, Math.floor(elapsed / stageStep)));
      if (elapsed >= durationMs) {
        window.clearInterval(progressTimer);
      }
    }, 60);

    const finishTimer = window.setTimeout(() => {
      onComplete?.();
    }, durationMs);

    return () => {
      window.clearInterval(lineTimer);
      window.clearInterval(progressTimer);
      window.clearTimeout(finishTimer);
    };
  }, [open, durationMs, onComplete]);

  const currentStage = STAGES[stageIndex];
  const StageIcon = currentStage.icon;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
        >
          {/* Animated grid bg */}
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            }}
          />
          {/* Glow orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/30 blur-[120px] pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/30 blur-[120px] pointer-events-none"
          />

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            className="relative z-10 w-full max-w-3xl select-none"
          >
            {/* Status header */}
            <div className="mb-4 flex items-center gap-3 px-1">
              <motion.div
                key={stageIndex}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-[0_0_30px_-5px_hsl(var(--primary))]"
              >
                <StageIcon className="w-6 h-6 text-primary" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.h3
                  key={`label-${stageIndex}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg sm:text-xl font-bold text-white truncate"
                >
                  {currentStage.label}
                  <span className="inline-block ml-1 animate-pulse">...</span>
                </motion.h3>
                <motion.p
                  key={`sub-${stageIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs sm:text-sm text-blue-300/80 truncate"
                >
                  {currentStage.sub}
                </motion.p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-mono font-bold text-primary tabular-nums">
                  {Math.round(progress)}%
                </div>
                <div className="text-[10px] uppercase tracking-widest text-blue-300/60">processando</div>
              </div>
            </div>

            {/* Terminal */}
            <div className="rounded-2xl border border-primary/30 bg-black/80 shadow-[0_0_60px_-10px_hsl(var(--primary)/0.5)] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-transparent">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs font-mono text-blue-300/70">axionfly-engine ~ generating</span>
              </div>
              <div className="h-64 sm:h-72 overflow-hidden p-4 font-mono text-[12px] sm:text-[13px] leading-relaxed text-blue-100/90 relative">
                <div className="flex flex-col-reverse">
                  <div>
                    {visibleLines.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-pre-wrap break-all"
                      >
                        <span className="text-primary/70 mr-2 select-none">›</span>
                        <span className={
                          line.startsWith("✓") ? "text-green-400" :
                          line.startsWith("→") ? "text-blue-300" :
                          line.startsWith("$") ? "text-purple-300" :
                          "text-blue-100/90"
                        }>{line}</span>
                      </motion.div>
                    ))}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-2 h-4 bg-primary align-middle ml-1"
                    />
                  </div>
                </div>
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/90 to-transparent pointer-events-none" />
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-primary/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-blue-400 to-primary shadow-[0_0_10px_hsl(var(--primary))]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
            </div>

            {!showButton ? (
              <p className="mt-4 text-center text-xs text-blue-300/60 font-mono">
                [ NÃO FECHE ESTA JANELA — preparando seu prompt ]
              </p>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex flex-col items-center gap-4"
              >
                <div className="text-center">
                  <p className="text-sm text-blue-200/90 font-medium">
                    Agora é só clicar no botão abaixo para finalizar seu site profissional no Lovable com a extensão de créditos infinitos.
                  </p>
                </div>
                <button
                  onClick={onButtonClick}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-blue-500 px-6 py-4 font-bold text-white shadow-[0_0_30px_rgba(36,99,235,0.45)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ExternalLink className="h-5 w-5" />
                  Finalizar meu site profissional
                </button>
                <button
                  onClick={onClose}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors"
                >
                  Fechar
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GeneratingOverlay;