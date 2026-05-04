import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2 } from "lucide-react";

const springTransition = { type: "spring" as const, stiffness: 80, damping: 20 };

const testimonials = [
  {
    name: "Estter Oliveira",
    initials: "EO",
    city: "São Paulo, SP",
    result: "R$ 1.500 no 1º site",
    text: "Criar sites pra comércio e já ter os clientes pra poder vender é a melhor coisa já feita, sensacional!",
    stars: 5,
  },
  {
    name: "Igor Freitosa",
    initials: "IF",
    city: "Curitiba, PR",
    result: "3 clientes em 1 semana",
    text: "Adorei demais, hoje mesmo já vendi até pra uma amiga minha que tem barbearia. O sistema de leads é surreal.",
    stars: 5,
  },
  {
    name: "Raphael Calderon",
    initials: "RC",
    city: "Belo Horizonte, MG",
    result: "Faturamento 5k/mês",
    text: "Fácil, prático e incrível. Vale o investimento! A IA cria sites que realmente convencem os donos de comércio.",
    stars: 5,
  },
  {
    name: "Fogaça",
    initials: "FG",
    city: "Rio de Janeiro, RJ",
    result: "Escalando para agência",
    text: "Parabéns aos criadores, fiz as minhas primeiras vendas online e consegui juntar uma boa grana para escalar.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="feedbacks" className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="flex justify-center mb-8">
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-6 py-1.5 text-[11px] font-black uppercase tracking-[0.1em] text-[#94a3b8] shadow-sm backdrop-blur-sm">
          Feedbacks Reais
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20 space-y-6"
      >
        <h2 className="text-4xl md:text-7xl font-black text-foreground leading-[1.1]">
          Histórias de quem <br />
          já <span className="gradient-text">mudou de jogo</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium">
          Mais de 5.000 empreendedores utilizando a AxionFly para criar sua própria fonte de renda.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            whileHover={{ y: -8 }}
            className="rounded-3xl border border-border/50 bg-card/40 p-8 space-y-6 transition-all duration-500 hover:border-primary/40 backdrop-blur-sm relative group"
          >
            <div className="absolute top-8 right-8">
              <Quote className="w-10 h-10 text-primary/10 group-hover:text-primary/20 transition-colors" />
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xl font-black text-primary">{t.initials}</span>
              </div>
              <div>
                <h4 className="font-black text-foreground text-lg">{t.name}</h4>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.city}</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">{t.result}</span>
            </div>

            <p className="text-lg text-foreground/80 leading-relaxed font-medium">"{t.text}"</p>

            <div className="flex gap-1 pt-2">
              {Array.from({ length: t.stars }).map((_, s) => (
                <Star key={s} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
