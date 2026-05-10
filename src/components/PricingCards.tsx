import React, { useState, useRef, useEffect } from "react";
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

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const difference = tomorrow.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, "0");

  return (
    <span className="inline-flex items-center gap-0.5">
      <span>{format(timeLeft.hours)}</span>
      <span className="opacity-50 text-[8px]">:</span>
      <span>{format(timeLeft.minutes)}</span>
      <span className="opacity-50 text-[8px]">:</span>
      <span>{format(timeLeft.seconds)}</span>
    </span>
  );
};

const ease: Easing = [0.16, 1, 0.3, 1];
const hoverTransition = { type: "tween" as const, duration: 0.12, ease: "easeOut" as const };

// useCountUp removed as requested to make prices static

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

function PriceCounter({ price }: { price: string }) {
  const displayPrice = price.replace("R$ ", "");
  return <span>{displayPrice}</span>;
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
      className={`relative flex w-full max-w-sm flex-col rounded-3xl px-6 pb-6 pt-12 sm:px-8 sm:pb-8 sm:pt-8 transition-all duration-500 border-2 ${
        isHighlight 
          ? "border-primary shadow-[0_0_40px_rgba(37,99,235,0.2)] lg:scale-[1.05] z-10 bg-gradient-to-b from-primary/10 to-card" 
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
        <div className="flex flex-col items-center justify-center gap-1 mb-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-wider">
              Promoção de Aniversário
            </span>
            <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full border border-white/5">
              <span className="text-[9px] font-bold text-white/50 uppercase">Expira em:</span>
              <div className="text-[10px] font-black text-white">
                <CountdownTimer />
              </div>
            </div>
          </div>
        </div>

        {comparePrice && (
          <div className="mb-2 flex flex-col items-center gap-1.5 justify-center">
            <span className="text-sm text-muted-foreground/60 line-through">{comparePrice}</span>
            <span className="text-primary font-black text-[11px] bg-primary/10 px-3 py-1 rounded-full border border-primary/20 uppercase tracking-wider">70% OFF</span>
          </div>
        )}
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter">
            R$ <PriceCounter price={price} />
          </span>
          <span className="text-sm font-bold text-primary uppercase tracking-widest">{priceDescription}</span>
        </div>
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
    "Prospecção automática Brasil via Google Maps",
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
      description: "Acesso total à plataforma (Promoção de Aniversário)",
      price: "R$ 67,90",
      comparePrice: "R$ 226,33",
      priceDescription: "/ mês",
      features: sharedFeatures,
      buttonText: "Aproveitar 70% OFF",
      plan: "monthly",
      isHighlight: false,
      savingsBadge: "70% OFF",
      index: 1,
    },
    {
      planName: "Plano Vitalício",
      description: "Pague uma única vez (Oferta Limitada 1 Ano)",
      price: "R$ 97,90",
      comparePrice: "R$ 326,33",
      priceDescription: "/ custo único",
      features: sharedFeatures,
      buttonText: "Garantir Vitalício com 70% OFF",
      plan: "lifetime",
      isHighlight: true,
      index: 2,
    },
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden">
      <SectionPill>Investimento Inteligente</SectionPill>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="mb-20 space-y-6 text-center"
      >
        <h2 className="text-3xl md:text-[44px] font-black tracking-tight text-foreground leading-[1.1]">
          O plano ideal para <br />
          seu <span className="gradient-text">próximo nível</span>
        </h2>
        <p className="mx-auto max-w-2xl text-[18px] md:text-[20px] text-[#94a3b8] font-normal leading-[1.7]">
          Sem taxas escondidas. Sem letras miúdas. Acesso imediato a todas as ferramentas após a confirmação.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-8 lg:gap-6 mb-20 px-4 md:px-0 w-full overflow-x-auto pb-8 snap-x snap-mandatory lg:overflow-visible no-scrollbar">
        {plans.map((plan) => (
          <div key={plan.planName} className="w-full max-w-sm shrink-0 snap-center lg:w-1/3">
            <PricingCard {...plan} />
          </div>
        ))}
      </div>

      {/* Guarantee Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto p-6 rounded-2xl border border-primary/20 bg-primary/5 flex flex-wrap items-center justify-center gap-8 md:gap-12"
      >
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-primary" />
          <span className="text-sm font-black uppercase tracking-widest text-foreground">Acesso Imediato</span>
        </div>
        <div className="flex items-center gap-3">
          <Check className="w-6 h-6 text-primary" />
          <span className="text-sm font-black uppercase tracking-widest text-foreground">Suporte 24/7</span>
        </div>
      </motion.div>
    </section>
  );
}

function SectionPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center mb-8">
      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-6 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-[#94a3b8] shadow-sm backdrop-blur-sm">
        {children}
      </span>
    </div>
  );
}
