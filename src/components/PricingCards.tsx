import { motion, type Easing } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiPix } from "react-icons/si";
import { FaCcMastercard, FaCcVisa, FaBarcode } from "react-icons/fa";
import googleMapsLogo from "@/assets/google-maps-logo.png";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { resolveCheckoutUrl } from "@/lib/affiliates";

const ease: Easing = [0.16, 1, 0.3, 1];
const hoverTransition = { type: "tween" as const, duration: 0.12, ease: "easeOut" as const };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease },
  }),
};

interface PricingCardProps {
  planName: string;
  description: string;
  price: string;
  priceDescription: string;
  features: string[];
  isHighlight?: boolean;
  buttonText: string;
  plan: "monthly" | "quarterly" | "lifetime";
  index: number;
  savingsBadge?: string;
  comparePrice?: string;
}

function PricingCard({
  planName,
  description,
  price,
  priceDescription,
  features,
  isHighlight,
  buttonText,
  plan,
  index,
  savingsBadge,
  comparePrice,
}: PricingCardProps) {
  const navigate = useNavigate();

  const handleClick = async () => {
    // Resolve dinamicamente: usa link do afiliado ativo (se houver) ou o padrão
    const checkoutUrl = resolveCheckoutUrl(plan);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast.info("Crie sua conta primeiro para garantir o acesso ao plano!");
      navigate(`/auth?redirect_payment=${encodeURIComponent(checkoutUrl)}`);
      return;
    }

    // User is logged in, redirect to payment
    window.location.href = checkoutUrl;
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={index}
      whileHover={{ scale: 1.03, y: -6, transition: hoverTransition }}
      className={`relative flex w-full max-w-sm flex-col rounded-2xl p-6 sm:p-8 transition-transform duration-150 neon-border glow-blue will-change-transform ${isHighlight ? "ring-2 ring-primary/60" : ""}`}
      style={{
        backgroundColor: "hsl(var(--card))",
        backgroundImage: "radial-gradient(at 0% 100%, hsl(220 70% 35% / 0.1) 0px, transparent 60%), radial-gradient(at 100% 100%, hsl(220 70% 50% / 0.08) 0px, transparent 60%)",
      }}
    >
      {isHighlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-lg whitespace-nowrap">
            <Sparkles className="h-3 w-3" />
            Mais Escolhido
          </span>
        </div>
      )}

      {savingsBadge && !isHighlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30 whitespace-nowrap">
            {savingsBadge}
          </span>
        </div>
      )}

      <div className="mb-6 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">{planName}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <ul className="flex-1 space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {features.map((feature, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.03, duration: 0.3, ease }}
            className="flex items-start gap-3 text-sm text-foreground font-medium"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
              <Check className="h-3 w-3 text-primary" />
            </div>
            <span className="leading-snug">{feature}</span>
          </motion.li>
        ))}
      </ul>

      <div className="mb-6 text-center">
        {comparePrice && (
          <div className="mb-1 text-sm text-muted-foreground">
            <span className="line-through">{comparePrice}</span>{" "}
            <span className="text-xs">no mensal</span>
          </div>
        )}
        <div className="flex items-baseline justify-center gap-2 flex-nowrap">
          <span className="text-4xl sm:text-5xl font-black gradient-text whitespace-nowrap">
            {price}
          </span>
          <span className="text-base sm:text-lg font-bold text-primary whitespace-nowrap">{priceDescription}</span>
        </div>
        {plan === "quarterly" && (
          <p className="mt-2 text-xs font-semibold text-green-500">
            Equivale a R$ 32,63/mês • Economize R$ 105,80
          </p>
        )}
        <div className="mt-3 flex items-center justify-center gap-3 text-muted-foreground/70">
          <SiPix className="h-5 w-5" />
          <FaCcMastercard className="h-6 w-6" />
          <FaCcVisa className="h-6 w-6" />
          <FaBarcode className="h-5 w-5" />
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.02, transition: hoverTransition }} whileTap={{ scale: 0.98, transition: hoverTransition }}>
        <Button variant="neon" size="lg" className="w-full text-base" onClick={handleClick}>
          {buttonText}
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function PricingCards() {
  const sharedFeatures = [
    "Criador de Sites com IA (20+ nichos)",
    "Estratégia para criar sites infinitos",
    "Prospecção automática via Google Maps",
    "Gerador de contrato profissional",
    "Script de vendas pronto para WhatsApp",
    "Dashboard de acompanhamento de lucros",
    "Parceria oficial com Lovable",
    "Suporte prioritário",
    "6 estilos de design exclusivos",
    "Todas as atualizações futuras incluídas",
  ];

  const plans: PricingCardProps[] = [
    {
      planName: "Plano Mensal",
      description: "Para quem quer testar sem compromisso",
      price: "R$ 67,90",
      priceDescription: "/ mês",
      features: sharedFeatures,
      buttonText: "Escolher este plano",
      plan: "monthly",
      isHighlight: false,
      index: 1,
    },
    {
      planName: "Plano Trimestral",
      description: "3 meses com desconto",
      price: "R$ 97,90",
      priceDescription: "/ trimestre",
      features: sharedFeatures,
      buttonText: "Escolher este plano",
      plan: "quarterly",
      isHighlight: false,
      index: 2,
      savingsBadge: "Economize 52%",
      comparePrice: "R$ 203,70",
    },
    {
      planName: "Plano Vitalício",
      description: "Pague uma vez. Use para sempre.",
      price: "R$ 127,90",
      priceDescription: "/ custo único",
      features: sharedFeatures,
      buttonText: "Escolher este plano",
      plan: "lifetime",
      isHighlight: true,
      index: 3,
    },
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 py-10 md:py-20">
      <div className="mb-8 flex justify-center">
        <span className="inline-flex items-center rounded-full border border-border bg-card/80 px-5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
          Planos
        </span>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="mb-14 space-y-5 text-center"
      >
        <h2 className="text-3xl font-black tracking-tight text-foreground md:text-6xl leading-tight">
          Comece de forma simples.{" "}
          <br className="hidden md:block" />
          Escale com <span className="gradient-text">sites prontos e prospecção automática</span>
        </h2>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          Escolha o plano ideal para você e comece seu negócio com liberdade para crescer ainda mais.
        </p>
      </motion.div>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-8 px-2 sm:px-0 lg:flex-row lg:items-stretch">
        {plans.map((plan) => (
          <PricingCard key={plan.planName} {...plan} />
        ))}
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={3}
        className="mt-14 flex flex-col items-center gap-4"
      >
        <p className="text-sm text-muted-foreground font-medium">Parcerias oficiais</p>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-5 py-2.5 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Lovable</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-5 py-2.5 backdrop-blur-sm">
            <img src={googleMapsLogo} alt="Google Maps" className="h-5 w-5 object-contain" />
            <span className="text-sm font-semibold text-foreground">Google Maps</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
