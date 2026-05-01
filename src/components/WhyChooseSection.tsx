import { motion, type Variants } from "framer-motion";
import { Sparkles, Settings, Globe, Code2, Palette } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function WhyChooseSection() {
  return (
    <section id="recursos" className="container mx-auto px-4 py-20 md:py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16 space-y-4 relative z-10">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-3xl md:text-5xl font-bold text-foreground tracking-tight"
        >
          Por que escolher a <span className="text-primary drop-shadow-[0_0_25px_hsl(var(--primary)/0.6)]">AXIONFLY</span>?
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg"
        >
          Tudo o que você precisa para criar sites profissionais e escalar suas vendas, em um único lugar.
        </motion.p>
      </div>

      {/* Grid 2x2 */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto relative z-10">
        {/* CARD 1 - Crie Sites com IA (visual em cima, texto embaixo) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={2}
          className="group relative rounded-3xl bg-[#0A0A0A] border border-white/5 p-8 md:p-10 overflow-hidden hover:border-primary/40 transition-all duration-500 min-h-[460px] flex flex-col"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* Visual: Sparkle/IA orb */}
          <div className="flex-1 flex items-center justify-center relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary/40 via-primary/20 to-transparent border border-primary/30 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-14 h-14 md:w-16 md:h-16 text-primary drop-shadow-[0_0_20px_hsl(var(--primary)/0.8)]" />
              </div>
              {/* orbits */}
              <div className="absolute inset-0 -m-8 border border-primary/15 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-0 -m-16 border border-primary/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
            </div>
          </div>

          <div className="relative z-10 text-center space-y-2 mt-6">
            <h3 className="text-2xl font-bold text-foreground">Crie Sites com IA</h3>
            <p className="text-muted-foreground text-sm">
              Nossa inteligência artificial gera sites completos baseados nas suas escolhas
            </p>
          </div>
        </motion.div>

        {/* CARD 2 - Atualizações com 1 clique (texto em cima, card de notificação embaixo) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={3}
          className="group relative rounded-3xl bg-[#0A0A0A] border border-white/5 p-8 md:p-10 overflow-hidden hover:border-primary/40 transition-all duration-500 min-h-[460px] flex flex-col"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.08)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <h3 className="text-2xl font-bold text-foreground">Atualizações com 1 clique</h3>
            <p className="text-muted-foreground text-sm">
              Modifique e evolua seus sites existentes sem complicação
            </p>
          </div>

          {/* Notificação card */}
          <div className="flex-1 flex items-end relative z-10 mt-6">
            <div className="w-full rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur-sm p-5 shadow-[0_0_40px_hsl(var(--primary)/0.15)]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: "4s" }} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Atualizando: novo bloco de depoimentos
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Aplicado em {new Date().toLocaleDateString("pt-BR")}, agora
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CARD 3 - Visual Personalizado (texto em cima, chips embaixo) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={4}
          className="group relative rounded-3xl bg-[#0A0A0A] border border-white/5 p-8 md:p-10 overflow-hidden hover:border-primary/40 transition-all duration-500 min-h-[460px] flex flex-col"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.08)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <h3 className="text-2xl font-bold text-foreground">Visual Personalizado</h3>
            <p className="text-muted-foreground text-sm">
              Escolha cores, fontes e estilos para cada projeto
            </p>
          </div>

          {/* Chips */}
          <div className="flex-1 flex items-end relative z-10 mt-6">
            <div className="w-full rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur-sm p-5 shadow-[0_0_40px_hsl(var(--primary)/0.15)]">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4 text-primary" />
                <p className="text-xs font-semibold text-foreground">Qual estilo deseja aplicar ao seu site?</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 rounded-lg bg-background/60 border border-white/10 text-xs font-medium text-muted-foreground hover:border-primary/40 transition-colors cursor-pointer">
                  Moderno
                </span>
                <span className="px-4 py-2 rounded-lg bg-primary/15 border-2 border-primary text-xs font-bold text-primary shadow-[0_0_20px_hsl(var(--primary)/0.5)] cursor-pointer">
                  Minimalista
                </span>
                <span className="px-4 py-2 rounded-lg bg-background/60 border border-white/10 text-xs font-medium text-muted-foreground hover:border-primary/40 transition-colors cursor-pointer">
                  Dark Mode
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CARD 4 - Analytics Integrado (texto em cima, gráfico embaixo) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={5}
          className="group relative rounded-3xl bg-[#0A0A0A] border border-white/5 p-8 md:p-10 overflow-hidden hover:border-primary/40 transition-all duration-500 min-h-[460px] flex flex-col"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,hsl(var(--primary)/0.1)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <h3 className="text-2xl font-bold text-foreground">Analytics Integrado</h3>
            <p className="text-muted-foreground text-sm">
              Veja o desempenho dos seus sites e vendas em tempo real
            </p>
          </div>

          {/* Bar chart */}
          <div className="flex-1 flex items-end justify-center relative z-10 mt-6">
            <div className="flex items-end gap-3 h-40 w-full max-w-xs">
              {[40, 65, 50, 75, 60, 90, 100].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 rounded-t-lg bg-gradient-to-t from-primary to-primary/40 shadow-[0_0_20px_hsl(var(--primary)/0.5)] border-t border-primary"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
