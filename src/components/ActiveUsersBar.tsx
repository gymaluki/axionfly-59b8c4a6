import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useVagasRestantes } from "@/hooks/useVagasRestantes";

const TOTAL = 500;

export default function ActiveUsersBar() {
  const vagas = useVagasRestantes(7);
  const ativos = Math.max(0, TOTAL - vagas);
  const percent = Math.min(100, Math.round((ativos / TOTAL) * 100));

  return (
    <section className="container mx-auto px-4 pt-4 pb-16 md:pt-6 md:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-[#0a0a0e]/80 backdrop-blur-sm p-6 md:p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm md:text-base font-medium">Usuários ativos</span>
          </div>
          <div className="text-sm md:text-base font-black text-foreground tabular-nums">
            {ativos} / {TOTAL}
          </div>
        </div>

        <div className="relative h-2 w-full rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${percent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          />
        </div>

        <p className="text-center text-sm md:text-base text-[#94a3b8] mt-5">
          Restam apenas <span className="font-black text-foreground">{vagas} acessos</span> disponíveis.
        </p>

        <div className="flex items-center justify-center gap-2 mt-2 text-xs text-[#64748b]">
          <RefreshCw className="w-3 h-3" />
          <span>Atualizado em tempo real</span>
        </div>
      </motion.div>
    </section>
  );
}
