import { motion } from "framer-motion";
import { Infinity, Zap, ShieldCheck, ArrowRight, Check } from "lucide-react";
import hyperbuildExtension from "@/assets/hyperbuild-extension.png";

const benefits = [
  "Créditos ilimitados no Lovable",
  "Sem bloqueios ou limitações",
  "Crie sites em escala industrial",
  "Economia de R$ 1.200/ano",
  "Ativação instantânea",
  "Suporte exclusivo AxionFly",
];

export default function HyperbuildHighlight() {
  return (
    <section className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#050508]" />
      <div
        className="absolute inset-1 rounded-[2.5rem] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(168,85,247,1), rgba(37,99,235,0.4), transparent 70%)",
          opacity: 0.15,
        }}
      />
      <div className="absolute inset-1 rounded-[2.5rem] border border-white/[0.04] pointer-events-none" />

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-purple-300 backdrop-blur-sm shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <Zap className="w-3 h-3 fill-current" />
            Extensão Exclusiva — Incluída em Todos os Planos
          </span>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT — Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-[44px] font-black text-foreground tracking-tight leading-[1.1]">
                Extensão Lovable{" "}
                <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
                  Infinito
                </span>
                <br className="hidden md:block" />
                <span className="text-white">Hyperbuild Pro</span>
              </h2>
              <p className="text-[#94a3b8] text-base md:text-lg leading-relaxed max-w-lg">
                A única plataforma no Brasil com parceria oficial Hyperbuild Pro.
                Crie sites sem limites de créditos — escale sem parar.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4">
              <div className="rounded-2xl bg-purple-500/[0.06] border border-purple-500/20 px-5 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <Infinity className="w-5 h-5 text-purple-400" />
                  <span className="text-2xl font-black text-white tracking-tighter">
                    Ilimitado
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300/70">
                  Créditos no Lovable
                </span>
              </div>
              <div className="rounded-2xl bg-[#0d1221] border border-white/[0.06] px-5 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-2xl font-black text-white tracking-tighter">
                    R$ 1.200
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Economia por ano
                </span>
              </div>
            </div>

            {/* Benefits list */}
            <div className="grid sm:grid-cols-2 gap-3">
              {benefits.map((b) => (
                <div
                  key={b}
                  className="flex items-center gap-3 text-sm text-foreground/80 font-medium"
                >
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/15 shrink-1">
                    <Check className="w-3 h-3 text-purple-400 stroke-[3px]" />
                  </div>
                  {b}
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() =>
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
              }
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-8 py-4 text-sm font-black uppercase tracking-[0.15em] text-white shadow-[0_8px_40px_-8px_rgba(168,85,247,0.4)] hover:shadow-[0_12px_50px_-8px_rgba(168,85,247,0.55)] transition-all"
            >
              Quero Créditos Infinitos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* RIGHT — Extension image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative"
          >
            {/* Glow behind */}
            <div className="absolute -inset-10 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative">
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-2 md:right-8 z-20 rounded-xl bg-[#0d1221] border border-purple-500/30 px-4 py-3 shadow-2xl"
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">
                    Parceira Oficial
                  </span>
                </div>
              </motion.div>

              {/* Main image container */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                }}
              >
                {/* Ambient glow */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 60% 40%, rgba(168, 85, 247, 0.2), transparent 60%)",
                    filter: "blur(40px)",
                  }}
                />
                <img
                  src={hyperbuildExtension}
                  alt="Extensão HyperBuild Pro — créditos infinitos no Lovable"
                  loading="lazy"
                  className="relative z-10 w-full max-w-lg mx-auto"
                  style={{
                    filter:
                      "drop-shadow(0 0 40px rgba(168, 85, 247, 0.35)) drop-shadow(0 15px 35px rgba(0,0,0,0.5)) contrast(1.05) saturate(1.1)",
                    background: "transparent",
                    border: "none",
                    borderRadius: 0,
                  }}
                />
              </h2>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
