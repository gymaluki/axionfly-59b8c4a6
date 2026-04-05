import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, BookOpen, Code2, Check, Sparkles, Zap, Users, TrendingUp, Globe, Search, MousePointerClick } from "lucide-react";
import { motion, type Easing } from "framer-motion";
import { HeroSection } from "@/components/ui/hero-1";
import { Header } from "@/components/ui/header-3";
import { GlobeCdn } from "@/components/ui/cobe-globe-cdn";
import Testimonials from "@/components/Testimonials";
import PricingCards from "@/components/PricingCards";

const ease: Easing = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 60, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.15, duration: 0.9, ease },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { delay: i * 0.12, duration: 0.8, ease },
  }),
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -80, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.15, duration: 0.9, ease },
  }),
};

const slideFromRight = {
  hidden: { opacity: 0, x: 80, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.15, duration: 0.9, ease },
  }),
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
      <p className="text-3xl font-black text-foreground tabular-nums">
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
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Grid Background */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

      <div className="relative z-10">
        <Header />

        {/* Hero */}
        <HeroSection />

        {/* Stats */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <AnimatedStat key={stat.label} {...stat} index={i} />
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Da prospecção ao contrato em <span className="gradient-text">3 passos</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Sem experiência técnica. Sem programação. Do zero ao site vendido em minutos.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {howItWorks.map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                custom={i + 1}
                className="text-center space-y-4 relative"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
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

        {/* Features + Globe */}
        <section className="container mx-auto px-4 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Três ferramentas de lucro.{" "}
              <span className="gradient-text">Uma plataforma completa.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">20+ nichos, 6 estilos de design, busca em todos os estados do Brasil. Tudo pra você vender mais.</p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid gap-6">
              {features.map(({ icon: Icon, title, desc, tag }, i) => (
                <motion.div
                  key={title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={slideFromLeft}
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
            {/* Globe */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md relative">
                <GlobeCdn className="w-full" speed={0.008} />
              </div>
            </div>
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
        <Testimonials />

        <PricingCards />

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
