import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Code2, Sparkles, Zap, Users, TrendingUp, Globe, Search, MousePointerClick, BarChart3, FileText, MessageSquare, Infinity } from "lucide-react";
import { motion, useInView, type Easing } from "framer-motion";
import { HeroSection } from "@/components/ui/hero-1";
import { Header } from "@/components/ui/header-3";

import PricingCards from "@/components/PricingCards";
import LovablePartnership from "@/components/LovablePartnership";
import FeaturesCarousel from "@/components/FeaturesCarousel";

// Lazy load heavy visual components
const GlobeCdn = lazy(() => import("@/components/ui/cobe-globe-cdn").then(m => ({ default: m.GlobeCdn })));
const IsoLevelWarp = lazy(() => import("@/components/ui/isometric-wave-grid-background"));
const BackgroundPaths = lazy(() => import("@/components/ui/background-paths").then(m => ({ default: m.BackgroundPaths })));

const ease: Easing = [0.16, 1, 0.3, 1];
const springTransition = { type: "spring" as const, stiffness: 80, damping: 20 };

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.4, ease },
  }),
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease },
  }),
};

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

/* ── Section Pill ── */
function SectionPill({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={0}
      className="flex justify-center mb-8"
    >
      <span className="inline-flex items-center rounded-full border border-border bg-card/80 backdrop-blur-sm px-5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
        {children}
      </span>
    </motion.div>
  );
}

const features = [
  {
    icon: Infinity,
    title: "Extensão Lovable Infinito",
    desc: "Crie sites sem limites de créditos. Parceria exclusiva com Hyperbuild Pro para garantir sua escala total.",
    tag: "INFINITO",
  },
  {
    icon: Code2,
    title: "Criador de Sites com IA",
    desc: "Escolha entre 20+ nichos, personalize cores, fontes e estilo de design — a IA monta o site completo em minutos. Pronto pra vender.",
    tag: "PRINCIPAL",
  },
  {
    icon: MapPin,
    title: "Prospecção Automática",
    desc: "Selecione estado e cidade. O sistema busca negócios sem site e entrega nome, telefone e endereço — tudo pronto pra fechar contrato.",
    tag: "27 ESTADOS",
  },
  {
    icon: FileText,
    title: "Gerador de Contrato",
    desc: "Gere contratos profissionais personalizados com nome do cliente, serviço e valores — prontos para enviar e fechar negócio na hora.",
    tag: "AUTOMÁTICO",
  },
  {
    icon: MessageSquare,
    title: "Script de Vendas Pronto",
    desc: "Mensagens prontas para WhatsApp com o nome do cliente já preenchido. Abordagem, objeções e fechamento — tudo humanizado e testado.",
    tag: "VENDAS",
  },
  {
    icon: BarChart3,
    title: "Dashboard de Vendas",
    desc: "Acompanhe seus lucros, clientes atendidos e sites criados em um painel completo. Tenha controle total do seu negócio.",
    tag: "GESTÃO",
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
    if (!start) { setCount(0); return; }
    let startTime: number | null = null;
    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
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

function StaticStat({ icon: Icon, value, label, prefix, suffix }: {
  icon: any; value: number; label: string; prefix: string; suffix: string;
}) {
  return (
    <div className="text-center space-y-2 p-6 rounded-xl glass cursor-default">
      <Icon className="w-6 h-6 text-primary mx-auto" />
      <p className="text-3xl font-black text-foreground tabular-nums drop-shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
        {prefix}{value.toLocaleString("pt-BR")}{suffix}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

const howItWorks = [
  {
    step: "Etapa - 1",
    icon: Search,
    title: "Ative sua Ferramenta",
    desc: "Assine a AxionFly, acesse a plataforma e conecte a IA. Em poucos cliques, sua base de operação está pronta para prospectar e criar sites.",
  },
  {
    step: "Etapa - 2",
    icon: MousePointerClick,
    title: "Crie Sites e Encontre Clientes",
    desc: "Escolha o nicho, personalize o design e gere o site com IA. Use a busca de leads para encontrar negócios sem site na sua cidade.",
  },
  {
    step: "Etapa - 3",
    icon: Globe,
    title: "Apresente, Venda e Escale",
    desc: "Entre em contato pelo WhatsApp, mostre o site pronto e feche o contrato. Acompanhe seus resultados e continue escalando.",
  },
];

const faqItems = [
  { q: "Preciso saber programar para criar sites?", a: "Não! A AxionFly usa inteligência artificial para gerar sites completos. Você só preenche o nome do comércio, escolhe o nicho, as cores e o estilo de design — a IA faz todo o trabalho técnico. Zero código, zero complicação." },
  { q: "Quais tipos de comércio posso atender?", a: "São mais de 20 nichos prontos focados em comércios locais: barbearias, pizzarias, hamburguerias, restaurantes, padarias, sorveterias, açaiterias, mercados, lojas de roupas, lanchonetes, marmitarias, salões de beleza, cafeterias, docerias, açougues, hortifrutis e muito mais." },
  { q: "Como funciona a busca de leads?", a: "Selecione o estado (todos os 27 estados do Brasil estão disponíveis), escolha a cidade e o tipo de comércio. O sistema busca automaticamente e entrega nome, telefone e endereço — tudo pronto para você prospectar." },
  { q: "Quanto posso cobrar por cada site criado?", a: "Nossos usuários cobram entre R$ 500 e R$ 3.000 por site. Como a IA cria o site em minutos, seu custo de produção é praticamente zero — a margem de lucro é altíssima." },
  { q: "Posso personalizar os sites gerados?", a: "Sim! Você escolhe o nicho, define cores, seleciona entre 7 combinações de fontes e 6 estilos de design diferentes. Cada site sai único e profissional." },
  { q: "O que está incluso no plano vitalício?", a: "Acesso ilimitado ao criador de sites com IA (20+ nichos de comércio), busca de leads em todos os estados do Brasil, dashboard de vendas e todas as atualizações futuras. Pague uma vez, use para sempre." },
  { q: "Posso cancelar minha assinatura mensal?", a: "Sim, a qualquer momento. Sem multa, sem burocracia. Mas a maioria dos usuários escolhe o vitalício porque se paga no primeiro site vendido." },
  { q: "Funciona em qualquer cidade do Brasil?", a: "Sim! A busca de leads cobre todos os 27 estados e todas as cidades do Brasil. Basta selecionar o estado e a cidade para encontrar comércios sem site na sua região." },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
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

        {/* ═══════════ HERO ═══════════ */}
        <div id="inicio" className="relative w-full min-h-[70vh] md:min-h-[90vh]">
          <Suspense fallback={null}>
            <IsoLevelWarp color="30, 58, 138" density={30} speed={0.9} />
            <div className="hidden md:block">
              <BackgroundPaths />
            </div>
          </Suspense>
          <div className="relative z-10">
            <HeroSection />
          </div>
        </div>

        {/* ═══════════ FUNCIONALIDADES (Features lateral + Globe) ═══════════ */}
        <section className="container mx-auto px-4 py-10 md:py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.05)_0%,transparent_60%)] pointer-events-none" />

          <SectionPill>Conheça a Plataforma</SectionPill>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Comece de forma simples.{" "}
              <br className="hidden md:block" />
              Escale com <span className="gradient-text">sites prontos e prospecção automática</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
              20+ nichos, 6 estilos de design, busca em todos os estados do Brasil. Tudo pra você vender mais.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center">
            {/* Features na lateral esquerda - menores */}
            <div className="grid gap-4 order-2 lg:order-1">
              {features.map(({ icon: Icon, title, desc, tag }, i) => (
                <motion.div
                  key={title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={slideFromLeft}
                  custom={i + 1}
                  whileHover={{
                    scale: 1.02,
                    y: -4,
                    transition: springTransition
                  }}
                  className="glass rounded-xl p-4 md:p-5 space-y-2 hover:neon-border transition-all duration-500 group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute top-3 right-3">
                    <span className="text-[8px] font-bold uppercase tracking-wider bg-primary/15 text-primary px-2 py-0.5 rounded-full border border-primary/20">{tag}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 12, scale: 1.1 }}
                      transition={springTransition}
                      className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300"
                    >
                      <Icon className="w-5 h-5 text-primary" />
                    </motion.div>
                    <h3 className="text-base md:text-lg font-bold text-foreground relative z-10 pr-16">{title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-xs md:text-sm relative z-10">{desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Globo 3D na lateral direita */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={0}
                className="text-center mb-3 md:mb-6 space-y-1.5 md:space-y-2 px-2"
              >
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground tracking-tight leading-snug">
                  Venda sites para <span className="gradient-text">comércios pelo mundo</span>
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto text-xs md:text-sm">
                  De São Paulo a Nova York. Conecte-se a negócios que precisam de um site profissional.
                </p>
              </motion.div>
              <div className="w-[80%] sm:w-[70%] lg:w-full max-w-lg mx-auto aspect-square relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle,hsl(var(--primary)/0.12)_0%,transparent_70%)] blur-3xl pointer-events-none" />
                <Suspense fallback={<div className="w-full aspect-square animate-pulse bg-primary/5 rounded-full" />}>
                  <GlobeCdn className="w-full" speed={0.006} />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ ETAPAS (How It Works) ═══════════ */}
        <section id="etapas" className="container mx-auto px-4 py-10 md:py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.04)_0%,transparent_70%)] pointer-events-none" />
          
          <SectionPill>Veja como começar - Simples e Fácil</SectionPill>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-10 md:mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Como começar a <span className="gradient-text">vender sites</span>{" "}
              <br className="hidden md:block" />
              com a AxionFly?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Sem experiência técnica. Sem programação. Do zero ao site vendido em minutos.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {howItWorks.map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                custom={i + 1}
                whileHover={{ y: -8, transition: springTransition }}
                className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 space-y-5 relative group hover:border-primary/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-4 py-1 text-xs font-medium text-muted-foreground">
                  {step}
                </span>
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════ AULAS PREMIUM (Carousel) ═══════════ */}
        <section>
          <SectionPill>Conheça Área de Membros</SectionPill>
          <FeaturesCarousel />
        </section>

        {/* ═══════════ MÉTRICAS (Stats) ═══════════ */}
        <section className="container mx-auto px-4 py-8 md:py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <StaticStat key={stat.label} {...stat} />
            ))}
          </motion.div>
        </section>

        {/* ═══════════ PLANOS ═══════════ */}
        <PricingCards />

        {/* ═══════════ PARCERIAS ═══════════ */}
        <LovablePartnership />

        {/* ═══════════ CTA FINAL ═══════════ */}
        <section className="container mx-auto px-4 py-10 md:py-20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.06)_0%,transparent_60%)] pointer-events-none" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            custom={0}
            className="text-center space-y-6 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Comece agora e venda seu{" "}
              <span className="gradient-text">primeiro site hoje</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Escolha o plano ideal e comece a faturar com sites profissionais criados por IA.
            </p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button variant="neon" size="lg" className="rounded-full px-10 text-base" asChild>
                  <a href="https://go.perfectpay.com.br/PPU38CQA071">
                    <Zap className="w-4 h-4 mr-2" />
                    Assinar agora
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="lg" className="rounded-full px-10 text-base" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
                  Ver Planos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════ FAQ ═══════════ */}
        <section id="faq" className="container mx-auto px-4 py-10 md:py-20">
          <SectionPill>Dúvidas Frequentes</SectionPill>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Tudo que você precisa saber{" "}
              <br className="hidden md:block" />
              sobre a <span className="gradient-text">AxionFly</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Respostas rápidas para suas principais dúvidas.
            </p>
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
