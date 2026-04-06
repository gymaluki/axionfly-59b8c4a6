import React from "react";
import { motion, type Easing } from "framer-motion";
import { Check, Sparkles, Briefcase, BarChart3, Globe, Zap, MapPin, Users, RefreshCw, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ease: Easing = [0.16, 1, 0.3, 1];
const springTransition = { type: "spring" as const, stiffness: 80, damping: 20 };

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.12, duration: 0.7, ease },
  }),
};

interface PricingCardProps {
  planName: string;
  description: string;
  price: string;
  priceDescription: string;
  features: { text: string; icon: React.ReactNode }[];
  icon: React.ReactNode;
  isPopular?: boolean;
  buttonText: string;
  buttonHref: string;
  index: number;
}

function PricingCard({
  planName,
  description,
  price,
  priceDescription,
  features,
  icon,
  isPopular,
  buttonText,
  buttonHref,
  index,
}: PricingCardProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={index}
      whileHover={{ scale: 1.03, y: -6, transition: springTransition }}
      className={`relative rounded-2xl p-7 flex flex-col w-full max-w-sm transition-all duration-500 ${
        isPopular
          ? "neon-border glow-blue"
          : "border border-border/50 hover:border-border"
      }`}
      style={{
        backgroundColor: "hsl(var(--card))",
        backgroundImage:
          isPopular
            ? "radial-gradient(at 0% 100%, hsl(220 70% 35% / 0.1) 0px, transparent 60%), radial-gradient(at 100% 100%, hsl(220 70% 50% / 0.08) 0px, transparent 60%)"
            : undefined,
      }}
    >
      {isPopular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap shadow-lg shadow-primary/30"
          >
            MAIS ESCOLHIDO
          </motion.span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl border border-border bg-secondary/50 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{planName}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-black ${isPopular ? "gradient-text" : "text-foreground"}`}>
            {price}
          </span>
          <span className="text-sm text-muted-foreground">{priceDescription}</span>
        </div>
      </div>

      <ul className="space-y-3 text-sm text-muted-foreground flex-1">
        {features.map((feature, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + idx * 0.06, duration: 0.4, ease }}
            className="flex items-start gap-3"
          >
            <div className="flex items-center justify-center w-5 h-5 mt-0.5 bg-primary/20 rounded-full shrink-0">
              {feature.icon}
            </div>
            <span>{feature.text}</span>
          </motion.li>
        ))}
      </ul>

      <div className="mt-6">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant={isPopular ? "neon" : "outline"}
            size="lg"
            className="w-full"
            asChild
          >
            <a href={buttonHref}>{buttonText}</a>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function PricingCards() {
  const plans: PricingCardProps[] = [
    {
      planName: "Mensal",
      description: "Para quem quer testar sem compromisso",
      price: "R$ 147",
      priceDescription: "/ mês",
      icon: <Sparkles className="w-5 h-5 text-primary" />,
      features: [
        { text: "Criador de Sites com IA (20+ nichos)", icon: <Globe className="w-3 h-3 text-primary" /> },
        { text: "Prospecção automática via Google Maps", icon: <MapPin className="w-3 h-3 text-primary" /> },
        { text: "Dashboard de acompanhamento de lucros", icon: <BarChart3 className="w-3 h-3 text-primary" /> },
        { text: "Parceria oficial com Lovable", icon: <Zap className="w-3 h-3 text-primary" /> },
        { text: "Suporte prioritário", icon: <Users className="w-3 h-3 text-primary" /> },
        { text: "6 estilos de design exclusivos", icon: <Code2 className="w-3 h-3 text-primary" /> },
        { text: "Todas as atualizações futuras incluídas", icon: <RefreshCw className="w-3 h-3 text-primary" /> },
      ],
      buttonText: "Assinar Agora",
      buttonHref: "https://go.perfectpay.com.br/PPU38CQA06U",
      isPopular: false,
      index: 1,
    },
    {
      planName: "Vitalício",
      description: "Pague uma vez. Use para sempre.",
      price: "R$ 247",
      priceDescription: "/ custo único",
      icon: <Briefcase className="w-5 h-5 text-primary" />,
      features: [
        { text: "Criador de Sites com IA (20+ nichos)", icon: <Globe className="w-3 h-3 text-primary" /> },
        { text: "Prospecção automática via Google Maps", icon: <MapPin className="w-3 h-3 text-primary" /> },
        { text: "Dashboard de acompanhamento de lucros", icon: <BarChart3 className="w-3 h-3 text-primary" /> },
        { text: "Parceria oficial com Lovable", icon: <Zap className="w-3 h-3 text-primary" /> },
        { text: "Suporte prioritário", icon: <Users className="w-3 h-3 text-primary" /> },
        { text: "6 estilos de design exclusivos", icon: <Code2 className="w-3 h-3 text-primary" /> },
        { text: "Todas as atualizações futuras incluídas", icon: <RefreshCw className="w-3 h-3 text-primary" /> },
      ],
      buttonText: "Garantir Acesso Vitalício",
      buttonHref: "https://go.perfectpay.com.br/PPU38CQA071",
      isPopular: true,
      index: 2,
    },
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <div className="flex justify-center mb-8">
        <span className="inline-flex items-center rounded-full border border-border bg-card/80 backdrop-blur-sm px-5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          Preços - Planos flexíveis
        </span>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="text-center mb-12 space-y-4"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
          Comece de forma simples.{" "}
          <br className="hidden md:block" />
          Escale com <span className="gradient-text">automações precisas!</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Escolha o plano ideal para você. Comece seu negócio com a liberdade de crescer ainda mais.
        </p>
      </motion.div>
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 max-w-3xl mx-auto">
        {plans.map((plan) => (
          <PricingCard key={plan.planName} {...plan} />
        ))}
      </div>
    </section>
  );
}
