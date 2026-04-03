import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, BookOpen, Code2, Check, Sparkles, Zap, Users, TrendingUp, Globe, Search, MousePointerClick } from "lucide-react";
import { motion, type Easing, useScroll, useTransform } from "framer-motion";
import { Header } from "@/components/ui/header-3";
import { Marquee } from "@/components/ui/marquee";
import ShutterText from "@/components/ui/hero-shutter-text";
import { GlobeCdn } from "@/components/ui/cobe-globe-cdn";
import Testimonials from "@/components/Testimonials";
import { useRef } from "react";

const ease: Easing = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease },
  }),
};

const features = [
  {
    icon: Code2,
    title: "Criador de Sites IA",
    desc: "Descreva o site que seu cliente precisa. A IA gera o prompt perfeito — você cola no Lovable e entrega um site profissional em minutos.",
    tag: "PRINCIPAL",
  },
  {
    icon: MapPin,
    title: "Prospecção Google Maps",
    desc: "A IA varre o Google Maps e encontra barbearias, clínicas, restaurantes — qualquer nicho. Nome, telefone e endereço prontos para você vender.",
    tag: "AUTOMÁTICO",
  },
  {
    icon: BookOpen,
    title: "Gerador de E-books",
    desc: "Crie e-books profissionais em 30 segundos. Use como isca digital ou venda diretamente. Conteúdo gerado por IA de verdade.",
    tag: "RÁPIDO",
  },
];

const stats = [
  { icon: Users, value: "2.300+", label: "Sites criados" },
  { icon: TrendingUp, value: "R$ 4.2M", label: "Faturados pelos usuários" },
  { icon: Zap, value: "47s", label: "Tempo médio de criação" },
];

const howItWorks = [
  { step: "01", icon: Search, title: "IA busca clientes", desc: "Digite o nicho. A IA encontra negócios no Google Maps sem site profissional." },
  { step: "02", icon: MousePointerClick, title: "Gere o site", desc: "Com um clique, o prompt do site é criado. Cole no Lovable e pronto." },
  { step: "03", icon: Globe, title: "Venda e lucre", desc: "Entre em contato, mostre o site pronto e feche o contrato." },
];

const partnerLogos = [
  "Google Maps", "WhatsApp Business", "Lovable", "Stripe", "OpenAI", "Vercel",
];

const pricingFeatures = [
  "Criador de Sites IA ilimitado",
  "Prospecção Google Maps automática",
  "Gerador de E-books com IA",
  "Suporte prioritário",
];

const Index = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Grid Background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--border) / 0.25) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.25) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 20%, hsl(var(--background)) 70%)",
        }}
      />

      <div className="relative z-10">
        <Header />

        {/* Hero */}
        <motion.section
          ref={heroRef}
          style={{ opacity: heroOpacity, y: heroY }}
          className="container mx-auto px-4 pt-20 pb-8 md:pt-28 md:pb-16"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease }}
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary border border-primary/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Plataforma de criação de sites com IA
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease }}
                className="space-y-2"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-[1.1]">
                  Crie sites e venda para
                </h1>
                <ShutterText
                  words={["BARBEARIAS", "PIZZARIAS", "MANICURES", "DENTISTAS", "ACADEMIAS", "CLÍNICAS", "PET SHOPS", "RESTAURANTES"]}
                  interval={2200}
                />
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed pt-2">
                  A IA encontra negócios <span className="text-foreground font-semibold">sem site</span> no Google Maps.
                  Você cria o site em minutos e <span className="text-foreground font-semibold">fecha o contrato</span>.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease }}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="neon" size="lg" onClick={() => navigate("/auth")}>
                    <Zap className="w-4 h-4 mr-1" />
                    Criar Meu Primeiro Site
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
                    Ver Planos <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:flex items-center justify-center"
            >
              <div className="w-full max-w-md relative">
                <GlobeCdn speed={0.004} />
                <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl -z-10" />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Partner Logos Marquee */}
        <section className="py-12 border-y border-border/30">
          <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-6">Integrado com as ferramentas que você já usa</p>
          <Marquee duration={30} pauseOnHover fade fadeAmount={15}>
            {partnerLogos.map((name) => (
              <span key={name} className="mx-10 text-lg font-semibold text-muted-foreground/60 hover:text-foreground transition-colors whitespace-nowrap">
                {name}
              </span>
            ))}
          </Marquee>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleIn}
                custom={i}
                whileHover={{ scale: 1.05 }}
                className="text-center space-y-2 p-6 rounded-xl glass cursor-default"
              >
                <Icon className="w-6 h-6 text-primary mx-auto" />
                <p className="text-3xl font-black text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Como funciona a <span className="gradient-text">AxionFly</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">3 passos simples. Da prospecção ao contrato fechado.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {howItWorks.map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="text-center space-y-4 relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto relative"
                >
                  <Icon className="w-7 h-7 text-primary" />
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">{step}</span>
                </motion.div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Três máquinas de lucro.{" "}
              <span className="gradient-text">Uma plataforma.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Cada ferramenta elimina o trabalho que trava seu faturamento.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, tag }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                whileHover={{ scale: 1.04, y: -6 }}
                className="glass rounded-2xl p-6 space-y-4 hover:neon-border transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-3 right-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded-full border border-primary/20">{tag}</span>
                </div>
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                >
                  <Icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            custom={0}
            className="glass rounded-2xl p-8 md:p-12 text-center space-y-5 neon-border max-w-3xl mx-auto relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative z-10"
            >
              <Sparkles className="w-8 h-8 text-primary mx-auto" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground relative z-10">
              Enquanto você lê isso, alguém está vendendo sites com IA.
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto relative z-10">
              Cada dia sem a AxionFly é dinheiro na mesa do seu concorrente. Configure em 5 minutos. Sem experiência técnica.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="relative z-10">
              <Button variant="neon" size="lg" onClick={() => navigate("/auth")}>
                <Zap className="w-4 h-4 mr-1" />
                Quero Vender Sites com IA
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Pricing */}
        <section id="pricing" className="container mx-auto px-4 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              O investimento se paga no{" "}
              <span className="gradient-text">primeiro site vendido</span>
            </h2>
            <p className="text-muted-foreground">Sem surpresas. Sem taxa escondida. Venda e lucre.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Mensal */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} whileHover={{ scale: 1.03, y: -4 }} className="glass rounded-2xl p-8 space-y-6 flex flex-col transition-shadow duration-300 hover:glow-cyan">
              <div>
                <h3 className="text-xl font-bold text-foreground">Mensal</h3>
                <p className="text-muted-foreground text-sm mt-1">Teste sem compromisso. Cancele quando quiser.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground">R$ 147</span>
                <span className="text-muted-foreground">/ mês</span>
              </div>
              <ul className="space-y-3 flex-1">
                {pricingFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <a href="">Assinar Agora</a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Vitalício */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} whileHover={{ scale: 1.03, y: -4 }} className="relative glass rounded-2xl p-8 space-y-6 flex flex-col neon-border transition-shadow duration-300 hover:glow-blue">
              <div className="absolute -top-3 right-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                Mais Escolhido
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Vitalício</h3>
                <p className="text-muted-foreground text-sm mt-1">Pague uma vez. Use para sempre. Sem mensalidade.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black gradient-text">R$ 247</span>
                <span className="text-muted-foreground">/ pagamento único</span>
              </div>
              <ul className="space-y-3 flex-1">
                {pricingFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    {f}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-sm text-foreground font-medium">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  Todas as atualizações futuras incluídas
                </li>
              </ul>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="neon" size="lg" className="w-full" asChild>
                  <a href="">Garantir Acesso Vitalício</a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Perguntas <span className="gradient-text">Frequentes</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Tudo que você precisa saber sobre criar sites com IA na AxionFly.</p>
          </motion.div>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqItems.map(({ q, a }, i) => (
              <motion.details
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="glass rounded-xl group"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 text-foreground font-semibold list-none [&::-webkit-details-marker]:hidden">
                  {q}
                  <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-open:rotate-90 shrink-0 ml-4" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
                  {a}
                </div>
              </motion.details>
            ))}
          </div>
        </section>

        <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
          © 2026 AxionFly. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Index;
