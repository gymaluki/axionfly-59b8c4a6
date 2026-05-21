import React, { useEffect, useRef, useState, lazy, Suspense, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Code2, Sparkles, Zap, Users, TrendingUp, Globe, Search, MousePointerClick, BarChart3, FileText, MessageSquare, Infinity as LucideInfinity, ChevronDown, Check, Star, Instagram, Phone, Youtube, HelpCircle, ShieldCheck, Clock, Lock, Mail, Plus } from "lucide-react";
import { motion, useInView, useScroll as useFramerScroll, useTransform, type Easing, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/ui/hero-1";
import { Header } from "@/components/ui/header-3";
import { cn } from "@/lib/utils";
import { DashboardMockup } from "@/components/ui/dashboard-mockup";

import axionflyLogo from "@/assets/axionfly-logo.webp";


// Below-the-fold heavy components: lazy for faster initial paint
const PricingCards = lazy(() => import("@/components/PricingCards"));
const LovablePartnership = lazy(() => import("@/components/LovablePartnership"));
const FeaturesCarousel = lazy(() => import("@/components/FeaturesCarousel"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const ParallaxScroll = lazy(() => import("@/components/ui/parallax-scroll").then(m => ({ default: m.ParallaxScroll })));

import { SitesBuilderVisual, ExtensionInfiniteVisual, ContractGeneratorVisual } from "@/components/PremiumFeatureVisuals";
import { resolveCheckoutUrl } from "@/lib/affiliates";
import { useVagasRestantes } from "@/hooks/useVagasRestantes";

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
      <span className="inline-flex items-center rounded-full border border-border bg-card/80 backdrop-blur-sm px-5 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-[#94a3b8] shadow-sm">
        {children}
      </span>
    </motion.div>
  );
}

const features = [
  {
    icon: Code2,
    title: "Criador de Sites com IA",
    desc: "Escolha entre 20+ nichos, personalize cores, fontes e estilo de design — a IA monta o site completo em minutos. Design profissional pronto para vender.",
    tag: "PRINCIPAL",
    visual: "builder",
    bullets: [
      "Mais de 20 nichos prontos para personalizar",
      "Site profissional gerado em menos de 10 minutos",
      "Design responsivo e pronto para vender"
    ]
  },
  {
    icon: LucideInfinity,
    title: "Extensão Lovable Infinito",
    desc: "Crie sites sem limites de créditos. Parceria exclusiva com Hyperbuild Pro para garantir sua escala total. Comece agora sem preocupações com tokens.",
    tag: "INFINITO",
    visual: "extension",
    bullets: [
      "Crie sites sem limite de créditos ou tokens",
      "Parceria exclusiva com Hyperbuild Pro inclusa",
      "Escale sem interrupções ou custos extras"
    ]
  },
  {
    icon: MapPin,
    title: "Prospecção Automática Brasil",
    desc: "Selecione qualquer estado e cidade brasileira. O sistema busca negócios sem site e entrega nome, telefone e endereço pronto pra fechar negócio.",
    tag: "27 ESTADOS",
    visual: "globe",
    bullets: [
      "Encontre negócios sem site em qualquer cidade do Brasil",
      "Receba nome, telefone e endereço prontos para contato",
      "Integração com dados reais do Google Maps"
    ]
  },
  {
    icon: FileText,
    title: "Gerador de Contrato",
    desc: "Gere contratos profissionais personalizados com nome do cliente, serviço e valores — prontos para enviar e fechar negócio na hora, com segurança jurídica.",
    tag: "AUTOMÁTICO",
    visual: "contract",
    bullets: [
      "Contrato profissional com validade jurídica",
      "Personalizado com nome, serviço e valor em 2 cliques",
      "Pronto para enviar pelo WhatsApp na hora do fechamento"
    ]
  },
  {
    icon: BarChart3,
    title: "Dashboard de Vendas",
    desc: "Acompanhe seus lucros, clientes atendidos e sites criados em um painel completo. Tenha controle total do seu faturamento e crescimento.",
    tag: "GESTÃO",
    visual: "dashboard",
    bullets: [
      "Acompanhe lucros, leads e sites criados em tempo real",
      "Controle total do seu faturamento semanal e mensal",
      "Visão clara do seu crescimento em um único painel"
    ]
  },
];

const stats = [
  { icon: Users, value: 5000, label: "Usuários cadastrados", prefix: "", suffix: "+" },
  { icon: TrendingUp, value: 2000000, label: "Faturados pelos usuários", prefix: "R$ ", suffix: "+" },
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

function StaticStat({ icon: Icon, value, label, prefix, suffix, index }: {
  icon: any; value: number; label: string; prefix: string; suffix: string; index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCountUp(value, 2000, isInView);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-8 space-y-4 relative group">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
        className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2"
      >
        <Icon className="w-8 h-8 text-primary" />
      </motion.div>
      <div className="space-y-1">
        <p className={cn(
          "text-4xl md:text-5xl font-black text-foreground tabular-nums tracking-tighter",
          label.includes("Tempo") && "text-primary"
        )}>
          {prefix}{count.toLocaleString("pt-BR")}{suffix}
        </p>
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
      
      {/* Glow */}
      <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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
    title: "Crie Sites via Quiz com IA",
    desc: "Responda algumas perguntas rápidas sobre o negócio e a IA gera o site completo. Use a busca de leads para encontrar empresas sem site na sua cidade.",
  },
  {
    step: "Etapa - 3",
    icon: Globe,
    title: "Venda e Escale com Leads",
    desc: "Use nossa busca para encontrar clientes reais, apresente o site pronto e feche o contrato. Acompanhe seus resultados e continue escalando.",
  },
];

const faqItems = [
  { 
    q: "Preciso saber programar, fazer design ou entender de tecnologia?", 
    a: "Absolutamente não. A AxionFly foi construída para quem nunca abriu uma linha de código na vida. Você seleciona o nicho do cliente, ajusta cores e estilo — a IA cuida de todo o resto. Em menos de 10 minutos o site está pronto, com design profissional, responsivo e pronto para ser entregue. Se você sabe usar o WhatsApp, você sabe usar a AxionFly." 
  },
  { 
    q: "Os sites gerados têm qualidade real — ou é aquele visual genérico de IA?", 
    a: "Essa é a diferença da AxionFly. São 6 estilos exclusivos de design, com tipografia, cores e estrutura visual pensadas por profissionais — não templates genéricos. O site gerado é indistinguível de um projeto feito por uma agência. Nenhum cliente vai olhar para o resultado e achar que veio de uma IA. O que eles vão ver é um site profissional, rápido e pronto para converter." 
  },
  { 
    q: "Quanto vou conseguir cobrar de cada cliente? Vale a pena financeiramente?", 
    a: "O mercado de sites para negócios locais pratica entre R$ 500 e R$ 3.000 por projeto. Com a AxionFly você entrega em 10 minutos o que uma agência demora dias. Sua margem de lucro é quase total — sem freelancer, sem ferramenta extra, sem dor de cabeça. Um único contrato fechado já paga o investimento na plataforma. Dois contratos e você já está no lucro puro." 
  },
  { 
    q: "Como vou encontrar clientes? Não tenho carteira de contatos nem experiência em vendas.", 
    a: "Você não precisa de carteira de clientes nem de habilidade de vendedor. A AxionFly tem uma ferramenta de Prospecção Automática integrada: você seleciona a cidade e o nicho — barbearia, restaurante, clínica, salão — e o sistema busca negócios que ainda não têm site, te entregando nome, telefone e endereço prontos para o contato. Com o script de vendas incluso, você sabe exatamente o que falar no WhatsApp. A lista de clientes já está montada. Você só precisa enviar a mensagem." 
  },
  { 
    q: "E se o cliente quiser algo diferente do que a IA gerou?", 
    a: "O site gerado pela IA é só o começo — você tem controle total sobre cada detalhe, a qualquer momento. Antes de entregar ou depois de já ter entregue, não importa: fotos, textos, nome do negócio, cores, seções inteiras — tudo pode ser alterado livremente, quantas vezes quiser. Não existe nada travado ou definitivo. Isso significa que se o cliente ligar amanhã pedindo para trocar a foto da fachada, mudar o nome de uma seção ou atualizar o telefone de contato, você resolve em minutos — sem depender de ninguém e sem custo extra. Esse nível de autonomia é o que transforma a AxionFly em um serviço recorrente, não uma venda única." 
  },
  { 
    q: "O que é a Extensão Lovable e por que faz diferença pra mim?", 
    a: "A maioria das ferramentas de criação de sites com IA tem um limite de créditos ou tokens — quando acaba, você para de criar ou paga mais. A Extensão Lovable Infinito elimina esse teto. É uma parceria exclusiva da AxionFly com o Hyperbuild Pro que te permite criar sites sem limite de créditos, sem interrupções, sem custo extra. Você escala seu negócio sem travar. Quanto mais sites criar, mais dinheiro entra — sem que a plataforma consuma sua margem." 
  },
];

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
    <div className="flex items-center gap-1 font-black">
      <div className="bg-white/10 px-1.5 py-0.5 rounded border border-white/10">{format(timeLeft.hours)}</div>
      <span className="opacity-70">:</span>
      <div className="bg-white/10 px-1.5 py-0.5 rounded border border-white/10">{format(timeLeft.minutes)}</div>
      <span className="opacity-70">:</span>
      <div className="bg-white/10 px-1.5 py-0.5 rounded border border-white/10">{format(timeLeft.seconds)}</div>
    </div>
  );
};

import { captureAffiliateFromUrl } from "@/lib/affiliates";

// Barra de progresso de scroll com gradiente animado
function ScrollProgressBar() {
  const { scrollYProgress } = useFramerScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-[48px] md:top-14 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 z-[59] shadow-[0_0_20px_rgba(59,130,246,0.8)]"
    />
  );
}

const Index = () => {
  const navigate = useNavigate();
  const vagasRestantes = useVagasRestantes(4);

  useEffect(() => {
    captureAffiliateFromUrl();
  }, []);

  return (
    <>
      <Helmet>
        <title>AxionFly — Criador de Sites com IA e Prospecção</title>
        <meta name="description" content="Crie sites com IA, prospecte leads e venda mais com a AxionFly. A plataforma completa para impulsionar seu negócio online." />
        <meta property="og:title" content="AxionFly — Criador de Sites com IA e Prospecção" />
        <meta property="og:description" content="Crie sites com IA, prospecte leads e venda mais com a AxionFly." />
        <meta property="og:url" content="https://axionfly.lovable.app/" />
        <link rel="canonical" href="https://axionfly.lovable.app/" />
        <script type="application/ld+json">{JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Preciso saber programar, fazer design ou entender de tecnologia?","acceptedAnswer":{"@type":"Answer","text":"Absolutamente não. A AxionFly foi construída para quem nunca abriu uma linha de código na vida. Você seleciona o nicho do cliente, ajusta cores e estilo — a IA cuida de todo o resto. Em menos de 10 minutos o site está pronto, com design profissional, responsivo e pronto para ser entregue."}},{"@type":"Question","name":"Os sites gerados têm qualidade real — ou é aquele visual genérico de IA?","acceptedAnswer":{"@type":"Answer","text":"São 6 estilos exclusivos de design, com tipografia, cores e estrutura visual pensadas por profissionais — não templates genéricos. O site gerado é indistinguível de um projeto feito por uma agência. Nenhum cliente vai olhar para o resultado e achar que veio de uma IA."}},{"@type":"Question","name":"Quanto vou conseguir cobrar de cada cliente? Vale a pena financeiramente?","acceptedAnswer":{"@type":"Answer","text":"O mercado de sites para negócios locais pratica entre R$ 500 e R$ 3.000 por projeto. Com a AxionFly você entrega em 10 minutos o que uma agência demora dias. Sua margem de lucro é quase total — sem freelancer, sem ferramenta extra, sem dor de cabeça."}},{"@type":"Question","name":"Como vou encontrar clientes? Não tenho carteira de contatos nem experiência em vendas.","acceptedAnswer":{"@type":"Answer","text":"A AxionFly tem uma ferramenta de Prospecção Automática integrada: você seleciona a cidade e o nicho e o sistema busca negócios que ainda não têm site, te entregando nome, telefone e endereço prontos para o contato. Com o script de vendas incluso, você sabe exatamente o que falar no WhatsApp."}},{"@type":"Question","name":"E se o cliente quiser algo diferente do que a IA gerou?","acceptedAnswer":{"@type":"Answer","text":"O site gerado pela IA é só o começo — você tem controle total sobre cada detalhe, a qualquer momento. Fotos, textos, nome do negócio, cores, seções inteiras — tudo pode ser alterado livremente, quantas vezes quiser. Não existe nada travado ou definitivo."}},{"@type":"Question","name":"O que é a Extensão Lovable e por que faz diferença pra mim?","acceptedAnswer":{"@type":"Answer","text":"A Extensão Lovable Infinito elimina o limite de créditos das ferramentas de IA. É uma parceria exclusiva da AxionFly com o Hyperbuild Pro que te permite criar sites sem limite de créditos, sem interrupções, sem custo extra. Você escala seu negócio sem travar."}}]})}</script>
      </Helmet>
      <div className="min-h-screen bg-[#05050a] overflow-x-hidden relative max-w-[100vw]">
      {/* Grid Background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <ScrollProgressBar />
      <div className="relative z-10">
        {/* Urgency Banner — highly visible */}
        <div className="fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-red-600 via-orange-600 to-red-600 min-h-[48px] md:h-14 flex items-center text-center z-[60] shadow-[0_4px_30px_rgba(239,68,68,0.5)] animate-pulse-border">
          <div className="container mx-auto px-2 md:px-3 py-1.5 md:py-0 flex items-center justify-center gap-1.5 md:gap-4">
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="text-white text-base md:text-2xl shrink-0 self-center"
            >
              🔥
            </motion.span>
            <div className="text-white text-[10px] md:text-sm font-black uppercase tracking-[0.1em] md:tracking-[0.18em] flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 md:gap-3 leading-tight">
              <span className="hidden md:inline text-yellow-200">PROMOÇÃO RELÂMPAGO:</span>
              <span>70% OFF na plataforma</span>
              <span className="text-yellow-300 hidden sm:inline">—</span>
              <div className="flex items-center gap-1.5 bg-black/30 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-yellow-400/40 shrink-0">
                <span className="text-[10px] md:text-xs font-black text-yellow-200 uppercase">Termina em</span>
                <CountdownTimer />
              </div>
            </div>
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="text-white text-base md:text-2xl shrink-0 self-center"
            >
              🔥
            </motion.span>
          </div>
        </div>

        {/* Header with offset to avoid covering the banner */}
        <Header className="top-12 md:top-14" />

        <div className="pt-[108px] md:pt-[140px]">

        {/* ═══════════ HERO ═══════════ */}
        <div id="inicio" className="relative w-full min-h-[70vh] md:min-h-[90vh]">
          <div className="absolute inset-0 z-0">
            <Suspense fallback={null}>
              <div className="hidden lg:block absolute inset-0">
                <IsoLevelWarp color="30, 58, 138" density={30} speed={0.9} />
              </div>
              <BackgroundPaths />
            </Suspense>
          </div>
          <div className="relative z-10">
            <HeroSection />
          </div>
        </div>

        {/* ═══════════ FUNCIONALIDADES ═══════════ */}
        <section id="funcionalidades" className="container mx-auto px-4 py-20 md:py-32 relative">
          <SectionPill>Funcionalidades Premium</SectionPill>

          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-[44px] font-black text-foreground tracking-tight mb-6">
              Tudo o que você precisa <br />
              para <span className="gradient-text">escalar seu negócio</span>
            </h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto text-[18px] md:text-[20px] font-normal leading-[1.7]">
              Da prospecção ao fechamento. Uma plataforma completa desenvolvida para transformar iniciantes em agências de sucesso.
            </p>
          </div>

          <div className="space-y-32 md:space-y-48">
            {features.map(({ icon: Icon, title, desc, tag, visual, bullets }: any, i) => (
              <div key={title} className={cn(
                "flex flex-col gap-12 items-center",
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              )}>
                {/* Text Content */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={i % 2 === 0 ? slideFromLeft : slideFromRight}
                  className="flex-1 space-y-6"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(37,99,235,0.1)]">
                    <span className="text-[11px] font-black uppercase tracking-[0.1em] text-primary">{tag}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-foreground">{title}</h3>
                  </div>
                  
                  <p className="text-[#64748b] text-[16px] leading-[1.7] font-normal">
                    {desc}
                  </p>
                  
                  <ul className="space-y-4">
                    {bullets?.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-foreground/80 font-bold">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <Zap className="w-3 h-3 text-primary" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Visual Content */}
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={i % 2 === 0 ? slideFromRight : slideFromLeft}
                  className="flex-1 w-full"
                >
                  <div className="relative">
                    <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full opacity-50 pointer-events-none" />
                    
                    {visual === "globe" ? (
                      <div className="w-full max-w-[280px] md:max-w-md mx-auto aspect-square relative">
                        <Suspense fallback={<div className="w-full aspect-square animate-pulse bg-primary/5 rounded-full" />}>
                          <GlobeCdn className="w-full" speed={0.006} />
                          {/* Tooltips */}
                          <motion.div 
                            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute top-1/4 left-1/4 p-3 rounded-xl glass border-primary/30 shadow-xl z-20"
                          >
                            <p className="text-[10px] font-bold text-foreground">Restaurante • São Paulo • Sem site</p>
                          </motion.div>
                          <motion.div 
                            animate={{ scale: [1.1, 0.9, 1.1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute bottom-1/3 right-1/4 p-3 rounded-xl glass border-primary/30 shadow-xl z-20"
                          >
                            <p className="text-[10px] font-bold text-foreground">Barbearia • Rio de Janeiro • Sem site</p>
                          </motion.div>
                        </Suspense>
                      </div>
                    ) : visual === "dashboard" ? (
                      <div className="scale-90 lg:scale-100">
                        <DashboardMockup />
                      </div>
                    ) : visual === "builder" ? (
                      <SitesBuilderVisual />
                    ) : visual === "extension" ? (
                      <ExtensionInfiniteVisual />
                    ) : visual === "contract" ? (
                      <ContractGeneratorVisual />
                    ) : (
                      <div className="aspect-video rounded-2xl border border-primary/20 bg-card/40 backdrop-blur-sm overflow-hidden flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                        <Icon className="w-32 h-32 text-primary/20 group-hover:scale-110 group-hover:text-primary/30 transition-all duration-500" />
                        <div className="absolute bottom-8 left-8 right-8 p-6 rounded-xl glass border-primary/10">
                          <h4 className="font-black text-foreground mb-1">{title}</h4>
                          <p className="text-xs text-muted-foreground">{desc.substring(0, 60)}...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>


        {/* ═══════════ ETAPAS ═══════════ */}
        <section id="etapas" className="container mx-auto px-4 pt-20 pb-0 md:pt-32 md:pb-0 relative">
          <SectionPill>Processo AxionFly</SectionPill>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-24">
            <h2 className="text-3xl md:text-[44px] font-black text-foreground tracking-tight mb-6">
              Venda seu primeiro site <br />
              em <span className="gradient-text">3 passos simples</span>
            </h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto text-[18px] md:text-[20px] font-normal leading-[1.7]">
              Não reinventamos a roda, apenas automatizamos o que funciona. Siga o método e veja os resultados.
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            {/* Horizontal Line - Desktop */}
            <div className="hidden md:block absolute top-[100px] left-[10%] right-[10%] h-0.5 bg-primary/10 -z-10">
              <motion.div 
                className="h-full bg-primary shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                { step: "01", icon: Zap, title: "Ative sua Ferramenta", desc: "Assine a AxionFly e acesse a plataforma em segundos. Sua base de operações está pronta para começar.", color: "blue" },
                { step: "02", icon: Code2, title: "Responda o Quiz e Crie o Site", desc: "Escolha o nicho e responda algumas perguntas rápidas no quiz — a IA monta o site profissional completo em poucos minutos.", color: "blue" },
                { step: "03", icon: TrendingUp, title: "Encontre o Cliente e Venda", desc: "Use a busca automática de leads na sua região, envie o site pronto pelo WhatsApp com script validado e feche contratos de <span class='text-primary'>R$ 500 a R$ 3.000</span>.", color: "blue" }
              ].map(({ step, icon: Icon, title, desc }, i) => (
                <motion.div
                  key={step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  custom={i + 1}
                  whileHover={{ y: -10 }}
                  className="flex flex-col items-center text-center space-y-8 group"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center text-xl font-black text-primary relative z-10 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-500">
                      {step}
                      {/* Progressive fill background */}
                      <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.3 }}
                        className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                      />
                    </div>
                    <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="space-y-4 px-4 py-8 rounded-3xl bg-card/40 border border-primary/10 backdrop-blur-sm group-hover:border-primary/40 group-hover:bg-card/60 transition-all duration-500">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground">{title}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* CTA bottom of Steps */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 mb-0 text-center"
            >
              <Button 
                variant="outline" 
                size="xl" 
                className="rounded-full font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[11px] sm:text-sm px-6 sm:px-12 border-2 hover:bg-primary/10 group max-w-full whitespace-normal sm:whitespace-nowrap"
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              >
                QUERO COMEÇAR AGORA →
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ AULAS PREMIUM (Carousel) ═══════════ */}
        <section className="py-12 md:py-16">
          <SectionPill>Conheça Área de Membros</SectionPill>
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <FeaturesCarousel />
          </Suspense>
        </section>

        {/* ═══════════ IMMERSIVE SCROLL GALLERY ═══════════ */}
        <Suspense fallback={<div className="min-h-[100vh]" />}>
          <ImmersiveScrollGallery />
        </Suspense>

        {/* ═══════════ MÉTRICAS (Stats) ═══════════ */}
        <section className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-0"
          >
            {stats.map((stat, i) => (
              <React.Fragment key={stat.label}>
                <StaticStat {...stat} index={i} />
                {i < stats.length - 1 && (
                  <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-primary/20 to-transparent self-center mx-12" />
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </section>

        {/* ═══════════ PLANOS ═══════════ */}
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <PricingCards />
        </Suspense>

        {/* ═══════════ PARCERIAS ═══════════ */}
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <LovablePartnership />
        </Suspense>

        {/* ═══════════ FEEDBACKS ═══════════ */}
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <Testimonials />
        </Suspense>

        {/* ═══════════ FAQ ═══════════ */}
        <section id="faq" className="container mx-auto px-4 py-24 md:py-32 relative">
          {/* ambient glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.04] blur-[140px] rounded-full pointer-events-none" />

          <div className="grid lg:grid-cols-[400px_1fr] gap-12 lg:gap-16 max-w-6xl mx-auto relative z-10">
            {/* LEFT — Sticky info */}
            <div className="lg:sticky lg:top-32 lg:self-start space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
                <HelpCircle className="w-3 h-3" />
                Perguntas Frequentes
              </span>
              <h2 className="text-3xl md:text-[40px] font-black text-foreground tracking-tight leading-[1.1]">
                Tudo que você precisa saber <span className="gradient-text">antes de começar</span>
              </h2>
              <p className="text-[#94a3b8] text-base leading-relaxed">
                Reunimos as 6 dúvidas mais comuns dos novos usuários. Ainda ficou com alguma pergunta? Fale com a gente.
              </p>

              {/* Help card */}
              <motion.div
                whileHover={{ y: -3 }}
                className="rounded-2xl bg-gradient-to-br from-primary/[0.12] to-transparent p-6"
                style={{ border: "1px solid rgba(37,99,235,0.25)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-foreground mb-1">Não encontrou sua resposta?</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      Nosso time responde em português, em poucos minutos.
                    </p>
                    <a
                      href="https://wa.me/5500000000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary hover:gap-2.5 transition-all"
                    >
                      Falar no WhatsApp <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT — Accordion */}
            <div className="space-y-3">
              {faqItems.slice(0, 6).map((item, i) => (
                <FAQItem
                  key={i}
                  num={String(i + 1).padStart(2, "0")}
                  question={item.q}
                  answer={item.a}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ CTA FINAL ═══════════ */}
        <section className="container mx-auto px-4 pt-8 pb-16 md:pt-12 md:pb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Urgency pill */}
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-red-500/15 backdrop-blur-sm border-2 border-red-500/50 mb-8 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" style={{ animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite" }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-xs md:text-sm font-black uppercase tracking-[0.15em] text-red-300">
                Promoção relâmpago — 70% OFF por tempo limitado
              </span>
            </motion.div>

            {/* Title */}
            <h2 className="text-[28px] sm:text-4xl md:text-[56px] font-black text-foreground leading-[1.1] tracking-tight max-w-4xl mx-auto mb-5 break-words">
              Comece agora e venda seu <br className="hidden md:block" />
              <span className="gradient-text-animate">primeiro site ainda hoje</span>
            </h2>

            <p className="text-[#94a3b8] text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Junte-se aos +5.000 empreendedores faturando entre R$ 500 e R$ 3.000 por contrato.
              Acesso imediato após confirmação.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Button
                variant="neon"
                size="xl"
                className="rounded-full shimmer-button px-10 h-14 text-base font-black uppercase tracking-[0.15em] w-full sm:w-auto shadow-[0_8px_40px_-8px_rgba(37,99,235,0.5)]"
                onClick={() => {
                  const checkoutUrl = resolveCheckoutUrl("lifetime");
                  navigate(`/auth?redirect_payment=${encodeURIComponent(checkoutUrl)}`);
                }}
              >
                <Zap className="mr-2 w-5 h-5 fill-current" />
                Assinar agora
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="rounded-full px-10 h-14 text-base font-black uppercase tracking-[0.15em] border-2 w-full sm:w-auto hover:bg-primary/10"
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              >
                Ver Planos <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Trust microcredentials */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-x-6 gap-y-3 max-w-3xl mx-auto pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { icon: Lock, label: "Pagamento 100% seguro" },
                { icon: Clock, label: "Setup em 5 minutos" },
                { icon: ShieldCheck, label: "Suporte em português" },
                { icon: Check, label: "Sem experiência necessária" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center justify-center sm:justify-start gap-2 min-w-0">
                  <Icon className="w-3.5 h-3.5 text-primary stroke-[2.5px] shrink-0" />
                  <span className="text-[11px] md:text-xs font-bold text-muted-foreground text-center sm:text-left">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="bg-[#05050a] relative z-10">
          {/* Newsletter */}
          <div className="container mx-auto px-4 pt-16 pb-12 md:pt-20 md:pb-16">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-black text-foreground mb-1">
                  Receba dicas de venda toda semana
                </h3>
                <p className="text-sm text-[#94a3b8]">
                  Estratégias práticas para fechar mais contratos. Sem spam.
                </p>
              </div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex w-full md:w-auto items-center gap-2 bg-[#0D1221] rounded-full p-1.5 border border-white/10"
              >
                <Mail className="w-4 h-4 text-muted-foreground ml-3 shrink-0" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="flex-1 md:w-64 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/60 px-1"
                />
                <Button size="sm" variant="neon" className="rounded-full font-black uppercase tracking-wider text-[11px] h-10 px-5 shrink-0">
                  Assinar
                </Button>
              </form>
            </div>
          </div>

          {/* Main footer columns */}
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1 space-y-4">
                <div className="flex items-center gap-2.5">
                  <img src={axionflyLogo} alt="AxionFly" width="180" height="36" loading="lazy" decoding="async" className="h-9 w-auto" />
                  <span className="text-lg font-black text-foreground tracking-tighter">AxionFly</span>
                </div>
                <p className="text-sm text-[#94a3b8] leading-relaxed max-w-xs">
                  A plataforma completa para criar e vender sites com IA — do primeiro lead ao contrato fechado.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a href="#" aria-label="WhatsApp" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Plataforma */}
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground mb-4">Plataforma</h4>
                <ul className="space-y-2.5 text-sm text-[#94a3b8]">
                  <li><a href="#funcionalidades" className="hover:text-primary transition-colors">Funcionalidades</a></li>
                  <li><a href="#etapas" className="hover:text-primary transition-colors">Como funciona</a></li>
                  <li><a href="#pricing" className="hover:text-primary transition-colors">Planos</a></li>
                  <li><a href="#parcerias" className="hover:text-primary transition-colors">Parcerias</a></li>
                </ul>
              </div>

              {/* Empresa */}
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground mb-4">Empresa</h4>
                <ul className="space-y-2.5 text-sm text-[#94a3b8]">
                  <li><a href="#feedbacks" className="hover:text-primary transition-colors">Depoimentos</a></li>
                  <li><a href="#faq" className="hover:text-primary transition-colors">Perguntas</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground mb-4">Legal</h4>
                <ul className="space-y-2.5 text-sm text-[#94a3b8]">
                  <li><Link to="/termos" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
                  <li><Link to="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link></li>
                  <li><Link to="/legal" className="hover:text-primary transition-colors">Avisos Legais</Link></li>
                  <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom line */}
            <div className="flex flex-wrap items-center justify-center md:justify-between gap-6 pt-8">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-primary" /> SSL Seguro
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Pagamento Protegido
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Suporte 24/7
                </div>
              </div>
              <p className="text-xs text-[#64748b] text-center md:text-right">
                © 2025 AxionFly. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
  </>
  );
};

/* ── FAQ Item Component ── */
function FAQItem({ num, question, answer, defaultOpen = false }: { num?: string; question: string; answer: string; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={false}
      whileHover={{ y: -2 }}
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen ? "bg-primary/[0.06]" : "bg-[#0D1221]/60 hover:bg-[#0D1221]"
      }`}
      style={{
        border: isOpen
          ? "1px solid rgba(37,99,235,0.4)"
          : "1px solid rgba(37,99,235,0.12)",
        boxShadow: isOpen ? "0 0 0 1px rgba(37,99,235,0.1), 0 8px 32px -12px rgba(37,99,235,0.25)" : "none",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-5 md:p-6 text-left group"
      >
        {num && (
          <span className={`text-[11px] font-black tabular-nums tracking-[0.2em] shrink-0 transition-colors ${isOpen ? "text-primary" : "text-primary/50"}`}>
            {num}
          </span>
        )}
        <span className={`flex-1 text-[15px] md:text-base font-black pr-4 transition-colors ${isOpen ? "text-foreground" : "text-foreground/90 group-hover:text-foreground"}`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? "bg-primary text-primary-foreground rotate-45" : "bg-primary/10 text-primary border border-primary/20"}`}>
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 md:px-6 pb-6 pt-0 ml-0 md:ml-9">
              <p className="text-sm text-[#94a3b8] leading-relaxed" dangerouslySetInnerHTML={{ __html: answer }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Index;
