import { motion } from "framer-motion";
import { Star, CheckCircle2, Quote, TrendingUp, Users, Heart } from "lucide-react";

const testimonials = [
  {
    name: "Estter Oliveira",
    initials: "EO",
    city: "São Paulo, SP",
    result: "R$ 1.500 no 1º site",
    text: "Criar sites pra comércio e já ter os clientes pra poder vender é a melhor coisa já feita, sensacional!",
    stars: 5,
    featured: true,
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
    text: "Parabéns aos criadores, fiz minhas primeiras vendas online e juntei uma boa grana para escalar.",
    stars: 5,
  },
];

const socialProof = [
  { icon: Star, value: "4.9", label: "Nota média", suffix: "/5" },
  { icon: Users, value: "5.000", label: "Empreendedores ativos", suffix: "+" },
  { icon: TrendingUp, value: "R$ 2M", label: "Faturados em 2025", suffix: "+" },
  { icon: Heart, value: "92", label: "Recomendam", suffix: "%" },
];

export default function Testimonials() {
  const featured = testimonials.find((t) => t.featured)!;
  const others = testimonials.filter((t) => !t.featured);

  return (
    <section id="feedbacks" className="container mx-auto px-4 py-24 md:py-32 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/[0.04] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

      {/* Pill */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-center mb-8 relative z-10"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
          <Star className="w-3 h-3 fill-primary" />
          Resultados Reais
        </span>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center mb-12 max-w-3xl mx-auto relative z-10"
      >
        <h2 className="text-3xl md:text-[44px] font-black text-foreground tracking-tight leading-[1.1] mb-5">
          Quem confia na AxionFly <br className="hidden md:block" />
          <span className="gradient-text">já mudou de jogo</span>
        </h2>
        <p className="text-[#94a3b8] text-[17px] md:text-lg leading-relaxed">
          Mais de 5.000 empreendedores transformando a AxionFly em sua principal fonte de renda.
          Veja o que estão dizendo.
        </p>
      </motion.div>

      {/* Social proof strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-16 relative z-10"
      >
        {socialProof.map(({ icon: Icon, value, label, suffix }) => (
          <div
            key={label}
            className="rounded-2xl bg-[#0D1221]/80 backdrop-blur-sm p-4 text-center group hover:border-primary/30 transition-all duration-300"
            style={{ border: "1px solid rgba(59,130,246,0.12)" }}
          >
            <Icon className="w-4 h-4 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xl md:text-2xl font-black text-foreground tracking-tighter tabular-nums">
              {value}
              <span className="text-primary">{suffix}</span>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">
              {label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Featured + grid */}
      <div className="grid lg:grid-cols-5 gap-6 max-w-6xl mx-auto relative z-10">
        {/* FEATURED CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6 }}
          className="lg:col-span-2 relative rounded-3xl bg-gradient-to-br from-primary/[0.12] via-[#0D1221] to-[#0D1221] p-8 flex flex-col overflow-hidden"
          style={{ border: "1px solid rgba(59,130,246,0.3)" }}
        >
          {/* Big quote watermark - subtle */}
          <Quote
            className="absolute -top-4 -right-4 w-32 h-32 text-primary/[0.07] rotate-180"
            strokeWidth={1}
          />

          {/* Featured badge */}
          <span className="self-start text-[10px] font-black uppercase tracking-[0.18em] text-primary bg-primary/15 border border-primary/30 px-3 py-1 rounded-full mb-6 inline-flex items-center gap-1.5">
            <Star className="w-3 h-3 fill-primary" />
            Depoimento em destaque
          </span>

          <p className="text-xl md:text-2xl text-foreground font-bold leading-snug mb-8 relative z-10">
            "{featured.text}"
          </p>

          <div className="mt-auto flex flex-col gap-4">
            <span className="inline-flex self-start items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/25">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-black text-emerald-500 uppercase tracking-wider">
                {featured.result}
              </span>
            </span>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-primary/40 bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="text-sm font-black text-primary">{featured.initials}</span>
                </div>
                <div>
                  <h4 className="font-black text-foreground text-[15px] leading-tight">
                    {featured.name}
                  </h4>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{featured.city}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: featured.stars }).map((_, s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* OTHER CARDS */}
        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-6 items-stretch">
          {others.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl bg-[#0D1221] p-6 flex flex-col h-full transition-all duration-300 hover:border-primary/30"
              style={{ border: "1px solid rgba(59,130,246,0.12)" }}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-[13px] font-black text-primary">{t.initials}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-foreground text-[14px] leading-tight truncate">
                    {t.name}
                  </h4>
                  <p className="text-[12px] text-muted-foreground mt-0.5 truncate">{t.city}</p>
                </div>
              </div>

              {/* Result badge */}
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">
                    {t.result}
                  </span>
                </span>
              </div>

              {/* Quote */}
              <p className="mt-4 text-[14px] text-foreground/80 leading-relaxed">"{t.text}"</p>

              {/* Stars at bottom */}
              <div className="flex gap-0.5 mt-auto pt-5">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
