import { motion, type Easing } from "framer-motion";
import { Sparkles, Briefcase } from "lucide-react";
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
  features: string[];
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
      className={`relative flex w-full max-w-sm flex-col rounded-2xl p-7 transition-all duration-500 ${
        isPopular ? "neon-border glow-blue" : "border border-border/50 hover:border-border"
      }`}
      style={{
        backgroundColor: "hsl(var(--card))",
        backgroundImage: isPopular
          ? "radial-gradient(at 0% 100%, hsl(220 70% 35% / 0.1) 0px, transparent 60%), radial-gradient(at 100% 100%, hsl(220 70% 50% / 0.08) 0px, transparent 60%)"
          : undefined,
      }}
    >
      {isPopular && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="whitespace-nowrap rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30"
          >
            MAIS ESCOLHIDO
          </motion.span>
        </div>
      )}

      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-foreground">{planName}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mb-8 text-center">
        <div className="flex items-baseline justify-center gap-2">
          <span className={`text-4xl font-black ${isPopular ? "gradient-text" : "text-foreground"}`}>
            {price}
          </span>
          <span className="text-sm text-muted-foreground">{priceDescription}</span>
        </div>
      </div>

      <ul className="flex-1 space-y-3 text-center text-sm text-muted-foreground">
        {features.map((feature, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + idx * 0.06, duration: 0.4, ease }}
            className="rounded-xl border border-border/40 bg-secondary/30 px-4 py-3"
          >
            {feature}
          </motion.li>
        ))}
      </ul>

      <div className="mt-6">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button variant={isPopular ? "neon" : "outline"} size="lg" className="w-full" asChild>
            <a href={buttonHref}>{buttonText}</a>
          </Button>
        </motion.div>
      </div>
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
      buttonText: "Assinar Agora",
      buttonHref: "https://go.perfectpay.com.br/PPU38CQA06U",
      isPopular: false,
      index: 1,
    },
    {
      planName: "Plano Vitalício",
      description: "Pague uma vez. Use para sempre.",
      price: "R$ 247",
      priceDescription: "/ custo único",
      features: sharedFeatures,
      buttonText: "Garantir Acesso Vitalício",
      buttonHref: "https://go.perfectpay.com.br/PPU38CQA071",
      isPopular: true,
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
