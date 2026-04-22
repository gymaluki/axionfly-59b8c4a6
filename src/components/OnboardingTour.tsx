import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Sparkles, Search, Users, DollarSign, FileText, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "axionfly_onboarding_completed_v1";

interface Step {
  icon: React.ElementType;
  title: string;
  description: string;
  highlight: string;
}

const steps: Step[] = [
  {
    icon: Sparkles,
    title: "Bem-vindo à AxionFly! ✨",
    description:
      "Sua plataforma completa para criar sites com IA, prospectar clientes e fechar vendas. Vamos te mostrar rapidinho como cada ferramenta funciona.",
    highlight: "Vamos começar!",
  },
  {
    icon: Globe,
    title: "Criador de Sites com IA",
    description:
      "Responda algumas perguntas sobre o negócio do cliente e a IA gera um prompt otimizado. Depois é só escolher entre 20 plataformas (Lovable, Bolt, v0...) que abrem automaticamente com o prompt copiado.",
    highlight: "Crie sites profissionais em minutos",
  },
  {
    icon: Search,
    title: "Busca de Leads",
    description:
      "Encontre potenciais clientes por nicho e localização. A ferramenta usa IA para buscar empresas sem site ou com site ruim — perfeitas para você abordar.",
    highlight: "Prospecte sem esforço",
  },
  {
    icon: Users,
    title: "Área de Membros",
    description:
      "Acesse vídeo-aulas exclusivas com estratégias de vendas, scripts de abordagem e técnicas para fechar mais contratos.",
    highlight: "Aprenda com quem já fatura",
  },
  {
    icon: DollarSign,
    title: "Minhas Vendas",
    description:
      "Cadastre cada cliente fechado, acompanhe seu faturamento, status de pagamento e veja seu progresso mensal em tempo real.",
    highlight: "Controle financeiro completo",
  },
  {
    icon: FileText,
    title: "Contrato & Script",
    description:
      "Modelos prontos de contrato de prestação de serviço e scripts testados de abordagem por WhatsApp e ligação. Personalize e envie.",
    highlight: "Profissionalismo na hora",
  },
  {
    icon: User,
    title: "Meu Perfil",
    description:
      "Atualize seus dados, foto e configurações da conta. Tudo num só lugar.",
    highlight: "Pronto para começar?",
  },
];

interface OnboardingTourProps {
  userId?: string;
}

export const OnboardingTour = ({ userId }: OnboardingTourProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const key = `${STORAGE_KEY}_${userId}`;
    const completed = localStorage.getItem(key);
    if (!completed) {
      // Pequeno delay para a UI carregar antes
      const t = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(t);
    }
  }, [userId]);

  const finish = () => {
    if (userId) {
      localStorage.setItem(`${STORAGE_KEY}_${userId}`, "true");
    }
    setOpen(false);
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const current = steps[step];
  const Icon = current.icon;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 backdrop-blur-md p-4"
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Top progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-secondary">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Close (skip) */}
            <button
              onClick={finish}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Pular tutorial"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="p-8 pt-12 space-y-6">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)]"
              >
                <Icon className="w-8 h-8 text-primary-foreground" />
              </motion.div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  Passo {step + 1} de {steps.length}
                </span>
                <h2 className="text-2xl font-bold text-foreground">{current.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {current.description}
                </p>
              </div>

              <div className="px-4 py-3 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  {current.highlight}
                </p>
              </div>

              {/* Dots */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === step ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground"
                    }`}
                    aria-label={`Ir para passo ${i + 1}`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prev}
                  disabled={step === 0}
                  className="gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>

                <button
                  onClick={finish}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pular tutorial
                </button>

                <Button variant="neon" size="sm" onClick={next} className="gap-1">
                  {step === steps.length - 1 ? "Começar" : "Próximo"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;
