import { motion } from "framer-motion";
import { Check, Sparkles, Shield, Zap, ArrowUpRight } from "lucide-react";
import googleMapsLogo from "@/assets/google-maps-logo.webp";
import lovableLogo from "@/assets/lovable-logo.webp";
import hyperbuildLogo from "@/assets/hyperbuild-logo.webp";

const partners = [
  {
    num: "01",
    logo: lovableLogo,
    name: "Lovable",
    badge: "IA Criadora de Sites",
    description:
      "A IA que transforma uma ideia em um site profissional pronto pra vender em poucos minutos.",
    kpi: { value: "10.000+", label: "sites gerados pela parceria" },
    benefits: [
      "Sites ultra realistas",
      "Design profissional automático",
      "Código limpo e editável",
    ],
  },
  {
    num: "02",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg",
    name: "Google Maps",
    badge: "Dados Oficiais",
    description:
      "Encontre negócios sem site em qualquer cidade do Brasil usando dados oficiais do Google.",
    kpi: { value: "27", label: "estados cobertos no Brasil" },
    benefits: [
      "Busca em todos os estados",
      "Dados sempre atualizados",
      "Filtros inteligentes por nicho",
    ],
  },
  {
    num: "03",
    logo: hyperbuildLogo,
    name: "Hyperbuild Pro",
    badge: "Créditos Infinitos",
    description:
      "Extensão exclusiva que libera créditos ilimitados no Lovable. Escale sem travas e sem custos extras.",
    kpi: { value: "∞", label: "créditos no Lovable, sem limite" },
    benefits: [
      "Créditos infinitos garantidos",
      "Extensão exclusiva AxionFly",
      "Produção em escala industrial",
    ],
  },
];

const trustStats = [
  { icon: Shield, label: "Parceiros oficiais", value: "100%" },
  { icon: Zap, label: "Uptime garantido", value: "99,9%" },
  { icon: Sparkles, label: "Integrações ativas", value: "3" },
];

export default function LovablePartnership() {
  return (
    <section id="parcerias" className="container mx-auto px-4 py-24 md:py-32 relative">
      {/* Decorative blobs */}
      <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.04] blur-[120px] rounded-full pointer-events-none" />

      {/* Pill */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-center mb-8"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
          <Sparkles className="w-3 h-3" />
          Stack Tecnológico
        </span>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center mb-16 max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-[44px] font-black text-foreground tracking-tight leading-[1.1] mb-5">
          Construído sobre os ombros <br className="hidden md:block" />
          de <span className="gradient-text">gigantes da tecnologia</span>
        </h2>
        <p className="text-[#94a3b8] text-[17px] md:text-lg leading-relaxed">
          Não reinventamos a roda — combinamos as ferramentas mais poderosas do mercado em uma única
          plataforma. Você recebe IA de ponta, dados oficiais e escala ilimitada.
        </p>
      </motion.div>

      {/* Trust strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mb-16 grid grid-cols-3 gap-4 p-4 rounded-2xl border border-primary/10 bg-[#05050a]/60 backdrop-blur-sm"
      >
        {trustStats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center text-center gap-1">
            <Icon className="w-4 h-4 text-primary mb-1" />
            <span className="text-xl md:text-2xl font-black text-foreground tabular-nums">{value}</span>
            <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-bold">
              {label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Partner cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {partners.map((p, idx) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="group relative rounded-3xl bg-[#05050a] p-7 flex flex-col overflow-hidden transition-all duration-300"
            style={{ border: "1px solid rgba(37,99,235,0.15)" }}
          >
            {/* Animated gradient ring on hover */}
            <div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0%, rgba(37,99,235,0.6) 25%, transparent 50%, rgba(37,99,235,0.4) 75%, transparent 100%)",
                animation: "spin 6s linear infinite",
                padding: "1px",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />

            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Header: number + logo */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] font-black text-primary/60 tracking-[0.3em]">
                {p.num}
              </span>
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden">
                <img
                  src={p.logo}
                  alt={p.name}
                  className="w-7 h-7 object-contain group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Name + badge */}
            <h3 className="text-xl font-black text-foreground mb-2">{p.name}</h3>
            <span className="self-start text-[10px] font-black uppercase tracking-[0.15em] text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full mb-4">
              {p.badge}
            </span>

            {/* Description */}
            <p className="text-sm text-[#94a3b8] leading-relaxed mb-6 min-h-[60px]">
              {p.description}
            </p>

            {/* KPI block */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/[0.08] to-transparent border border-primary/15 p-4 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-foreground tracking-tighter">
                  {p.kpi.value}
                </span>
                <ArrowUpRight className="w-4 h-4 text-primary mb-1" />
              </div>
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold mt-1 block">
                {p.kpi.label}
              </span>
            </div>

            {/* Benefits */}
            <ul className="space-y-3 mt-auto">
              {p.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/85 font-medium">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-primary/15 shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-primary stroke-[3px]" />
                  </div>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Bottom integration line */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12 text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold"
      >
        Lovable · Google Maps · Hyperbuild Pro — integrados nativamente na AxionFly
      </motion.p>
    </section>
  );
}
