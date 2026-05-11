import { useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import slideAcessar from "@/assets/carousel-acessar.webp";
import slideVenda from "@/assets/carousel-venda-sem-gastar.webp";
import slideSuporte from "@/assets/carousel-suporte.webp";

const slides = [
  { id: "acessar", src: slideAcessar, title: "Como Acessar a Ferramenta", desc: "Passo a passo completo para configurar e acessar seu painel." },
  { id: "venda", src: slideVenda, title: "Venda Sem Gastar", desc: "Estratégias para vender por R$1 e escalar sem investimento inicial." },
  { id: "suporte", src: slideSuporte, title: "Suporte Premium", desc: "Atendimento dedicado para você crescer com automações precisas." },
];

const CARD_W_MD = 350;
const GAP = 32;
const SPEED = 0.8; // px per frame

export default function FeaturesCarousel() {
  const navigate = useNavigate();
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
    <section className="py-20 overflow-hidden relative">
      <div className="container mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl md:text-[44px] font-black text-foreground tracking-tight leading-[1.1]">
            Aulas <span className="gradient-text">Premium e Exclusivas</span>
          </h2>
          <p className="text-[#94a3b8] max-w-2xl mx-auto text-[18px] md:text-[20px] font-normal leading-[1.7]">
            Conteúdo estratégico para você dominar a criação de sites e fechar contratos de alto valor.
          </p>
        </motion.div>
      </div>

      <div className="relative" ref={containerRef}>
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 md:w-64 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 md:w-64 z-10 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          className="flex cursor-grab active:cursor-grabbing px-4"
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
              className="shrink-0 w-[280px] md:w-[350px] aspect-[4/5] rounded-3xl overflow-hidden border border-border/40 hover:border-primary/40 transition-all duration-500 relative select-none group"
              style={{
                boxShadow: "0 0 40px -15px hsl(var(--primary) / 0.2)",
              }}
            >
              {/* Image */}
              <div className="w-full h-full bg-[#05050a]">
                <img
                  src={slide.src}
                  alt={slide.title}
                  className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  draggable={false}
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content removed per user request */}
              
              {/* Hover Glow */}
              <div className="absolute -inset-1 border-2 border-primary/0 group-hover:border-primary/40 rounded-[2rem] transition-all duration-500" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-20 text-center space-y-8 px-4">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/60">
          Acesso incluso em todos os planos · Novos conteúdos toda semana
        </p>
        <Button 
          variant="outline" 
          size="xl" 
          className="rounded-full font-black uppercase tracking-[0.2em] px-12 h-16 border-2 hover:bg-primary/10"
          onClick={() => navigate('/auth')}
        >
          Ver todos os conteúdos →
        </Button>
      </div>
    </section>
  );
}
