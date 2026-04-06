import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  BookOpen,
  Laptop,
  TrendingUp,
  ShoppingCart,
  Zap,
  BarChart3,
  Users,
} from "lucide-react";

const cards = [
  {
    id: "dashboard",
    title: "AUTOMATIZE",
    subtitle: "Sua Máquina de Sites",
    metric: "R$ 50.000+",
    metricLabel: "Faturados por Usuários",
    description:
      "Dashboard completo com métricas de vendas, sites criados e leads prospectados. Controle tudo em um só lugar.",
    icons: [Laptop, BarChart3, TrendingUp],
    accent: "primary",
  },
  {
    id: "prospecting",
    title: "PROSPECTE",
    subtitle: "Sem Esforço Manual",
    metric: "27 Estados",
    metricLabel: "Cobertura Nacional",
    description:
      "Encontre negócios sem site em qualquer cidade do Brasil. Nome, telefone e endereço prontos pra contato.",
    icons: [MapPin, Users, Globe],
    accent: "accent",
  },
  {
    id: "sell",
    title: "VENDA",
    subtitle: "Sem Custos Extras",
    metric: "R$ 3.000",
    metricLabel: "Por Site Criado",
    description:
      "Monte sites profissionais em minutos com IA e venda por até R$ 3.000. Custo de produção praticamente zero.",
    icons: [ShoppingCart, Zap, BookOpen],
    accent: "primary",
  },
  {
    id: "ebooks",
    title: "CRIE",
    subtitle: "E-books com IA",
    metric: "30 seg",
    metricLabel: "Tempo de Criação",
    description:
      "Gere e-books profissionais em segundos. Use como isca digital ou venda diretamente aos seus clientes.",
    icons: [BookOpen, Zap, TrendingUp],
    accent: "accent",
  },
];

// duplicate for infinite illusion
const extendedCards = [...cards, ...cards, ...cards];

export default function FeaturesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const speedRef = useRef(0.6); // px per frame

  // infinite scroll via rAF
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf: number;
    const singleSetWidth = () => {
      const child = track.children[0] as HTMLElement | undefined;
      if (!child) return 0;
      return (child.offsetWidth + 32) * cards.length; // gap = 32px (gap-8)
    };

    const animate = () => {
      if (!paused && track) {
        track.scrollLeft += speedRef.current;
        const sw = singleSetWidth();
        if (sw > 0 && track.scrollLeft >= sw * 2) {
          track.scrollLeft -= sw;
        }
        if (track.scrollLeft <= 0) {
          track.scrollLeft += sw;
        }
      }
      // update active dot
      const sw = singleSetWidth();
      if (sw > 0) {
        const offset = track.scrollLeft % sw;
        const cardW = sw / cards.length;
        setActiveIndex(Math.round(offset / cardW) % cards.length);
      }
      raf = requestAnimationFrame(animate);
    };
    // start in the middle set
    track.scrollLeft = singleSetWidth();
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const scroll = useCallback((dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[0] as HTMLElement | undefined;
    if (!child) return;
    const cardW = child.offsetWidth + 32;
    track.scrollBy({ left: dir * cardW, behavior: "smooth" });
  }, []);

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Conheça o poder da{" "}
            <span className="gradient-text">AxionFly</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ferramentas integradas para prospectar, criar e vender — tudo com IA.
          </p>
        </motion.div>
      </div>

      {/* Carousel wrapper */}
      <div className="relative group">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

        {/* Arrows */}
        <button
          onClick={() => scroll(-1)}
          aria-label="Anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Próximo"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Track */}
        <div
          ref={trackRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex gap-8 overflow-x-hidden scroll-smooth px-8"
          style={{ scrollbarWidth: "none" }}
        >
          {extendedCards.map((card, i) => (
            <FeatureCard key={`${card.id}-${i}`} card={card} index={i} />
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {cards.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "bg-primary w-6"
                : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({
  card,
  index,
}: {
  card: (typeof cards)[number];
  index: number;
}) {
  const isPrimary = card.accent === "primary";

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -6 }}
      className="shrink-0 w-[340px] md:w-[400px] rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 hover:border-primary/30"
      style={{
        backgroundColor: "hsl(var(--card))",
        backgroundImage: isPrimary
          ? "radial-gradient(at 20% 80%, hsl(var(--primary) / 0.1) 0px, transparent 50%), radial-gradient(at 80% 20%, hsl(var(--accent) / 0.06) 0px, transparent 50%)"
          : "radial-gradient(at 80% 80%, hsl(var(--accent) / 0.1) 0px, transparent 50%), radial-gradient(at 20% 20%, hsl(var(--primary) / 0.06) 0px, transparent 50%)",
        boxShadow: isPrimary
          ? "0 0 40px -10px hsl(var(--primary) / 0.15)"
          : "0 0 40px -10px hsl(var(--accent) / 0.12)",
      }}
    >
      {/* Top visual area */}
      <div className="relative h-52 flex items-center justify-center overflow-hidden">
        {/* Glowing orb */}
        <div
          className="absolute w-32 h-32 rounded-full blur-3xl opacity-30"
          style={{
            background: isPrimary
              ? "hsl(var(--primary))"
              : "hsl(var(--accent))",
          }}
        />
        {/* Floating icons */}
        <div className="relative flex items-center gap-6">
          {card.icons.map((Icon, idx) => (
            <motion.div
              key={idx}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                delay: idx * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`w-14 h-14 rounded-xl flex items-center justify-center border ${
                idx === 1
                  ? "w-20 h-20 rounded-2xl bg-primary/15 border-primary/30"
                  : "bg-secondary/60 border-border/40"
              }`}
            >
              <Icon
                className={`${
                  idx === 1 ? "w-9 h-9 text-primary" : "w-6 h-6 text-muted-foreground"
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div>
          <h3 className="text-2xl font-black text-foreground tracking-tight">
            {card.title}
          </h3>
          <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
            {card.subtitle}
          </p>
        </div>

        {/* Metric badge */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-baseline gap-2">
          <span className="text-2xl font-black gradient-text">
            {card.metric}
          </span>
          <span className="text-xs text-muted-foreground">{card.metricLabel}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {card.description}
        </p>
      </div>
    </motion.div>
  );
}
