import React from "react";
import { motion, type Easing } from "framer-motion";
import { Check, Sparkles, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const ease: Easing = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease },
  }),
};

interface PricingCardProps {
  planName: string;
  description: string;
  price: string;
  priceDescription: string;
  features: string[];
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
      whileHover={{ scale: 1.03, y: -4 }}
      className={`relative rounded-2xl p-6 flex flex-col w-full max-w-sm transition-all duration-300 ${
        isPopular
          ? "neon-border glow-blue"
          : "border border-border/50 hover:border-border"
      }`}
      style={{
        backgroundColor: "hsl(var(--card))",
        backgroundImage:
          isPopular
            ? "radial-gradient(at 0% 100%, hsl(217 91% 60% / 0.08) 0px, transparent 60%), radial-gradient(at 100% 100%, hsl(199 89% 48% / 0.08) 0px, transparent 60%)"
            : undefined,
      }}
    >
      {isPopular && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
            MAIS ESCOLHIDO
          </span>
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
          <li key={idx} className="flex items-start gap-3">
            <div className="flex items-center justify-center w-4 h-4 mt-0.5 bg-primary rounded-full shrink-0">
              <Check className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
      description: "Teste sem compromisso",
      price: "R$ 147",
      priceDescription: "/ mês",
      icon: <Sparkles className="w-5 h-5 text-accent" />,
      features: [
        "Criador de Sites IA ilimitado",
        "Prospecção Google Maps automática",
        "Gerador de E-books com IA",
        "Suporte prioritário",
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
      priceDescription: "/ pagamento único",
      icon: <Briefcase className="w-5 h-5 text-primary" />,
      features: [
        "Criador de Sites IA ilimitado",
        "Prospecção Google Maps automática",
        "Gerador de E-books com IA",
        "Suporte prioritário",
        "Todas as atualizações futuras incluídas",
      ],
      buttonText: "Garantir Acesso Vitalício",
      buttonHref: "https://go.perfectpay.com.br/PPU38CQA071",
      isPopular: true,
      index: 2,
    },
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="text-center mb-12 space-y-3"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          O investimento se paga no{" "}
          <span className="gradient-text">primeiro site vendido</span>
        </h2>
        <p className="text-muted-foreground">
          Sem surpresas. Sem taxa escondida. Venda e lucre.
        </p>
      </motion.div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl mx-auto">
        {plans.map((plan) => (
          <PricingCard key={plan.planName} {...plan} />
        ))}
      </div>
    </section>
  );
}
