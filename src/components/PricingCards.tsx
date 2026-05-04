import React, { useState } from "react";
import { motion, type Easing, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ChevronDown, ShieldCheck, Zap } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = async () => {
    const checkoutUrl = resolveCheckoutUrl(plan);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast.info("Crie sua conta primeiro para garantir o acesso ao plano!");
      navigate(`/auth?redirect_payment=${encodeURIComponent(checkoutUrl)}`);
      return;
    }
    window.location.href = checkoutUrl;
  };

  const visibleFeatures = isExpanded ? features : features.slice(0, 5);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -10, transition: hoverTransition }}
      className={`relative flex w-full max-w-sm flex-col rounded-3xl p-8 transition-all duration-500 border-2 ${
        isHighlight 
          ? "border-primary shadow-[0_0_40px_rgba(37,99,235,0.2)] scale-[1.05] z-10 bg-gradient-to-b from-primary/10 to-card" 
          : savingsBadge 
            ? "border-primary/40 shadow-[0_0_20px_rgba(37,99,235,0.1)] bg-card"
            : "border-border/50 bg-card/50"
      }`}
    >
      {isHighlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span className="shimmer-button inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-1.5 text-xs font-black text-primary-foreground shadow-xl uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 fill-current" />
            🏆 Melhor Valor
          </span>
        </div>
      )}

      {savingsBadge && !isHighlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span className="shimmer-button inline-flex items-center gap-1.5 rounded-full bg-primary/80 px-6 py-1.5 text-xs font-black text-primary-foreground shadow-xl uppercase tracking-widest">
            {savingsBadge}
          </span>
        </div>
      )}

      <div className="mb-8 text-center space-y-2">
        <h3 className="text-2xl font-black text-foreground">{planName}</h3>
        <p className="text-sm font-medium text-muted-foreground">{description}</p>
      </div>

      <div className="mb-8 text-center">
        {comparePrice && (
          <div className="mb-1 text-sm text-muted-foreground/60">
            <span className="line-through">{comparePrice}</span>
          </div>
        )}
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-black text-foreground tracking-tighter">
            {price}
          </span>
          <span className="text-sm font-bold text-primary uppercase tracking-widest">{priceDescription}</span>
        </div>
        {plan === "quarterly" && (
          <p className="mt-2 text-xs font-black text-primary uppercase tracking-wider">
            Economize R$ 105,80
          </p>
        )}
      </div>

      <div className="flex-1 mb-8">
        <ul className="space-y-4">
          <AnimatePresence>
            {visibleFeatures.map((feature, idx) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-3 text-sm text-foreground/90 font-bold"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
                  <Check className="h-3 w-3 text-primary stroke-[3px]" />
                </div>
                <span>{feature}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        
        {features.length > 5 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-6 flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            {isExpanded ? "Ver menos" : "Ver todos os recursos"}
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <Button 
          variant={isHighlight ? "neon" : "outline"} 
          size="xl" 
          className={`w-full rounded-full font-black uppercase tracking-[0.2em] text-xs h-14 ${isHighlight ? "shimmer-button" : "border-2"}`} 
          onClick={handleClick}
        >
          {buttonText}
        </Button>
        
        <div className="flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
          <SiPix className="h-6 w-6" />
          <FaCcMastercard className="h-7 w-7" />
          <FaCcVisa className="h-7 w-7" />
          <FaBarcode className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

export default function PricingCards() {
  const sharedFeatures = [
    "Criador de Sites com IA (20+ nichos)",
    "Extensão Lovable (Sites Infinitos)",
    "Prospecção automática via Google Maps",
    "Parceria Hyperbuild Pro (Grátis)",
    "Gerador de contrato automático",
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
