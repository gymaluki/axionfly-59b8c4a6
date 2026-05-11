import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Zap, Sparkles, BarChart3, Users, Globe, ArrowUpRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import phoneFrame from "@/assets/mockup-phone-frame.png";
import laptopFrame from "@/assets/mockup-laptop-frame.png";

/* Realistic laptop with axionfly dashboard inside the screen */
function LaptopMockup() {
  return (
    <div className="relative w-full">
      {/* Frame */}
      <img
        src={laptopFrame}
        alt=""
        loading="eager"
        decoding="async"
        className="block w-full h-auto select-none pointer-events-none drop-shadow-[0_30px_60px_rgba(37,99,235,0.35)]"
      />
      {/* Screen overlay — positioned over the laptop's display area */}
      <div
        className="absolute overflow-hidden bg-[#05060d]"
        style={{ top: "5.5%", left: "11.2%", right: "11.2%", bottom: "37%" }}
      >
        <div className="h-full w-full flex flex-col">
          {/* Title bar */}
          <div className="h-5 border-b border-primary/15 bg-[#0a0c18] flex items-center px-2 gap-1 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            <div className="mx-auto bg-black/40 rounded px-1.5 py-0.5 text-[7px] text-muted-foreground font-mono">
              axionfly.site/dashboard
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 p-2 grid grid-cols-3 gap-1.5 min-h-0">
            <div className="space-y-1.5 flex flex-col">
              <div className="flex-1 p-1.5 rounded-md bg-black/40 border border-primary/15">
                <div className="flex justify-between items-start mb-1">
                  <div className="p-0.5 rounded bg-primary/15"><Users className="w-2.5 h-2.5 text-primary" /></div>
                  <span className="text-[7px] text-emerald-500 font-bold flex items-center"><ArrowUpRight className="w-2 h-2" />+12%</span>
                </div>
                <p className="text-[7px] text-muted-foreground leading-none">Leads</p>
                <p className="text-[11px] font-black text-foreground leading-tight">1.284</p>
              </div>
              <div className="flex-1 p-1.5 rounded-md bg-black/40 border border-primary/15">
                <div className="flex justify-between items-start mb-1">
                  <div className="p-0.5 rounded bg-primary/15"><Globe className="w-2.5 h-2.5 text-primary" /></div>
                  <span className="text-[7px] text-emerald-500 font-bold flex items-center"><ArrowUpRight className="w-2 h-2" />+8%</span>
                </div>
                <p className="text-[7px] text-muted-foreground leading-none">Sites</p>
                <p className="text-[11px] font-black text-foreground leading-tight">542</p>
              </div>
            </div>
            <div className="col-span-2 p-2 rounded-md bg-black/40 border border-primary/15 flex flex-col">
              <div className="flex justify-between items-center mb-1.5">
                <h4 className="text-[9px] font-bold text-foreground">Receita</h4>
                <BarChart3 className="w-2.5 h-2.5 text-primary" />
              </div>
              <div className="flex-1 flex items-end gap-1">
                {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/30 to-primary" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Realistic phone with axionfly app inside the screen */
function PhoneMockup() {
  return (
    <div className="relative w-[150px] sm:w-[180px]">
      <img
        src={phoneFrame}
        alt=""
        loading="eager"
        decoding="async"
        className="block w-full h-auto select-none pointer-events-none drop-shadow-[0_25px_45px_rgba(37,99,235,0.5)]"
      />
      {/* Screen overlay */}
      <div
        className="absolute overflow-hidden bg-gradient-to-b from-[#0a0c18] to-[#05060d] rounded-[10px]"
        style={{ top: "4.5%", left: "8%", right: "8%", bottom: "4.5%" }}
      >
        <div className="h-full w-full pt-5 px-2 pb-2 flex flex-col gap-1.5">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-md bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-primary" />
            </div>
            <span className="text-[7px] font-black text-foreground">AxionFly</span>
          </div>
          <div className="rounded-md bg-primary/10 border border-primary/30 p-1.5">
            <p className="text-[6px] text-muted-foreground leading-none">Saldo</p>
            <p className="text-[12px] font-black text-foreground leading-tight">R$ 15.400</p>
            <div className="flex items-center gap-0.5">
              <TrendingUp className="w-2 h-2 text-emerald-500" />
              <span className="text-[6px] font-bold text-emerald-500">+24%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="rounded bg-black/40 border border-primary/15 p-1">
              <Users className="w-2 h-2 text-primary mb-0.5" />
              <p className="text-[5px] text-muted-foreground leading-none">Leads</p>
              <p className="text-[9px] font-black text-foreground leading-tight">1.284</p>
            </div>
            <div className="rounded bg-black/40 border border-primary/15 p-1">
              <Globe className="w-2 h-2 text-primary mb-0.5" />
              <p className="text-[5px] text-muted-foreground leading-none">Sites</p>
              <p className="text-[9px] font-black text-foreground leading-tight">542</p>
            </div>
          </div>
          <div className="rounded bg-gradient-to-r from-primary to-primary/70 py-1 text-center">
            <span className="text-[7px] font-black text-white uppercase tracking-wider">Criar site</span>
          </div>
          <div className="space-y-0.5 mt-auto">
            {[60, 80, 45].map((w, i) => (
              <div key={i} className="h-0.5 rounded-full bg-primary/20" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section id="inicio" className="relative pt-20 pb-16 md:pt-28 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
          {/* LEFT — copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start mb-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Zap className="size-3.5 text-primary fill-primary" />
                </motion.div>
                <span className="text-[11px] font-black uppercase tracking-[0.1em] text-primary">
                  +5.000 empreendedores já vendem com AxionFly
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl lg:text-[54px] font-black tracking-tight text-foreground leading-[1.08] mb-5"
            >
              Feche Contratos de <span className="text-primary">R$500 a R$3.000</span> Criando Sites com IA em <span className="text-primary">10 Minutos</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="max-w-xl mx-auto lg:mx-0 text-[16px] md:text-[18px] text-[#94a3b8] font-normal leading-[1.7] mb-8"
            >
              Escolha o plano ideal para você. Comece seu negócio{" "}
              <span className="text-foreground font-bold border-b-2 border-primary/40">com a liberdade</span> de crescer ainda mais.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-10"
            >
              <Button variant="neon" size="xl" className="rounded-full shimmer-button px-10 h-14 text-base font-black uppercase tracking-widest w-full sm:w-auto" onClick={() => navigate("/auth")}>
                <Zap className="size-5 mr-2 fill-current" />
                Assinar agora
              </Button>
              <Button variant="outline" size="xl" className="rounded-full px-10 h-14 text-base font-black uppercase tracking-widest border-2 hover:bg-primary/10 w-full sm:w-auto" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
                Ver Planos
                <ArrowRightIcon className="size-5 ml-2" />
              </Button>
            </motion.div>

            {/* Métrica */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-[#05050a]/80 backdrop-blur-md px-5 py-3 shadow-[0_0_25px_rgba(37,99,235,0.15)]"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Contratos fechados</p>
                <p className="text-xl font-black text-foreground tabular-nums">R$ 15.400 <span className="text-emerald-500 text-xs">+24%</span></p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — floating mockups */}
          <div className="relative h-[420px] sm:h-[480px] lg:h-[560px] flex items-center justify-center">
            {/* Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.35),transparent_60%)] blur-3xl pointer-events-none" />

            {/* Orbital ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 0.5, scale: 1, rotate: 360 }}
              transition={{
                opacity: { duration: 1, delay: 0.6 },
                scale: { duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] },
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              }}
              className="absolute w-[110%] h-[70%] rounded-[50%] border border-primary/40 pointer-events-none"
              style={{ borderStyle: "solid", boxShadow: "0 0 40px rgba(37,99,235,0.25) inset" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 0.3, scale: 1, rotate: -360 }}
              transition={{
                opacity: { duration: 1, delay: 0.8 },
                scale: { duration: 1, delay: 0.8 },
                rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              }}
              className="absolute w-[95%] h-[55%] rounded-[50%] border border-primary/20 pointer-events-none"
            />

            {/* Laptop floating */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-12 top-1/2 -translate-y-1/2 w-[88%] max-w-[460px] z-10"
            >
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                <LaptopMockup />
              </motion.div>
            </motion.div>

            {/* Phone floating */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 sm:right-2 bottom-6 sm:bottom-10 z-20"
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                <PhoneMockup />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-16 lg:mt-20 flex flex-col items-center gap-6"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
            Parceiros oficiais
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-black tracking-tighter text-foreground">Lovable</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" alt="Google Maps" className="w-6 h-6" />
              <span className="text-xl font-bold tracking-tight text-foreground/80">Google Maps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xl font-black tracking-tighter text-foreground italic">HYPERBUILD PRO</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-primary/15 blur-[140px] rounded-full -z-10 pointer-events-none" />
    </section>
  );
}
