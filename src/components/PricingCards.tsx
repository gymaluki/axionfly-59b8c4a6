import React, { useState, useRef, useEffect } from "react";
import { motion, type Easing, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ChevronDown, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
// Inline payment icons (replaced react-icons to keep bundle small)
const SiPix = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M5.283 18.36a3.5 3.5 0 0 0 2.493-1.032l3.6-3.6a.5.5 0 0 1 .7 0l3.6 3.6a3.5 3.5 0 0 0 2.493 1.032h.708l-4.6 4.6a3 3 0 0 1-4.243 0l-4.6-4.6h.849zm13.394-12.72a3.5 3.5 0 0 0-2.493 1.032l-3.6 3.6a.51.51 0 0 1-.7 0l-3.6-3.6A3.5 3.5 0 0 0 5.84 5.64h-.85l4.6-4.6a3 3 0 0 1 4.243 0l4.6 4.6h-.85zM1.04 10.36l2.84-2.84h1.41a2.5 2.5 0 0 1 1.768.732l3.6 3.6a1.5 1.5 0 0 0 2.121 0l3.6-3.6a2.5 2.5 0 0 1 1.768-.732h1.4l2.85 2.84a3 3 0 0 1 0 4.243l-2.85 2.84h-1.4a2.5 2.5 0 0 1-1.768-.732l-3.6-3.6a1.5 1.5 0 0 0-2.121 0l-3.6 3.6a2.5 2.5 0 0 1-1.768.732H3.88l-2.84-2.84a3 3 0 0 1 0-4.243z" />
  </svg>
);
const FaCcMastercard = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 576 512" fill="currentColor" aria-hidden="true">
    <path d="M482.9 410.3c0 6.8-4.6 11.7-11.2 11.7-6.8 0-11.2-5.2-11.2-11.7 0-6.5 4.4-11.7 11.2-11.7 6.6 0 11.2 5.2 11.2 11.7zm-310.8-11.7c-7.1 0-11.2 5.2-11.2 11.7 0 6.5 4.1 11.7 11.2 11.7 6.5 0 10.9-4.9 10.9-11.7-.1-6.5-4.4-11.7-10.9-11.7zm117.5-.3c-5.4 0-8.7 3.5-9.5 8.7h19.1c-.9-5.7-4.4-8.7-9.6-8.7zm107.8.3c-6.8 0-10.9 5.2-10.9 11.7 0 6.5 4.1 11.7 10.9 11.7 6.8 0 11.2-4.9 11.2-11.7 0-6.5-4.4-11.7-11.2-11.7zm105.9 26.1c0 .3.3.5.3 1.1 0 .3-.3.5-.3 1.1-.3.3-.3.5-.5.8-.3.3-.5.5-1.1.5-.3.3-.5.3-1.1.3-.3 0-.5 0-1.1-.3-.3 0-.5-.3-.8-.5-.3-.3-.5-.5-.5-.8-.3-.5-.3-.8-.3-1.1 0-.5 0-.8.3-1.1 0-.5.3-.8.5-1.1.3-.3.5-.3.8-.5.5-.3.8-.3 1.1-.3.5 0 .8 0 1.1.3.5.3.8.3 1.1.5s.2.6.5 1.1zm-2.2 1.4c.5 0 .5-.3.8-.3.3-.3.3-.5.3-.8 0-.3 0-.5-.3-.8-.3 0-.5-.3-1.1-.3h-1.6v3.5h.8V427h.3l1.1 1.4h.8l-1.1-1.3zM576 81v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V81c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM64 220.6c0 76.5 62.1 138.5 138.5 138.5 27.2 0 53.9-8.2 76.5-23.1-72.9-59.3-72.4-171.2 0-230.5-22.6-15-49.3-23.1-76.5-23.1-76.4-.1-138.5 62-138.5 138.2zm224 108.8c70.5-55 70.2-162.2 0-217.5-70.2 55.3-70.5 162.6 0 217.5zm-142.3 76.3c0-11.4-7.6-19.1-19.6-19.4-6.2 0-12.8 1.9-17.4 8.7-3.5-5.7-9-8.7-16.9-8.7-5.2 0-10.4 1.6-14.4 7.4v-6.2H71v50.9h8.4v-28.3c0-8.4 4.6-12.5 11.7-12.5 7.1 0 10.6 4.6 10.6 12.5v28.3h8.4v-28.3c0-8.4 4.9-12.5 11.7-12.5 7.1 0 10.6 4.6 10.6 12.5v28.3h8.7v-31.7zm59 5.4v-25.3h-8.4v6.2c-3.5-4.6-8.7-7.4-15.8-7.4-14.1 0-25 11.2-25 26.7 0 15.6 10.9 26.7 25 26.7 6.8 0 12-2.7 15.8-7.4v6.2h8.4v-25.7zm59.3 10.3c0-15.4-21.2-9.3-21.2-16.6 0-3.5 3.3-5.4 9-5.4 5.4 0 11.4 1.9 16.1 4.6l3.5-7.1c-15.5-9.7-37.4-6.4-37.4 8.7 0 14.6 21.2 9 21.2 16.3 0 4.1-3.8 6-9.5 6-9.6 0-14.4-5.4-14.4-5.4l-3.8 6.8s6 5.4 18.2 5.4c11.4 0 17.9-5.7 18.2-13.6.2-.5.2-.4.1.3zm38.2 8.7l-2.4-7.1s-3.8 2.7-7.9 2.7c-3.5 0-5.4-2.2-5.4-6.2v-22.6h13.6v-7.6h-13.6v-15.5h-8.4v15.5h-7.6v7.6h7.6v22.6c0 11.4 8.7 13.6 13.6 13.6 5.5.1 9.6-1.5 11.7-3z"/>
  </svg>
);
const FaCcVisa = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 576 512" fill="currentColor" aria-hidden="true">
    <path d="M470.1 231.3s7.6 37.2 9.3 45H446c3.3-8.9 16-43.5 16-43.5-.2.3 3.3-9.1 5.3-14.9l2.8 13.4zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM152.5 331.2L215.7 176h-42.5l-39.3 106-4.3-21.5-14-71.4c-2.3-9.9-9.4-12.7-18.2-13.1H32.7l-.7 3.1c15.8 4 29.9 9.8 42.2 17.1l35.8 135h42.5zm94.4.2L272.1 176h-40.2l-25.1 155.4h40.1zm139.9-50.8c.2-17.7-10.6-31.2-33.7-42.3-14.1-7.1-22.7-11.9-22.7-19.2.2-6.6 7.3-13.4 23.1-13.4 13.1-.3 22.7 2.8 29.9 5.9l3.6 1.7 5.5-33.6c-7.9-3.1-20.5-6.6-36-6.6-39.7 0-67.6 21.2-67.8 51.4-.3 22.3 20 34.7 35.2 42.2 15.5 7.6 20.8 12.6 20.8 19.3-.2 10.4-12.6 15.2-24.1 15.2-16 0-24.6-2.5-37.7-8.3l-5.3-2.5-5.6 34.9c9.4 4.3 26.8 8.1 44.8 8.3 42.2.1 69.7-20.8 70-53zM528 331.4L495.6 176h-31.1c-9.6 0-16.9 2.8-21 12.9l-59.7 142.5H426s6.9-19.2 8.4-23.3H486c1.2 5.5 4.8 23.3 4.8 23.3H528z"/>
  </svg>
);
const FaBarcode = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
    <path d="M0 32v448h512V32H0zm64 384h-32V96h32v320zm64 0h-16V96h16v320zm64 0h-32V96h32v320zm80 0h-32V96h32v320zm48 0h-32V96h32v320zm80 0h-48V96h48v320zm80 0h-48V96h48v320z"/>
  </svg>
);
import googleMapsLogo from "@/assets/google-maps-logo.webp";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { resolveCheckoutUrl, setSelectedPlan, clearAffiliateData } from "@/lib/affiliates";
import { useVagasRestantes } from "@/hooks/useVagasRestantes";

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
  plan: "monthly" | "lifetime";
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
  const vagas = useVagasRestantes(4);

  const handleClick = async () => {
    // Salva o plano escolhido no localStorage
    setSelectedPlan(plan);
    
    // Sempre redireciona para criar conta primeiro
    toast.info("Crie sua conta primeiro para garantir o acesso ao plano!");
    navigate("/auth?isSignup=true");
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
      className={`relative flex w-full max-w-sm flex-col rounded-3xl px-6 pb-6 pt-16 sm:px-8 sm:pb-8 sm:pt-12 transition-all duration-500 border-2 ${
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
        <div className="flex flex-col items-center justify-center gap-2 mb-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="bg-red-500/20 text-red-300 text-[11px] font-black px-3 py-1 rounded-full border-2 border-red-500/40 uppercase tracking-wider shadow-[0_0_12px_rgba(239,68,68,0.2)]">
              ⚡ Promoção relâmpago — 70% OFF
            </span>
          </div>
        </div>

        {comparePrice && (
          <div className="mb-2 flex flex-col items-center gap-1.5 justify-center">
            <span className="text-sm text-muted-foreground/60 line-through">{comparePrice}</span>
            <span className="text-primary font-black text-[11px] bg-primary/10 px-3 py-1 rounded-full border border-primary/20 uppercase tracking-wider">70% OFF</span>
          </div>
        )}
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter">
              R$ <PriceCounter price={price} />
            </span>
            <span className="text-sm font-bold text-primary uppercase tracking-widest">{priceDescription}</span>
          </div>
          {plan === "lifetime" && (
            <div className="flex flex-col items-center gap-0.5 mt-1">
              <span className="text-[11px] font-black text-primary/80 uppercase tracking-tighter">Ou parcelado em:</span>
              <div className="flex gap-2">
                <span className="text-[12px] font-black text-foreground/90 bg-primary/5 px-2 py-0.5 rounded border border-primary/10">6x de R$ 16,32</span>
                <span className="text-[12px] font-black text-foreground/90 bg-primary/5 px-2 py-0.5 rounded border border-primary/10">12x de R$ 8,16</span>
              </div>
            </div>
          )}
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
  const vagas = useVagasRestantes(4);
  const sharedFeatures = [
    "Criador de Sites com IA (20+ nichos)",
    "Extensão Lovable — Sites Ilimitados",
    "Prospecção Automática Brasil via Google Maps",
    "Hyperbuild Pro Grátis",
    "Gerador de Contrato Automático",
    "Script de Vendas Pronto para WhatsApp",
    "Dashboard de Acompanhamento de Lucros",
    "Parceria Oficial com Lovable",
    "Suporte Prioritário",
    "6 Estilos de Design Exclusivos",
    "Todas as Atualizações Futuras Incluídas",
  ];

  const plans: PricingCardProps[] = [
    {
      planName: "Plano Mensal",
      description: "Acesso completo ao AxionFly por mês",
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
      description: "Pague uma única vez (Acesso vitalício)",
      price: "R$ 97,90",
      comparePrice: "R$ 326,33",
      priceDescription: "/ custo único",
      features: sharedFeatures,
      buttonText: "Garantir Vitalício com 70% OFF",
      plan: "lifetime",
      isHighlight: true,
      savingsBadge: "70% OFF",
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
