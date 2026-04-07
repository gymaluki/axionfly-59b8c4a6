import { motion } from "framer-motion";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import dashboardImg from "@/assets/carousel-dashboard.jpg";
import vendaImg from "@/assets/carousel-venda.jpg";

const slides = [
  { id: "dashboard", src: dashboardImg, alt: "Como acessar a ferramenta AxionFly" },
  { id: "venda", src: vendaImg, alt: "Venda sem gastar com a AxionFly" },
  { id: "dashboard2", src: dashboardImg, alt: "Dashboard AxionFly" },
  { id: "venda2", src: vendaImg, alt: "Vendas AxionFly" },
];

export default function FeaturesCarousel() {
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
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            Aulas <span className="gradient-text">Premium e Exclusivas</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Conteúdo exclusivo para você dominar a criação e venda de sites com IA.
          </p>
        </motion.div>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />

        <InfiniteSlider gap={32} duration={40} durationOnHover={120}>
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="shrink-0 w-[300px] md:w-[380px] rounded-2xl overflow-hidden border border-border/40 hover:border-primary/30 transition-all duration-300 relative"
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
                className="w-full h-auto object-cover"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
