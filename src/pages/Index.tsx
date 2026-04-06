import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Code2, Sparkles, Zap, Users, TrendingUp, Globe, Search, MousePointerClick, BarChart3 } from "lucide-react";
import { motion, useInView, type Easing } from "framer-motion";
import { HeroSection } from "@/components/ui/hero-1";
import IsoLevelWarp from "@/components/ui/isometric-wave-grid-background";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Header } from "@/components/ui/header-3";
import { GlobeCdn } from "@/components/ui/cobe-globe-cdn";
import Testimonials from "@/components/Testimonials";
import PricingCards from "@/components/PricingCards";
import LovablePartnership from "@/components/LovablePartnership";
import FeaturesCarousel from "@/components/FeaturesCarousel";

const ease: Easing = [0.16, 1, 0.3, 1];
const springTransition = { type: "spring" as const, stiffness: 80, damping: 20 };

const fadeUp = {
  hidden: { opacity: 0, y: 60, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.12, duration: 0.8, ease },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.7, ease },
  }),
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -80, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.15, duration: 0.8, ease },
  }),
};

const slideFromRight = {
  hidden: { opacity: 0, x: 80, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.15, duration: 0.8, ease },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
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

function AnimatedStat({ icon: Icon, value, label, prefix, suffix, index }: {
  icon: any; value: number; label: string; prefix: string; suffix: string; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCountUp(value, 1500, isInView);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={scaleIn}
      custom={index}
      whileHover={{ scale: 1.06, y: -4, transition: springTransition }}
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
  { q: "Preciso saber programar para criar sites?", a: "Não! A AxionFly usa inteligência artificial para gerar sites completos. Você só preenche o nome do negócio, escolhe o nicho, as cores e o estilo de design — a IA faz todo o trabalho técnico. Zero código, zero complicação." },
  { q: "Quais tipos de site posso criar?", a: "São mais de 20 nichos prontos: barbearias, pizzarias, hamburguerias, clínicas, pet shops, academias, restaurantes, salões de beleza, escritórios de advocacia, imobiliárias, contabilidades, estúdios de estética, escolas de idiomas e muito mais." },
  { q: "Como funciona a busca de leads?", a: "Selecione o estado (todos os 27 estados do Brasil estão disponíveis), escolha a cidade e o nicho de negócio. O sistema busca automaticamente e entrega nome, telefone e endereço — tudo pronto para você prospectar." },
  { q: "Quanto posso cobrar por cada site criado?", a: "Nossos usuários cobram entre R$ 500 e R$ 3.000 por site. Como a IA cria o site em minutos, seu custo de produção é praticamente zero — a margem de lucro é altíssima." },
  { q: "Posso personalizar os sites gerados?", a: "Sim! Você escolhe o nicho, define cores, seleciona entre 7 combinações de fontes e 6 estilos de design diferentes. Cada site sai único e profissional." },
  { q: "O que está incluso no plano vitalício?", a: "Acesso ilimitado ao criador de sites com IA (20+ nichos), busca de leads em todos os estados do Brasil, dashboard de vendas e todas as atualizações futuras. Pague uma vez, use para sempre." },
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

        {/* ═══════════ HERO ═══════════ */}
        <div id="inicio" className="relative w-full min-h-[90vh]">
          <IsoLevelWarp color="30, 58, 138" density={45} speed={1.2} />
          <BackgroundPaths />
          <div className="relative z-10">
            <HeroSection />
          </div>
        </div>

        {/* ═══════════ STATS ═══════════ */}
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

        {/* ═══════════ ETAPAS (How It Works) ═══════════ */}
        <section id="etapas" className="container mx-auto px-4 py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.04)_0%,transparent_70%)] pointer-events-none" />
          
          <SectionPill>Veja como começar - Simples e Fácil</SectionPill>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-20 space-y-4">
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
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={springTransition}
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300"
                >
                  <Icon className="w-6 h-6 text-primary" />
                </motion.div>
                <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-4 py-1 text-xs font-medium text-muted-foreground">
                  {step}
                </span>
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════ FERRAMENTAS (Features + Globe) ═══════════ */}
        <section className="container mx-auto px-4 py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.05)_0%,transparent_60%)] pointer-events-none" />
          
          <SectionPill>Conheça a Plataforma</SectionPill>
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              Comece de forma simples.{" "}
              <br className="hidden md:block" />
              Escale com <span className="gradient-text">automações precisas!</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              20+ nichos, 6 estilos de design, busca em todos os estados do Brasil. Tudo pra você vender mais.
            </p>
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

        {/* ═══════════ CAROUSEL ═══════════ */}
        <section>
          <SectionPill>Conheça Área de Membros</SectionPill>
          <FeaturesCarousel />
        </section>

        {/* ═══════════ FEEDBACKS ═══════════ */}
        <div id="feedbacks">
          <Testimonials />
        </div>

        {/* ═══════════ PLANOS ═══════════ */}
        <PricingCards />

        <LovablePartnership />

        {/* ═══════════ CTA FINAL ═══════════ */}
        <section className="container mx-auto px-4 py-20 relative">
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
        <section id="faq" className="container mx-auto px-4 py-20">
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
