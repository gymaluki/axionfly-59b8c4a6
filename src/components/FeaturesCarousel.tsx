import { useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import dashboardImg from "@/assets/carousel-dashboard.jpg";
import vendaImg from "@/assets/carousel-venda.jpg";

const slides = [
  { id: "dashboard", src: dashboardImg, alt: "Como acessar a ferramenta AxionFly" },
  { id: "venda", src: vendaImg, alt: "Venda sem gastar com a AxionFly" },
  { id: "dashboard2", src: dashboardImg, alt: "Dashboard AxionFly" },
  { id: "venda2", src: vendaImg, alt: "Vendas AxionFly" },
];

const CARD_W = 220;
const CARD_W_MD = 280;
const GAP = 32;
const SPEED = 0.5; // px per frame

export default function FeaturesCarousel() {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(false);

  // We duplicate slides enough to fill the view
  const allSlides = [...slides, ...slides, ...slides];
  const totalWidth = allSlides.length * (CARD_W_MD + GAP);

  // Auto-scroll when not dragging
  useAnimationFrame(() => {
    if (dragRef.current) return;
    const cur = x.get();
    const half = totalWidth / 3;
    let next = cur - SPEED;
    if (next <= -half) next += half;
    x.set(next);
  });

  const handleDragStart = () => {
    dragRef.current = true;
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    // Wrap position to avoid drifting too far
    const half = totalWidth / 3;
    const cur = x.get();
    if (cur <= -half) x.set(cur + half);
    if (cur >= 0) x.set(cur - half);
    dragRef.current = false;
    setIsDragging(false);
  };

  return (
    <section className="py-10 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            Aulas <span className="gradient-text">Premium e Exclusivas</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Conteúdo exclusivo para você dominar a criação e venda de sites com IA.
          </p>
        </motion.div>
      </div>

      <div className="relative" ref={containerRef}>
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          style={{ x, gap: `${GAP}px` }}
          drag="x"
          dragConstraints={{ left: -totalWidth, right: 0 }}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {allSlides.map((slide, i) => (
            <div
              key={`${slide.id}-${i}`}
              className="shrink-0 w-[220px] md:w-[280px] rounded-2xl overflow-hidden border border-border/40 hover:border-primary/30 transition-all duration-300 relative select-none"
              style={{
                boxShadow: "0 0 50px -15px hsl(var(--primary) / 0.2)",
              }}
            >
              {/* Blue tint overlay */}
              <div
                className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply opacity-70"
                style={{ background: "hsl(225 73% 30%)" }}
              />
              <div
                className="absolute inset-0 z-10 pointer-events-none opacity-20"
                style={{ background: "linear-gradient(180deg, hsl(217 91% 30% / 0.4) 0%, hsl(var(--background)) 100%)" }}
              />
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-auto object-cover pointer-events-none"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
