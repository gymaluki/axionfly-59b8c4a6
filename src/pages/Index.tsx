import React, { useEffect, useRef, useState, lazy, Suspense, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Code2, Sparkles, Zap, Users, TrendingUp, Globe, Search, MousePointerClick, BarChart3, FileText, MessageSquare, Infinity as LucideInfinity, ChevronDown, Check, Star, Instagram, Phone, Youtube } from "lucide-react";
import { motion, useInView, useScroll as useFramerScroll, useTransform, type Easing, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/ui/hero-1";
import { Header } from "@/components/ui/header-3";
import { cn } from "@/lib/utils";
import { DashboardMockup } from "@/components/ui/dashboard-mockup";
import { ParticleBackground } from "@/components/ui/particle-background";

import PricingCards from "@/components/PricingCards";
import LovablePartnership from "@/components/LovablePartnership";
import FeaturesCarousel from "@/components/FeaturesCarousel";
import Testimonials from "@/components/Testimonials";

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
    icon: LucideInfinity,
    title: "Extensão Lovable Infinito",
    desc: "Crie sites sem limites de créditos. Parceria exclusiva com Hyperbuild Pro para garantir sua escala total. Comece agora sem preocupações com tokens.",
    tag: "INFINITO",
    visual: "extension"
  },
  {
    icon: Code2,
    title: "Criador de Sites com IA",
    desc: "Escolha entre 20+ nichos, personalize cores, fontes e estilo de design — a IA monta o site completo em minutos. Design profissional pronto para vender.",
    tag: "PRINCIPAL",
    visual: "builder"
  },
  {
    icon: MapPin,
    title: "Prospecção Automática",
    desc: "Selecione estado e cidade. O sistema busca negócios sem site e entrega nome, telefone e endereço — tudo pronto pra você fechar seu primeiro contrato hoje.",
    tag: "27 ESTADOS",
    visual: "globe"
  },
  {
    icon: FileText,
    title: "Gerador de Contrato",
    desc: "Gere contratos profissionais personalizados com nome do cliente, serviço e valores — prontos para enviar e fechar negócio na hora, com segurança jurídica.",
    tag: "AUTOMÁTICO",
    visual: "contract"
  },
  {
    icon: BarChart3,
    title: "Dashboard de Vendas",
    desc: "Acompanhe seus lucros, clientes atendidos e sites criados em um painel completo. Tenha controle total do seu faturamento e crescimento.",
    tag: "GESTÃO",
    visual: "dashboard"
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
        <p className="text-4xl md:text-5xl font-black text-foreground tabular-nums tracking-tighter">
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

        {/* ═══════════ FUNCIONALIDADES ═══════════ */}
        <section id="funcionalidades" className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden">
          <SectionPill>Funcionalidades Premium</SectionPill>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6">
              Tudo o que você precisa <br />
              para <span className="gradient-text">escalar seu negócio</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium">
              Da prospecção ao fechamento. Uma plataforma completa desenvolvida para transformar iniciantes em agências de sucesso.
            </p>
          </motion.div>

          <div className="space-y-32 md:space-y-48">
            {features.map(({ icon: Icon, title, desc, tag, visual }, i) => (
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
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{tag}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-foreground">{title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-medium">
                    {desc}
                  </p>
                  
                  <ul className="space-y-4">
                    {['Recurso exclusivo', 'Aumento de produtividade', 'Pronto para uso'].map((item) => (
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
                      <div className="w-full max-w-md mx-auto aspect-square relative">
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
        <section id="etapas" className="container mx-auto px-4 py-20 md:py-32 relative">
          <SectionPill>Processo AxionFly</SectionPill>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6">
              Venda seu primeiro site <br />
              em <span className="gradient-text">3 passos simples</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium">
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
                { step: "01", icon: Zap, title: "Ative sua Ferramenta", desc: "Assine a AxionFly e conecte sua IA em segundos. Sua base de operações está pronta.", color: "blue" },
                { step: "02", icon: Code2, title: "Crie e Encontre", desc: "Escolha o nicho, gere o site com IA e busque leads qualificados na sua região automaticamente.", color: "blue" },
                { step: "03", icon: TrendingUp, title: "Venda e Escale", desc: "Aborde pelo WhatsApp com script validado e feche contratos de R$ 500 a R$ 3.000.", color: "blue" }
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
                    <p className="text-muted-foreground font-medium leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* CTA bottom of Steps */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 text-center"
            >
              <Button 
                variant="outline" 
                size="xl" 
                className="rounded-full font-black uppercase tracking-[0.2em] px-12 border-2 hover:bg-primary/10 group"
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              >
                Pronto pra começar? <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ AULAS PREMIUM (Carousel) ═══════════ */}
        <section className="py-20 md:py-32">
          <SectionPill>Conheça Área de Membros</SectionPill>
          <FeaturesCarousel />
        </section>

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
        <PricingCards />

        {/* ═══════════ PARCERIAS ═══════════ */}
        <LovablePartnership />

        {/* ═══════════ FEEDBACKS ═══════════ */}
        <Testimonials />

        {/* ═══════════ FAQ ═══════════ */}
        <section id="faq" className="container mx-auto px-4 py-20 md:py-32 relative">
          <SectionPill>Perguntas Frequentes</SectionPill>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-7xl font-black text-foreground mb-6">
              Dúvidas <span className="gradient-text">Frequentes</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium">
              Tudo o que você precisa saber para começar sua jornada com segurança.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </section>

        {/* ═══════════ CTA FINAL ═══════════ */}
        <section className="container mx-auto px-4 py-20 md:py-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.2)_0%,transparent_70%)] pointer-events-none" />
          <ParticleBackground />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-6xl mx-auto rounded-[3rem] border border-primary/20 bg-card/60 backdrop-blur-xl p-12 md:p-24 text-center space-y-12"
          >
            <h2 className="text-5xl md:text-8xl font-black text-foreground leading-[1.05] tracking-tighter">
              Comece agora e venda seu <br />
              <span className="gradient-text-animate">primeiro site hoje</span>
            </h2>
            
            <div className="flex flex-col items-center space-y-8">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-3 px-8 py-2.5 rounded-full bg-primary/10 border border-primary/20"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-black text-primary uppercase tracking-[0.2em]">🔥 Últimas vagas com preço atual</span>
              </motion.div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl mx-auto pt-4">
                <Button 
                  variant="neon" 
                  size="xl" 
                  className="rounded-full shimmer-button px-12 h-18 text-xl font-black uppercase tracking-[0.2em] w-full sm:w-auto shadow-[0_0_40px_rgba(37,99,235,0.4)]"
                  onClick={() => navigate("/auth")}
                >
                  <Zap className="mr-3 w-6 h-6 fill-current" />
                  Assinar agora
                </Button>
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="rounded-full px-12 h-18 text-xl font-black uppercase tracking-[0.2em] border-2 w-full sm:w-auto hover:bg-primary/10"
                  onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Ver Planos <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 pt-8 border-t border-primary/10 w-full">
                {['Sem experiência necessária', 'Setup em 5 minutos', 'Suporte em português'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary stroke-[3px]" />
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="border-t border-primary/20 bg-background relative z-10 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
              <div className="md:col-span-2 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-primary fill-primary" />
                  </div>
                  <span className="text-3xl font-black text-foreground tracking-tighter">AxionFly</span>
                </div>
                <p className="text-muted-foreground max-w-sm text-xl font-medium leading-relaxed">
                  A plataforma líder em criação de sites com IA e prospecção automática para comércios locais.
                </p>
                <div className="flex items-center gap-4">
                  {[Instagram, Youtube, Phone].map((Icon, i) => (
                    <a key={i} href="#" className="w-14 h-14 rounded-full border border-primary/10 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group">
                      <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="space-y-8">
                <h4 className="text-sm font-black text-foreground uppercase tracking-[0.3em]">Links Rápidos</h4>
                <ul className="space-y-4">
                  {['Início', 'Etapas', 'Funcionalidades', 'Planos', 'FAQ'].map((link) => (
                    <li key={link}>
                      <a 
                        href={`#${link.toLowerCase() === 'funcionalidades' ? 'funcionalidades' : link.toLowerCase() === 'início' ? 'inicio' : link.toLowerCase()}`} 
                        className="text-muted-foreground hover:text-primary transition-colors font-bold text-lg"
                        onClick={(e) => {
                          e.preventDefault();
                          const id = link.toLowerCase() === 'funcionalidades' ? 'funcionalidades' : link.toLowerCase() === 'início' ? 'inicio' : link.toLowerCase();
                          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-8">
                <h4 className="text-sm font-black text-foreground uppercase tracking-[0.3em]">Plataforma</h4>
                <ul className="space-y-4">
                  {['Entrar', 'Criar Conta', 'Suporte', 'Termos'].map((link) => (
                    <li key={link}>
                      <a href="/auth" className="text-muted-foreground hover:text-primary transition-colors font-bold text-lg">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="pt-12 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest text-center">
                © 2026 AxionFly · Todos os direitos reservados
              </p>
              <div className="flex items-center gap-10 text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
                <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

/* ── FAQ Item Component ── */
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      initial={false}
      className={`rounded-3xl border transition-all duration-500 overflow-hidden ${
        isOpen ? "border-primary/40 bg-primary/5" : "border-border/50 bg-card/40"
      }`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-8 text-left group"
      >
        <span className="text-xl font-black text-foreground pr-8 group-hover:text-primary transition-colors">{question}</span>
        <div className={`p-2 rounded-full border border-primary/20 bg-primary/5 transition-transform duration-500 ${isOpen ? "rotate-180 bg-primary text-primary-foreground" : "text-primary"}`}>
          <ChevronDown className="w-6 h-6" />
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-8 pt-0 border-t border-primary/10">
              <p className="text-muted-foreground font-medium leading-relaxed text-lg">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Index;
