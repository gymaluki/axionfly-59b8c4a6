import { motion } from "framer-motion";
import { Star, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const springTransition = { type: "spring" as const, stiffness: 80, damping: 20 };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const stats = [
  { label: "Usuários Ativos", value: "5.000+" },
  { label: "Cidades Atendidas", value: "Todos os Estados" },
  { label: "Sites Gerados", value: "12.000+" },
];

export default function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="glass rounded-[2.5rem] p-8 md:p-16 text-center space-y-8 relative border-primary/30 shadow-[0_0_50px_-12px_hsl(var(--primary)/0.2)]"
      >
        {/* Rating Badge */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            A ferramenta nº 1 para vender sites no Brasil
          </p>
        </div>

        <h2 className="text-4xl md:text-7xl font-black text-foreground tracking-tight leading-[1.1]">
          Sua liberdade financeira <br />
          começa com a <span className="gradient-text">AxionFly</span>
        </h2>

        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Pare de procurar clientes e comece a fechar contratos. Com nossa IA e prospecção automática, você tem tudo o que precisa para faturar alto todos os meses.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            variant="neon" 
            size="lg" 
            className="h-14 px-10 text-lg rounded-full w-full sm:w-auto group shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)]"
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          >
            Quero Começar Agora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground font-medium">
            Pagamento único ou mensal • Acesso imediato
          </p>
        </div>

        {/* Mini Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-border/50 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
