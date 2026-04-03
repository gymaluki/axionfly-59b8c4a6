import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, BookOpen, Code2, Check, Sparkles, Zap, Users, TrendingUp } from "lucide-react";
import { motion, type Easing } from "framer-motion";
import { Header } from "@/components/ui/header-3";
import { HeroSection } from "@/components/ui/hero-3";
import { Marquee } from "@/components/ui/marquee";

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
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />

      {/* Hero */}
      <main className="grow">
        <HeroSection />
      </main>

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
  );
};

export default Index;
