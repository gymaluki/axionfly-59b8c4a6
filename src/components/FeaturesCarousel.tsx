import { useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const slides = [
  { id: "aula1", src: "https://uzsvdtahsnkfjuuuipfh.supabase.co/storage/v1/object/public/files/uploads/ShsuAt31DMUOEDUhs93J86XVyP73/1777674241404-5zck6-image.png", title: "Primeiros Passos", desc: "Configurando sua conta e ativando a IA" },
  { id: "aula2", src: "https://uzsvdtahsnkfjuuuipfh.supabase.co/storage/v1/object/public/files/uploads/ShsuAt31DMUOEDUhs93J86XVyP73/1777674241404-5zck6-image.png", title: "Busca de Clientes", desc: "Como usar o Google Maps para prospectar" },
  { id: "aula3", src: "https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=2342&auto=format&fit=crop", title: "Fechamento de Vendas", desc: "O script de WhatsApp que vende sites" },
  { id: "aula4", src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2340&auto=format&fit=crop", title: "Escalando Agência", desc: "Contratando pessoas e automatizando processos" },
  { id: "aula5", src: "https://images.unsplash.com/photo-1531403001884-48a6202a632a?q=80&w=2340&auto=format&fit=crop", title: "Design de Elite", desc: "Como deixar seus sites com visual premium" },
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
              <img
                src={slide.src}
                alt={slide.title}
                className="w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                draggable={false}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 space-y-2 z-20">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 backdrop-blur-md px-3 py-1 border border-primary/20 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Aula Premium</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-foreground leading-tight tracking-tight">
                  {slide.title}
                </h3>
                <p className="text-sm text-muted-foreground font-medium line-clamp-2">
                  {slide.desc}
                </p>
              </div>
              
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
