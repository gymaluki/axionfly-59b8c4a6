import { motion } from "framer-motion";
import { Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const testimonials = [
  {
    name: "Lucas Ferreira",
    role: "Criador de Sites · SP",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    text: "Encontrei 30 barbearias sem site no Google Maps. Fechei 8 contratos na primeira semana. A ferramenta se pagou no primeiro cliente.",
    result: "8 sites vendidos em 7 dias",
    stars: 5,
  },
  {
    name: "Camila Santos",
    role: "Freelancer Digital · RJ",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    text: "Criei um e-book de nail art em 30 segundos e usei como isca no Instagram. O tráfego qualificado triplicou.",
    result: "+300% tráfego qualificado",
    stars: 5,
  },
  {
    name: "Rafael Oliveira",
    role: "Dono de Agência · MG",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    text: "A AxionFly cortou meu tempo de prospecção de 3 horas para 15 minutos. Agora entrego mais sites cobrando o mesmo.",
    result: "2x mais projetos/mês",
    stars: 5,
  },
  {
    name: "Juliana Costa",
    role: "Web Designer · PR",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    text: "Achei pizzarias e hamburguerias sem presença online em minutos. O prompt gerou um site que o dono amou de primeira.",
    result: "R$ 3.200 em 10 dias",
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
