import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function CTASection() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="relative w-full max-w-6xl mx-auto rounded-[3rem] bg-[#0A0A0A] border border-white/10 p-10 md:p-24 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
      >
        {/* Glow background - Exact placement as photo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-12">
          
          {/* Top section: Avatar stack + Stars */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-14 h-14 rounded-full border-[3px] border-[#0A0A0A] bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-500 italic">
                    U{i}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-zinc-400 text-base font-medium">
                + de 5.000 pessoas escalando com a AxionFly
              </p>
            </div>
          </div>

          {/* Main Title - Exact layout from photo */}
          <div className="space-y-4 max-w-5xl">
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.95] uppercase">
              PRONTO PARA <br />
              <span className="text-primary drop-shadow-[0_0_30px_hsl(var(--primary)/0.5)]">ESCALAR</span> SEU <br />
              NEGÓCIO?
            </h2>
          </div>

          {/* Description */}
          <p className="text-zinc-500 text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
            O criador de sites mais potente do mercado, feito para quem busca resultados reais e velocidade.
          </p>

          {/* CTA Button - Large as in photo */}
          <div className="pt-6 w-full sm:w-auto">
            <Button 
              variant="neon" 
              size="lg" 
              className="h-20 px-16 text-2xl rounded-2xl w-full sm:w-auto font-black uppercase tracking-tight shadow-[0_20px_50px_-10px_hsl(var(--primary)/0.4)] group transition-all duration-300 hover:scale-105 active:scale-95 bg-primary text-white"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              QUERO COMEÇAR AGORA
              <ArrowRight className="ml-3 w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Decorative corner details from photo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      </motion.div>
    </section>
  );
}
