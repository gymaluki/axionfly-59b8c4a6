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
  { label: "Estados", value: "Todos os 27" },
  { label: "Sites Gerados", value: "12.000+" },
];

export default function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none opacity-40" />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="glass rounded-[2rem] p-8 md:p-14 text-center space-y-6 relative border-primary/40 shadow-[0_0_60px_-15px_hsl(var(--primary)/0.3)] bg-black/40 backdrop-blur-3xl overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        {/* Rating Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3 h-3 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.2em]">
            A maior plataforma de escala para comércios locais
          </p>
        </div>

        <h2 className="text-3xl md:text-6xl font-black text-foreground tracking-tight leading-[1.15]">
          Domine o mercado de <br />
          <span className="gradient-text">venda de sites</span> com a AxionFly
        </h2>

        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          Junte-se a mais de 5.000 usuários que transformaram a forma de prospectar e vender. 
          Interface intuitiva, IA de ponta e resultados reais.
        </p>

        <div className="flex flex-col items-center gap-6 pt-4">
          <Button 
            variant="neon" 
            size="lg" 
            className="h-14 px-12 text-lg rounded-full w-full sm:w-auto group shadow-[0_0_35px_-5px_hsl(var(--primary)/0.6)] hover:scale-105 transition-all duration-300"
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          >
            Começar Agora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 px-4 py-2 rounded-full border border-border/50">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Acesso vitalício disponível por tempo limitado
          </div>
        </div>

        {/* Mini Stats Bar */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 pt-10 border-t border-border/30 max-w-2xl mx-auto">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-0.5">
              <p className="text-xl md:text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
              <p className="text-[9px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
