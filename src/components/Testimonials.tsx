import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const springTransition = { type: "spring" as const, stiffness: 80, damping: 20 };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const testimonials = [
  {
    name: "Estter Oliveira",
    initials: "EO",
    text: "Criar sites pra comércio e já ter os clientes pra poder vender é a melhor coisa já feita, sensacional!",
    stars: 5,
  },
  {
    name: "Igor Freitosa",
    initials: "IF",
    text: "Adorei demais, hoje mesmo já vendi até pra uma amiga minha que tem barbearia.",
    stars: 5,
  },
  {
    name: "Raphael Calderon",
    initials: "RC",
    text: "Fácil, prático e incrível. Vale o investimento!",
    stars: 5,
  },
  {
    name: "O Nostalgista",
    initials: "ON",
    text: "Parabéns aos criadores da ferramenta, fiz as minhas primeiras vendas online e consegui juntar uma boa grana.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-10 md:py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="flex justify-center mb-8">
        <span className="inline-flex items-center rounded-full border border-border bg-card/80 backdrop-blur-sm px-5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          Feedbacks - Resultados Reais
        </span>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="text-center mb-16 space-y-4"
      >
        <p className="text-muted-foreground text-lg">
          Veja o que nossos usuários estão dizendo.
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
          Resultados reais de quem já usa a <span className="gradient-text">AxionFly</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i + 1}
            whileHover={{ 
              scale: 1.03, 
              y: -6,
              boxShadow: "0 25px 50px -15px hsl(var(--primary) / 0.12)",
              transition: springTransition
            }}
            className="glass rounded-2xl p-7 space-y-4 transition-all duration-500 hover:neon-border relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <Quote className="w-5 h-5 text-primary/30 absolute top-4 right-4" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{t.initials}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: s * 0.04, type: "spring", stiffness: 200 }}
                  >
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed relative z-10">"{t.text}"</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
