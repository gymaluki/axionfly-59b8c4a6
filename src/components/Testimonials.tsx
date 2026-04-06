import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const springTransition = { type: "spring" as const, stiffness: 80, damping: 20 };

const fadeUp = {
  hidden: { opacity: 0, y: 60, filter: "blur(10px)", scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const testimonials = [
  {
    name: "Estter Oliveira",
    role: "São Paulo · SP",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    text: "Criar sites pra comércio e já ter os clientes pra poder vender é a melhor coisa já feita, sensacional!",
    stars: 5,
  },
  {
    name: "Igor Freitosa",
    role: "Rio de Janeiro · RJ",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    text: "Adorei demais, hoje mesmo já vendi até pra uma amiga minha que tem barbearia.",
    stars: 5,
  },
  {
    name: "Raphael Calderon",
    role: "Belo Horizonte · MG",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    text: "Fácil, prático e incrível. Vale o investimento!",
    stars: 5,
  },
  {
    name: "O Nostalgista",
    role: "Curitiba · PR",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    text: "Parabéns aos criadores da ferramenta, fiz as minhas primeiras vendas online e consegui juntar uma boa grana.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-24 relative">
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
        <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
          Quem usa, <span className="gradient-text">não volta atrás</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          Resultados reais de quem já usa a AxionFly.
        </p>
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
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + s * 0.08, type: "spring", stiffness: 200 }}
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
