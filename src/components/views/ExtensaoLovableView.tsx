import { motion, type Easing } from "framer-motion";
import { Check, Sparkles, Infinity as InfinityIcon, Zap, Rocket, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import lovableLogo from "@/assets/lovable-logo.png";

const ease: Easing = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease },
  }),
};

const benefits = [
  {
    icon: InfinityIcon,
    title: "Créditos Ilimitados",
    desc: "Use a IA da Lovable sem se preocupar com limite mensal de mensagens ou tokens.",
  },
  {
    icon: Zap,
    title: "Velocidade Máxima",
    desc: "Acelere o desenvolvimento dos seus projetos com requisições ilimitadas.",
  },
  {
    icon: Rocket,
    title: "Parceria Hyperbuild Pro",
    desc: "Integração oficial entre AxionFly e Hyperbuild Pro, exclusiva para nossos membros.",
  },
];

const ExtensaoLovableView = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="space-y-3"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Parceria Exclusiva
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
          Extensão <span className="gradient-text">Lovable</span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
          Tenha <span className="text-primary font-bold">créditos infinitos</span> no Lovable através
          da nossa parceria oficial com a <span className="text-foreground font-bold">Hyperbuild Pro</span>.
        </p>
      </motion.div>

      {/* Hero card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="relative overflow-hidden rounded-2xl border border-border/60 p-8 md:p-10"
        style={{
          backgroundColor: "hsl(var(--card))",
          backgroundImage:
            "radial-gradient(at 0% 0%, hsl(var(--primary) / 0.12) 0px, transparent 60%), radial-gradient(at 100% 100%, hsl(var(--accent) / 0.08) 0px, transparent 60%)",
        }}
      >
        <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="flex items-center gap-3 shrink-0">
            <img src={lovableLogo} alt="Lovable" className="h-14 w-14 object-contain" />
            <span className="text-3xl font-black text-foreground">Lovable</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Créditos Infinitos com a Extensão Hyperbuild Pro
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Esta é uma parceria direta entre a AxionFly e a Hyperbuild Pro. Instale a extensão e
              passe a usar a Lovable sem limite de créditos para desenvolver seus projetos.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Benefits grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i + 2}
            className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 space-y-3 hover:border-primary/30 transition-all"
          >
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
              <b.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground">{b.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* What you get */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={5}
        className="rounded-2xl border border-border/50 bg-card/40 p-6 md:p-8 space-y-4"
      >
        <h3 className="text-lg font-bold text-foreground">O que você ganha:</h3>
        <ul className="grid md:grid-cols-2 gap-3">
          {[
            "Créditos ilimitados na Lovable",
            "Parceria oficial com Hyperbuild Pro",
            "Acesso liberado para membros AxionFly",
            "Desenvolva projetos sem se preocupar com limite",
            "Atualizações da extensão inclusas",
            "Suporte direto da equipe Hyperbuild",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center w-5 h-5 bg-primary/20 rounded-full shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={6}
        className="rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8 text-center space-y-4"
      >
        <h3 className="text-xl md:text-2xl font-bold text-foreground">
          Pronto para usar créditos infinitos?
        </h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Acesse a Hyperbuild Pro e comece a usar a extensão agora mesmo.
        </p>
        <div className="flex justify-center pt-2">
          <Button
            asChild
            variant="neon"
            size="lg"
            className="gap-2"
          >
            <a
              href="https://hyperbuildpro.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Acessar Hyperbuild Pro
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExtensaoLovableView;
