import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, BookOpen, Code2, Check, Sparkles, Zap, Users, TrendingUp } from "lucide-react";
import { motion, type Easing } from "framer-motion";
import { Header } from "@/components/ui/header-3";
import { Marquee } from "@/components/ui/marquee";
import ShutterText from "@/components/ui/hero-shutter-text";
import { GlobeCdn } from "@/components/ui/cobe-globe-cdn";

const ease: Easing = [0, 0, 0.2, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease },
  }),
};

const features = [
  { icon: MapPin, title: "Prospecção Maps", desc: "Busque qualquer nicho no Google Maps e tenha nome, telefone e endereço prontos para contato. Zero trabalho manual." },
  { icon: BookOpen, title: "Gerador de E-books", desc: "Cole o tema, clique em gerar. Em 30 segundos você tem um e-book completo para vender ou usar como isca digital." },
  { icon: Code2, title: "Fábrica de Sites", desc: "Descreva o site dos sonhos e receba um prompt profissional pronto para colar no Lovable e criar na hora." },
];

const stats = [
  { icon: Users, value: "2.300+", label: "Clientes ativos" },
  { icon: TrendingUp, value: "R$ 4.2M", label: "Gerados pelos clientes" },
  { icon: Zap, value: "47s", label: "Tempo médio de geração" },
];

const partnerLogos = [
  "Google Maps", "WhatsApp Business", "Lovable", "Stripe", "OpenAI", "Vercel",
];

const pricingFeatures = [
  "Prospecção Maps ilimitada",
  "Gerador de E-books com IA",
  "Fábrica de Sites (Prompts)",
  "Suporte prioritário",
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Grid Background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial fade over grid */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 20%, hsl(var(--background)) 70%)",
        }}
      />

      <div className="relative z-10">
        <Header />

        {/* Hero with Shutter Text + Globe */}
        <section className="container mx-auto px-4 pt-20 pb-8 md:pt-28 md:pb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div className="space-y-6">
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                Prospecção automática via Google Maps
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="space-y-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-[1.1]">
                  Encontre clientes em
                </h1>
                <ShutterText
                  words={["BARBEARIAS", "PIZZARIAS", "MANICURES", "DENTISTAS", "ACADEMIAS", "CLÍNICAS"]}
                  interval={2200}
                />
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed pt-2">
                  de forma <span className="text-foreground font-semibold">100% automatizada</span>.
                  O Google Maps faz o trabalho pesado. Você só fecha o contrato.
                </p>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="neon" size="lg" onClick={() => navigate("/auth")}>
                    <Zap className="w-4 h-4 mr-1" />
                    Começar Agora — É Grátis
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
                    Ver Planos <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            {/* Right: Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
              className="hidden md:flex items-center justify-center"
            >
              <div className="w-full max-w-md relative">
                <GlobeCdn speed={0.004} />
                <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl -z-10" />
              </div>
            </motion.div>
          </div>
        </section>

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

        {/* Social Proof Stats */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center space-y-2 p-6 rounded-xl glass"
              >
                <Icon className="w-6 h-6 text-primary mx-auto" />
                <p className="text-3xl font-black text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Três máquinas de resultado.{" "}
              <span className="gradient-text">Uma plataforma.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Cada ferramenta foi construída para eliminar o trabalho que trava seu crescimento.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                whileHover={{ scale: 1.03, y: -4 }}
                className="glass rounded-2xl p-6 space-y-4 hover:neon-border transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA mid-page */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="glass rounded-2xl p-8 md:p-12 text-center space-y-5 neon-border max-w-3xl mx-auto"
          >
            <Sparkles className="w-8 h-8 text-primary mx-auto" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Seu concorrente já automatizou. E você?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Cada dia sem automação é dinheiro deixado na mesa. Configure tudo em 5 minutos, sem precisar de experiência técnica.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button variant="neon" size="lg" onClick={() => navigate("/auth")}>
                <Zap className="w-4 h-4 mr-1" />
                Quero Automatizar Agora
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="container mx-auto px-4 py-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Investimento que se paga no{" "}
              <span className="gradient-text">primeiro cliente</span>
            </h2>
            <p className="text-muted-foreground">Sem surpresas. Sem taxa escondida. Comece e fature.</p>
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
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} whileHover={{ scale: 1.03, y: -4 }} className="relative glass rounded-2xl p-8 space-y-6 flex flex-col neon-border transition-shadow duration-300 hover:glow-purple">
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

        <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
          © 2026 ScaleAI. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Index;
