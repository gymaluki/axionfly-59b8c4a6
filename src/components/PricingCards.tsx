import { motion, type Easing } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const ease: Easing = [0.16, 1, 0.3, 1];
const springTransition = { type: "spring" as const, stiffness: 300, damping: 20, mass: 0.8 };

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
  features: string[];
  isHighlight?: boolean;
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
  isHighlight,
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
      className="relative flex w-full max-w-sm flex-col rounded-2xl p-8 transition-all duration-500 neon-border glow-blue"
      style={{
        backgroundColor: "hsl(var(--card))",
        backgroundImage: "radial-gradient(at 0% 100%, hsl(220 70% 35% / 0.1) 0px, transparent 60%), radial-gradient(at 100% 100%, hsl(220 70% 50% / 0.08) 0px, transparent 60%)",
      }}
    >
      {/* Title */}
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-foreground">{planName}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-4 mb-8">
        {features.map((feature, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + idx * 0.06, duration: 0.4, ease }}
            className="flex items-center gap-3 text-sm text-foreground font-medium"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <Check className="h-3 w-3 text-primary" />
            </div>
            {feature}
          </motion.li>
        ))}
      </ul>

      {/* Price */}
      <div className="mb-6 text-center">
        <span className={`text-4xl font-black ${isHighlight ? "gradient-text" : "text-foreground"}`}>
          {price}
        </span>
        <span className="ml-2 text-sm text-muted-foreground">{priceDescription}</span>
      </div>

      {/* CTA */}
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button variant={isHighlight ? "neon" : "outline"} size="lg" className="w-full text-base" asChild>
          <a href={buttonHref}>{buttonText}</a>
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function PricingCards() {
  const sharedFeatures = [
    "Criador de Sites com IA (20+ nichos)",
    "Prospecção automática via Google Maps",
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
      price: "R$ 147",
      priceDescription: "/ mês",
      features: sharedFeatures,
      buttonText: "Escolher este plano",
      buttonHref: "https://go.perfectpay.com.br/PPU38CQA06U",
      isHighlight: false,
      index: 1,
    },
    {
      planName: "Plano Vitalício",
      description: "Pague uma vez. Use para sempre.",
      price: "R$ 247",
      priceDescription: "/ custo único",
      features: sharedFeatures,
      buttonText: "Escolher este plano",
      buttonHref: "https://go.perfectpay.com.br/PPU38CQA071",
      isHighlight: true,
      index: 2,
    },
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <div className="mb-8 flex justify-center">
        <span className="inline-flex items-center rounded-full border border-border bg-card/80 px-5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
          Preços - Planos flexíveis
        </span>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="mb-12 space-y-4 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Comece de forma simples.{" "}
          <br className="hidden md:block" />
          Escale com <span className="gradient-text">automações precisas!</span>
        </h2>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          Escolha o plano ideal para você e comece seu negócio com liberdade para crescer ainda mais.
        </p>
      </motion.div>
      <div className="mx-auto flex max-w-3xl flex-col items-stretch justify-center gap-8 md:flex-row">
        {plans.map((plan) => (
          <PricingCard key={plan.planName} {...plan} />
        ))}
      </div>
    </section>
  );
}
