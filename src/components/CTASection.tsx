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
    <section className="container mx-auto px-4 py-16 md:py-24 relative overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="relative w-full max-w-6xl mx-auto rounded-[2.5rem] bg-[#0A0A0B] border border-white/5 p-8 md:p-20 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {/* Glowing Background Effect - Blue AxionFly Style */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[140%] bg-primary/20 blur-[120px] rounded-full pointer-events-none transform -rotate-12" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[100%] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-10">
          {/* Header Badge */}
          <motion.div 
            variants={fadeUp}
            custom={1}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0B] bg-[#1A1A1B] flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-[10px] font-bold text-white/40 italic">
                    AX
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm font-medium text-white/80">
                + de 5.000 pessoas escalando com a AxionFly
              </span>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-6 max-w-4xl">
            <motion.h2 
              variants={fadeUp}
              custom={2}
              className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[1.05]"
            >
              PRONTO PARA <br />
              <span className="gradient-text">ESCALAR</span> SEU <br />
              NEGÓCIO?
            </motion.h2>
            
            <motion.p 
              variants={fadeUp}
              custom={3}
              className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-medium"
            >
              O criador de sites mais potente do mercado, feito para quem busca resultados reais e velocidade.
            </motion.p>
          </div>

          {/* Button */}
          <motion.div 
            variants={fadeUp}
            custom={4}
            className="w-full sm:w-auto"
          >
            <Button 
              variant="neon" 
              size="lg" 
              className="h-16 px-12 text-xl rounded-2xl w-full sm:w-auto font-bold shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.5)] group transition-all duration-300 hover:scale-105"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              QUERO COMEÇAR AGORA
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Decorative corner circles */}
        <div className="absolute top-10 right-10 w-32 h-32 border border-white/5 rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-24 h-24 border border-white/5 rounded-full pointer-events-none opacity-50" />
      </motion.div>
    </section>
  );
}
