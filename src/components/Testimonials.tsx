import { motion } from "framer-motion";
import { Star } from "lucide-react";

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
    role: "Criadora de Sites · SP",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    text: "Criar sites pra comércio e já ter os clientes pra poder vender é a melhor coisa já feita, sensacional!",
    result: "Vendas na primeira semana",
    stars: 5,
  },
  {
    name: "Igor Freitosa",
    role: "Freelancer Digital · RJ",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    text: "Adorei demais, hoje mesmo já vendi até pra uma amiga minha que tem barbearia.",
    result: "Venda no mesmo dia",
    stars: 5,
  },
  {
    name: "Raphael Calderon",
    role: "Empreendedor Digital · MG",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    text: "Fácil, prático e incrível. Vale o investimento!",
    result: "ROI no primeiro cliente",
    stars: 5,
  },
  {
    name: "O Nostalgista",
    role: "Criador de Conteúdo · PR",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    text: "Parabéns aos criadores da ferramenta, fiz as minhas primeiras vendas online e consegui juntar uma boa grana.",
    result: "Primeiras vendas online",
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
          Resultados reais de quem já vende sites com a AxionFly.
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
                  <Star key={s} className="w-3.5 h-3.5 fill-accent text-accent" />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
              <span className="text-xs font-semibold text-primary">{t.result}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
