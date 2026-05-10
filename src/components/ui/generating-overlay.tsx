import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Code2, Cpu, ExternalLink, Sparkles, Zap } from "lucide-react";

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
  "→ finalizing premium prompt payload...",
  "→ transferring to lovable.dev...",
  "✓ handshake complete — opening editor",
];

const STAGES = [
  { icon: Sparkles, label: "Analisando seu nicho", sub: "Cruzando dados de conversão" },
  { icon: Code2, label: "Gerando prompt profissional", sub: "Estruturando arquitetura do site" },
  { icon: Cpu, label: "Otimizando para vendas", sub: "Aplicando gatilhos mentais" },
  { icon: Zap, label: "Conectando ao Lovable", sub: "Preparando seu acesso" },
  { icon: CheckCircle2, label: "Tudo pronto!", sub: "Finalização liberada" },
];

export const GeneratingOverlay = ({
  open,
  durationMs = 6000,
  onComplete,
  showButton = false,
  onButtonClick,
  onClose,
}: GeneratingOverlayProps) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setVisibleLines([]);
      setStageIndex(0);
      setProgress(0);
      finishedRef.current = false;
      return;
    }

    setVisibleLines([]);
    setStageIndex(0);
    setProgress(0);
    finishedRef.current = false;

    const startedAt = Date.now();
    const stageStep = durationMs / STAGES.length;
    const lineInterval = Math.max(140, durationMs / CODE_LINES.length);

    let lineIndex = 0;
    const lineTimer = window.setInterval(() => {
      setVisibleLines((prev) => {
        if (lineIndex >= CODE_LINES.length) return prev;
        const next = [...prev, CODE_LINES[lineIndex]];
        lineIndex += 1;
        return next;
      });
    }, lineInterval);

    const progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(nextProgress);
      setStageIndex(Math.min(STAGES.length - 1, Math.floor(elapsed / stageStep)));

      if (elapsed >= durationMs && !finishedRef.current) {
        finishedRef.current = true;
        setProgress(100);
        setStageIndex(STAGES.length - 1);
        window.clearInterval(progressTimer);
        window.clearInterval(lineTimer);
        onComplete?.();
      }
    }, 60);

    return () => {
      window.clearInterval(lineTimer);
      window.clearInterval(progressTimer);
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
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--primary) / 0.12) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.12) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <motion.div
            initial={{ scale: 0.98, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 12 }}
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
            className="relative z-10 w-full max-w-3xl"
          >
            <div className="mb-4 flex items-center gap-3 px-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 shadow-[0_0_30px_-5px_hsl(var(--primary))]">
                <StageIcon className="h-6 w-6 text-primary" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-foreground sm:text-xl">
                  {currentStage.label}
                  {!showButton && <span className="ml-1 inline-block animate-pulse">...</span>}
                </h3>
                <p className="text-xs text-muted-foreground sm:text-sm">{currentStage.sub}</p>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-2xl font-bold tabular-nums text-primary">{Math.round(progress)}%</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">processando</div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-primary/30 bg-card shadow-[0_0_60px_-10px_hsl(var(--primary)/0.45)]">
              <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/5 px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-destructive/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">axionfly-engine ~ generating</span>
              </div>

              <div className="relative h-64 overflow-hidden p-4 font-mono text-[12px] leading-relaxed text-foreground sm:h-72 sm:text-[13px]">
                <div className="flex flex-col gap-1">
                  {visibleLines.map((line, index) => (
                    <motion.div
                      key={`${line}-${index}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18 }}
                      className="break-all whitespace-pre-wrap"
                    >
                      <span className="mr-2 text-primary/70">›</span>
                      <span
                        className={
                          line.startsWith("✓")
                            ? "text-green-400"
                            : line.startsWith("→")
                              ? "text-sky-300"
                              : line.startsWith("$")
                                ? "text-violet-300"
                                : "text-foreground"
                        }
                      >
                        {line}
                      </span>
                    </motion.div>
                  ))}

                  {!showButton && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="ml-1 inline-block h-4 w-2 bg-primary align-middle"
                    />
                  )}
                </div>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-card to-transparent" />
              </div>

              <div className="h-1.5 overflow-hidden bg-primary/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-primary to-accent"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {!showButton ? (
              <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
                [ NÃO FECHE ESTA JANELA — preparando seu prompt ]
              </p>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex flex-col items-center gap-4"
              >
                <p className="max-w-xl text-center text-sm font-medium text-foreground/90">
                  Agora é só clicar no botão abaixo para finalizar seu site profissional no Lovable com a extensão de créditos infinitos.
                </p>

                <button
                  type="button"
                  onClick={onButtonClick}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-4 font-bold text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ExternalLink className="h-5 w-5" />
                  Finalizar meu site profissional
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
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
