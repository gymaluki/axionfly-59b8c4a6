import { motion } from "framer-motion";
import { Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  }),
};

const testimonials = [
  {
    name: "Lucas Ferreira",
    role: "Dono de Barbearia · SP",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    text: "Em 2 semanas fechei 14 novos clientes só com a prospecção do Maps. Paguei a ferramenta no primeiro dia.",
    result: "+14 clientes em 2 semanas",
    stars: 5,
  },
  {
    name: "Camila Santos",
    role: "Manicure Freelancer · RJ",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    text: "Gerei um e-book de nail art em 30 segundos e usei como isca no Instagram. Ganhei 200 seguidores em 3 dias.",
    result: "+200 seguidores em 3 dias",
    stars: 5,
  },
  {
    name: "Rafael Oliveira",
    role: "Agência Digital · MG",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    text: "A fábrica de sites cortou meu tempo de criação pela metade. Entrego mais rápido e cobro o mesmo valor.",
    result: "2x mais projetos/mês",
    stars: 5,
  },
  {
    name: "Juliana Costa",
    role: "Dona de Pizzaria · PR",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    text: "Achei todos os fornecedores e concorrentes da minha região em minutos. Informação que antes levava dias.",
    result: "Economia de 15h/semana",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="text-center mb-12 space-y-3"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Quem usa, <span className="gradient-text">não volta atrás</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Resultados reais de pessoas reais que já automatizaram seu crescimento.
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
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass rounded-2xl p-6 space-y-4 transition-all duration-300 hover:neon-border"
          >
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
