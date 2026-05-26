import React, { useEffect, useRef, useState, lazy, Suspense, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Code2, Sparkles, Zap, Users, TrendingUp, Globe, Search, MousePointerClick, BarChart3, FileText, MessageSquare, Infinity as LucideInfinity, ChevronDown, ChevronLeft, ChevronRight, Check, Star, Instagram, Phone, Youtube, HelpCircle, ShieldCheck, Clock, Lock, Mail, Plus } from "lucide-react";
import { motion, useInView, useScroll as useFramerScroll, useTransform, type Easing, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/ui/hero-1";
import { Header } from "@/components/ui/header-3";
import { cn } from "@/lib/utils";
import { DashboardMockup } from "@/components/ui/dashboard-mockup";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { GlowCard } from "@/components/ui/spotlight-card";
import { BentoGrid } from "@/components/ui/bento-grid";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

import axionflyLogo from "@/assets/axionfly-logo-x.png";


// Below-the-fold heavy components: lazy for faster initial paint
const PricingCards = lazy(() => import("@/components/PricingCards"));
const ActiveUsersBar = lazy(() => import("@/components/ActiveUsersBar"));
const FeaturesCarousel = lazy(() => import("@/components/FeaturesCarousel"));
const Testimonials = lazy(() => import("@/components/Testimonials"));

import { SitesBuilderVisual, ExtensionInfiniteVisual, ContractGeneratorVisual } from "@/components/PremiumFeatureVisuals";
import { resolveCheckoutUrl } from "@/lib/affiliates";
import { useVagasRestantes } from "@/hooks/useVagasRestantes";
import { ShaderBackground } from "@/components/ui/shader-background";

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

/* ── Mini visuais animados dos cards de funcionalidades ── */
function FeatureMiniVisual({ visual, Icon, index }: { visual: string; Icon: any; index: number }) {
  if (visual === "globe") {
    return (
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Anéis de glow ao redor do globo */}
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-[280px] h-[280px] rounded-full border border-dashed border-primary/20"
        />
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[230px] h-[230px] rounded-full bg-primary/20 blur-[60px]"
        />
        <div className="relative w-[230px] h-[230px] md:w-[260px] md:h-[260px] flex items-center justify-center">
          <Suspense fallback={<div className="w-full h-full animate-pulse rounded-full bg-primary/5" />}>
            <GlobeCdn className="w-full h-full" speed={0.006} />
          </Suspense>
        </div>
      </div>
    );
  }

  if (visual === "builder") {
    return (
      <div className="absolute inset-0 p-4 flex flex-col gap-2">
        {/* Janela mock */}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-amber-500/60" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
          <div className="ml-2 h-3 flex-1 rounded bg-primary/10" />
        </div>
        {/* Conteúdo do "site" */}
        <div className="grid grid-cols-3 gap-2 flex-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="col-span-2 rounded-md bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/30 flex items-end p-2"
          >
            <div className="space-y-1 w-full">
              <div className="h-1.5 w-3/4 rounded-full bg-foreground/70" />
              <div className="h-1 w-1/2 rounded-full bg-foreground/30" />
            </div>
          </motion.div>
          <div className="space-y-1.5">
            {[0, 1, 2].map((j) => (
              <motion.div
                key={j}
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.6, delay: 0.3 + j * 0.1 }}
                viewport={{ once: true }}
                className="h-3 rounded-sm bg-primary/20 border border-primary/30"
              />
            ))}
          </div>
        </div>
        <div className="flex gap-1.5">
          {[40, 70, 50].map((w, j) => (
            <div key={j} className="h-1 rounded-full bg-primary/30" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (visual === "extension") {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute w-[140px] h-[140px] rounded-full border border-dashed border-primary/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute w-[100px] h-[100px] rounded-full border border-dashed border-primary/40"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.6)]"
        >
          <Icon className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.18em] text-primary">
          ∞ Sem limites
        </div>
      </div>
    );
  }

  if (visual === "contract") {
    return (
      <div className="absolute inset-0 p-4 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-[110px] h-[130px] rounded-md bg-gradient-to-br from-background to-card border border-primary/30 p-3 shadow-[0_8px_30px_hsl(var(--primary)/0.25)]"
        >
          <div className="space-y-1.5">
            <div className="h-1.5 w-2/3 rounded-full bg-primary/60" />
            <div className="h-1 w-full rounded-full bg-foreground/15" />
            <div className="h-1 w-5/6 rounded-full bg-foreground/15" />
            <div className="h-1 w-3/4 rounded-full bg-foreground/15" />
            <div className="h-1 w-full rounded-full bg-foreground/15" />
            <div className="h-1 w-1/2 rounded-full bg-foreground/15" />
          </div>
          {/* Selo */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: -12 }}
            transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
            viewport={{ once: true }}
            className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg"
          >
            <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (visual === "dashboard") {
    const bars = [55, 80, 45, 95, 65, 88];
    return (
      <div className="absolute inset-0 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Receita</div>
            <div className="text-base font-black text-foreground">R$ 15.400</div>
          </div>
          <div className="text-[10px] font-black text-emerald-500">+24%</div>
        </div>
        <div className="flex items-end justify-between gap-1.5 flex-1">
          {bars.map((h, j) => (
            <motion.div
              key={j}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              transition={{ duration: 0.7, delay: j * 0.08, ease: "easeOut" }}
              viewport={{ once: true }}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/30 to-primary"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Icon className="w-14 h-14 text-primary/30" />
    </div>
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
  {
    icon: TrendingUp,
    title: "Avaliador de Preço de Sites",
    desc: "Descubra exatamente quanto cobrar por cada site. Responda perguntas sobre nicho, recursos e perfil do cliente — a IA calcula o preço justo de mercado para você fechar com confiança.",
    tag: "NOVO",
    visual: "dashboard",
    bullets: [
      "Calcula o valor ideal do site com base no nicho",
      "Considera recursos, complexidade e perfil do cliente",
      "Sugere faixa de preço para você nunca cobrar de menos"
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

const Index = () => {
  const navigate = useNavigate();
  const vagasRestantes = useVagasRestantes(4);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [featuresPaused, setFeaturesPaused] = useState(false);
  const featuresTotal = features.length;
  const goPrev = () => setFeatureIndex((i) => (i - 1 + featuresTotal) % featuresTotal);
  const goNext = () => setFeatureIndex((i) => (i + 1) % featuresTotal);

  // Autoplay do slider de funcionalidades
  useEffect(() => {
    if (featuresPaused) return;
    const id = setInterval(() => {
      setFeatureIndex((i) => (i + 1) % featuresTotal);
    }, 5000);
    return () => clearInterval(id);
  }, [featuresPaused, featuresTotal]);

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
      <div className="min-h-screen bg-[#03060f] overflow-x-hidden relative max-w-[100vw]">
      <ShaderBackground />
      <div className="relative z-10">
        {/* Header */}
        <Header />

        <div className="pt-[80px] md:pt-[96px]">


        {/* ═══════════ HERO ═══════════ */}
        <div id="inicio" className="relative w-full min-h-[70vh] md:min-h-[90vh]">
          <div className="absolute inset-0 z-0" />
          <div className="relative z-10">
            <HeroSection />
          </div>
        </div>

        {/* ═══════════ DEMO SCROLL ANIMATION ═══════════ */}
        <section id="demo" className="relative">
          <ContainerScroll
            titleComponent={
              <div className="space-y-6 px-4">
                <div className="flex justify-center">
                  <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-5 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-primary backdrop-blur-sm">
                    Veja por dentro
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-[1.05]">
                  Veja como é fácil <span className="gradient-text">criar um site e fechar um contrato</span> <br className="hidden md:block" />
                  — do zero, em 10 minutos
                </h2>
                <p className="text-[#94a3b8] max-w-2xl mx-auto text-[16px] md:text-[18px] font-normal leading-[1.7]">
                  Assista o tour completo da plataforma. Do celular ou do computador, tudo no mesmo lugar.
                </p>
              </div>
            }
          >
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
              {/* Vídeo desktop */}
              <video
                className="w-full h-full object-cover rounded-2xl"
                autoPlay
                muted
                loop
                playsInline
                poster="/placeholder.svg"
              >
                <source src="/demo.mp4" type="video/mp4" />
              </video>

              {/* Mockup celular sobreposto no canto */}
              <div className="hidden md:block absolute bottom-4 right-4 lg:bottom-6 lg:right-6 w-[110px] lg:w-[140px] aspect-[9/19] rounded-[22px] border-[3px] border-[#1a1d2c] bg-[#05060d] shadow-[0_25px_60px_-10px_rgba(37,99,235,0.55)] overflow-hidden">
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-2.5 rounded-full bg-black z-10" />
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/demo-mobile.mp4" type="video/mp4" />
                  <source src="/demo.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </ContainerScroll>
        </section>

        {/* ═══════════ FUNCIONALIDADES (ORBITAL) ═══════════ */}
        <section id="funcionalidades" className="container mx-auto px-4 py-12 md:py-16 relative">
          <SectionPill>Funcionalidades Premium</SectionPill>

          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-[44px] font-black text-foreground tracking-tight mb-6">
              Tudo o que você precisa <br />
              para <span className="gradient-text">escalar seu negócio</span>
            </h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto text-[18px] md:text-[20px] font-normal leading-[1.7]">
              Da prospecção ao fechamento. Uma plataforma completa desenvolvida para transformar iniciantes em agências de sucesso.
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div aria-hidden className="pointer-events-none absolute top-1/4 -left-32 w-[420px] h-[420px] bg-primary/10 rounded-full blur-[140px]" />
            <div aria-hidden className="pointer-events-none absolute bottom-1/4 -right-32 w-[420px] h-[420px] bg-primary/10 rounded-full blur-[140px]" />

            <RadialOrbitalTimeline
              autoCycleMs={3500}
              timelineData={features.map((f, i) => ({
                id: i + 1,
                title: f.title,
                date: f.tag,
                content: f.desc,
                category: f.tag,
                icon: f.icon,
                relatedIds: [
                  ((i + 1) % features.length) + 1,
                  ((i + features.length - 1) % features.length) + 1,
                ],
                status: "completed" as const,
                energy: 80 + ((i * 7) % 20),
              }))}
            />
          </div>
        </section>

        {/* ═══════════ AULAS PREMIUM (Carousel) ═══════════ */}
        <section className="py-12 md:py-16">
          <SectionPill>Conheça Área de Membros</SectionPill>
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <FeaturesCarousel />
          </Suspense>
        </section>

        {/* ═══════════ MÉTRICAS (Stats) ═══════════ */}
        <section className="container mx-auto px-4 py-10 md:py-14 relative">
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

        {/* ═══════════ USUÁRIOS ATIVOS ═══════════ */}
        <Suspense fallback={<div className="min-h-[160px]" />}>
          <ActiveUsersBar />
        </Suspense>

        {/* ═══════════ FEEDBACKS ═══════════ */}
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <Testimonials />
        </Suspense>

        {/* ═══════════ FAQ ═══════════ */}
        <section id="faq" className="container mx-auto px-4 py-16 md:py-20 relative">
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

        {/* CTA final removido a pedido */}

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
                <div className="flex items-center">
                  <img src={axionflyLogo} alt="AxionFly" width="320" height="80" loading="lazy" decoding="async" className="h-16 md:h-20 w-auto" />
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
