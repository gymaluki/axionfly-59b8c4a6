import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, BookOpen, Code2, Check, Sparkles, Zap, Users, TrendingUp, Globe, Search, MousePointerClick } from "lucide-react";
import { motion, type Easing } from "framer-motion";
import { HeroSection } from "@/components/ui/hero-1";
import IsoLevelWarp from "@/components/ui/isometric-wave-grid-background";
import { Header } from "@/components/ui/header-3";
import { GlobeCdn } from "@/components/ui/cobe-globe-cdn";
import Testimonials from "@/components/Testimonials";
import PricingCards from "@/components/PricingCards";
import LovablePartnership from "@/components/LovablePartnership";
import FeaturesCarousel from "@/components/FeaturesCarousel";

const ease: Easing = [0.16, 1, 0.3, 1];
const springTransition = { type: "spring" as const, stiffness: 80, damping: 20 };

const fadeUp = {
  hidden: { opacity: 0, y: 80, filter: "blur(12px)", scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { delay: i * 0.12, duration: 1, ease },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.7, filter: "blur(10px)", rotateX: 15 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    rotateX: 0,
    transition: { delay: i * 0.1, duration: 0.9, ease },
  }),
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -120, filter: "blur(10px)", rotateY: 8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    rotateY: 0,
    transition: { delay: i * 0.15, duration: 1, ease },
  }),
};

const slideFromRight = {
  hidden: { opacity: 0, x: 120, filter: "blur(10px)", rotateY: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    rotateY: 0,
    transition: { delay: i * 0.15, duration: 1, ease },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const features = [
  {
    icon: Code2,
    title: "Fábrica de Sites IA",
    desc: "Escolha entre 20+ nichos (barbearias, pizzarias, clínicas, academias...), personalize cores, fontes e estilo de design — a IA monta o site completo em minutos. Pronto pra vender.",
    tag: "PRINCIPAL",
  },
  {
    icon: MapPin,
    title: "Busca de Leads por Estado e Cidade",
    desc: "Selecione qualquer estado e cidade do Brasil. O sistema busca negócios no Google e entrega nome, telefone e endereço — tudo pronto pra prospectar e fechar contrato.",
    tag: "27 ESTADOS",
  },
  {
    icon: BookOpen,
    title: "Gerador de E-books com IA",
    desc: "Crie e-books profissionais em 30 segundos. Use como isca digital para atrair clientes ou venda diretamente. Conteúdo gerado por IA de verdade.",
    tag: "RÁPIDO",
  },
];

const stats = [
  { icon: Users, value: 5000, label: "Usuários cadastrados", prefix: "", suffix: "+" },
  { icon: TrendingUp, value: 2, label: "Faturados pelos usuários", prefix: "+", suffix: " Mi" },
  { icon: Zap, value: 10, label: "Tempo médio de criação", prefix: "", suffix: " min" },
];

function useCountUp(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [end, duration, start]);

  return count;
}

function AnimatedStat({ icon: Icon, value, label, prefix, suffix, index }: {
  icon: any; value: number; label: string; prefix: string; suffix: string; index: number;
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 1200, inView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={scaleIn}
      custom={index}
      whileHover={{ scale: 1.08, y: -4 }}
      className="text-center space-y-2 p-6 rounded-xl glass cursor-default"
    >
      <Icon className="w-6 h-6 text-primary mx-auto" />
      <p className="text-3xl font-black text-foreground tabular-nums drop-shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
        {prefix}{count.toLocaleString("pt-BR")}{suffix}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

const howItWorks = [
  { step: "01", icon: Search, title: "Encontre o cliente ideal", desc: "Escolha o estado, a cidade e o nicho. O sistema busca negócios sem site e entrega nome, telefone e endereço." },
  { step: "02", icon: MousePointerClick, title: "Crie o site sob medida", desc: "Selecione o nicho, escolha entre 6 estilos de design (conversão, catálogo, local-first...), personalize fontes e cores. Site pronto em minutos." },
  { step: "03", icon: Globe, title: "Apresente e feche o contrato", desc: "Entre em contato pelo WhatsApp, mostre o site já pronto e feche o contrato. Sem programar uma linha de código." },
];

const faqItems = [
  { q: "Preciso saber programar para criar sites?", a: "Não! A AxionFly usa inteligência artificial para gerar sites completos. Você só preenche o nome do negócio, escolhe o nicho, as cores e o estilo de design — a IA faz todo o trabalho técnico. Zero código, zero complicação." },
  { q: "Quais tipos de site posso criar?", a: "São mais de 20 nichos prontos: barbearias, pizzarias, hamburguerias, clínicas, pet shops, academias, restaurantes, salões de beleza, escritórios de advocacia, imobiliárias, contabilidades, estúdios de estética, escolas de idiomas e muito mais. E você ainda escolhe entre 6 estilos de design: Landing Page de Conversão, Catálogo/E-commerce, Local-First, Institucional Moderno, Lifestyle e Cardápio Digital." },
  { q: "Como funciona a busca de leads?", a: "Selecione o estado (todos os 27 estados do Brasil estão disponíveis), escolha a cidade e o nicho de negócio. O sistema busca automaticamente no Google e entrega nome, telefone e endereço — tudo pronto para você entrar em contato pelo WhatsApp e oferecer um site." },
  { q: "Quanto posso cobrar por cada site criado?", a: "Nossos usuários cobram entre R$ 500 e R$ 3.000 por site. Como a IA cria o site em minutos, seu custo de produção é praticamente zero — a margem de lucro é altíssima." },
  { q: "Posso personalizar os sites gerados?", a: "Sim! Você escolhe o nicho, define cores, seleciona entre 7 combinações de fontes (Playfair Display, Inter, Poppins, Oswald...) e 6 estilos de design diferentes. Cada site sai único e profissional." },
  { q: "O que está incluso no plano vitalício?", a: "Acesso ilimitado ao criador de sites com IA (20+ nichos), busca de leads em todos os estados do Brasil, gerador de e-books com IA e todas as atualizações futuras. Pague uma vez, use para sempre." },
  { q: "Posso cancelar minha assinatura mensal?", a: "Sim, a qualquer momento. Sem multa, sem burocracia. Mas a maioria dos usuários escolhe o vitalício porque se paga no primeiro site vendido." },
  { q: "Funciona em qualquer cidade do Brasil?", a: "Sim! A busca de leads cobre todos os 27 estados e todas as cidades do Brasil. Basta selecionar o estado e a cidade para encontrar negócios sem site na sua região." },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden relative" style={{ perspective: "1200px" }}>
      {/* Grid Background */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

      <div className="relative z-10">
        <Header />

        {/* Hero */}
        <div className="relative w-full min-h-[90vh]">
          <IsoLevelWarp color="59, 130, 246" density={45} speed={1.2} />
          <div className="relative z-10">
            <HeroSection />
          </div>
        </div>

        {/* Stats */}
        <section className="container mx-auto px-4 py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <AnimatedStat key={stat.label} {...stat} index={i} />
            ))}
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.04)_0%,transparent_70%)] pointer-events-none" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Da prospecção ao contrato em <span className="gradient-text">3 passos</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">Sem experiência técnica. Sem programação. Do zero ao site vendido em minutos.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {howItWorks.map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                custom={i + 1}
                whileHover={{ y: -12, transition: springTransition }}
                className="text-center space-y-5 relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 12, boxShadow: "0 0 40px -8px hsl(var(--primary) / 0.5)" }}
                  transition={springTransition}
                  className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto relative backdrop-blur-sm"
                >
                  <Icon className="w-8 h-8 text-primary" />
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-primary/30">{step}</span>
                </motion.div>
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features + Globe */}
        <section className="container mx-auto px-4 py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.05)_0%,transparent_60%)] pointer-events-none" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Três ferramentas de lucro.{" "}
              <span className="gradient-text">Uma plataforma completa.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">20+ nichos, 6 estilos de design, busca em todos os estados do Brasil. Tudo pra você vender mais.</p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="grid gap-6">
              {features.map(({ icon: Icon, title, desc, tag }, i) => (
                <motion.div
                  key={title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={slideFromLeft}
                  custom={i + 1}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -8,
                    boxShadow: "0 25px 60px -15px hsl(var(--primary) / 0.15), 0 0 30px -10px hsl(var(--primary) / 0.1)",
                    transition: springTransition
                  }}
                  className="glass rounded-2xl p-7 space-y-4 hover:neon-border transition-all duration-500 group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute top-4 right-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/15 text-primary px-2.5 py-1 rounded-full border border-primary/20">{tag}</span>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={springTransition}
                    className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20"
                  >
                    <Icon className="w-7 h-7 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground relative z-10">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm relative z-10">{desc}</p>
                </motion.div>
              ))}
            </div>
            {/* Globe */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideFromRight}
              custom={1}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-md relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle,hsl(var(--primary)/0.08)_0%,transparent_70%)] blur-3xl pointer-events-none" />
                <GlobeCdn className="w-full" speed={0.008} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
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
              Enquanto você lê isso, alguém está faturando com sites criados por IA.
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto relative z-10">
              20+ nichos prontos, busca de clientes em qualquer cidade do Brasil, sites profissionais em minutos. Configure em 5 minutos e comece a vender hoje.
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
        {/* Features Carousel */}
        <FeaturesCarousel />

        <Testimonials />

        <PricingCards />

        <LovablePartnership />

        {/* FAQ */}
        <section className="container mx-auto px-4 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-12 space-y-3">
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
                viewport={{ once: true, amount: 0.3 }}
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
