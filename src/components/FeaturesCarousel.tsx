import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dashboardImg from "@/assets/carousel-dashboard.jpg";
import vendaImg from "@/assets/carousel-venda.jpg";

const slides = [
  { id: "dashboard", src: dashboardImg, alt: "Como acessar a ferramenta AxionFly" },
  { id: "venda", src: vendaImg, alt: "Venda sem gastar com a AxionFly" },
];

// Triple for infinite illusion
const extended = [...slides, ...slides, ...slides];

export default function FeaturesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const getCardWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.children[0]) return 0;
    return (track.children[0] as HTMLElement).offsetWidth + 32; // gap-8
  }, []);

  const getSetWidth = useCallback(() => getCardWidth() * slides.length, [getCardWidth]);

  // Auto-scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf: number;

    // Start in the middle set
    const sw = getSetWidth();
    if (sw > 0) track.scrollLeft = sw;

    const animate = () => {
      if (!paused && track) {
        track.scrollLeft += 0.5;
        const sw = getSetWidth();
        if (sw > 0) {
          if (track.scrollLeft >= sw * 2) track.scrollLeft -= sw;
          if (track.scrollLeft <= 0) track.scrollLeft += sw;
        }
      }
      // Update active dot
      const sw = getSetWidth();
      const cw = getCardWidth();
      if (sw > 0 && cw > 0) {
        const offset = track.scrollLeft % sw;
        setActiveIndex(Math.round(offset / cw) % slides.length);
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [paused, getSetWidth, getCardWidth]);

  const scroll = useCallback(
    (dir: number) => {
      const track = trackRef.current;
      if (!track) return;
      track.scrollBy({ left: dir * getCardWidth(), behavior: "smooth" });
    },
    [getCardWidth]
  );

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

      <div className="relative group">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />

        {/* Arrows */}
        <button
          onClick={() => scroll(-1)}
          aria-label="Anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Próximo"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Track */}
        <div
          ref={trackRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex gap-8 overflow-x-hidden scroll-smooth px-8 items-center justify-start"
          style={{ scrollbarWidth: "none" }}
        >
          {extended.map((slide, i) => (
            <motion.div
              key={`${slide.id}-${i}`}
              whileHover={{ scale: 1.03, y: -6 }}
              className="shrink-0 w-[300px] md:w-[380px] rounded-2xl overflow-hidden border border-border/40 hover:border-primary/30 transition-all duration-300 relative"
              style={{
                boxShadow: "0 0 50px -15px hsl(var(--primary) / 0.2)",
              }}
            >
              {/* Blue tint overlay */}
              <div
                className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply opacity-70"
                style={{ background: "hsl(217 91% 20%)" }}
              />
              <div
                className="absolute inset-0 z-10 pointer-events-none opacity-20"
                style={{ background: "linear-gradient(180deg, hsl(217 91% 30% / 0.4) 0%, hsl(var(--background)) 100%)" }}
              />
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-auto object-cover"
                loading="lazy"
                draggable={false}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 w-2"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
