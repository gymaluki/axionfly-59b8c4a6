import { motion, type Easing } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const ease: Easing = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease },
  }),
};

const benefits = [
  "Deploy automático de projetos",
  "Hospedagem profissional incluída",
  "Atualizações em tempo real",
];

export default function LovablePartnership() {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        custom={0}
        className="max-w-md mx-auto rounded-2xl border border-border/50 p-8 text-center space-y-6"
        style={{
          backgroundColor: "hsl(var(--card))",
          backgroundImage:
            "radial-gradient(at 50% 0%, hsl(var(--primary) / 0.12) 0px, transparent 60%), radial-gradient(at 50% 100%, hsl(var(--primary) / 0.06) 0px, transparent 60%)",
        }}
      >
        {/* Logo / Brand */}
        <motion.div variants={fadeUp} custom={1} className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="currentColor"
                className="text-pink-400"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-foreground tracking-wide">Lovable</span>
        </motion.div>

        {/* Title */}
        <motion.div variants={fadeUp} custom={2} className="space-y-2">
          <h3 className="text-2xl font-black text-foreground">
            Parceria com Lovable
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Integração completa com a plataforma Lovable para desenvolvimento acelerado
          </p>
        </motion.div>

        {/* Bonus Badge */}
        <motion.div
          variants={fadeUp}
          custom={3}
          className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-1"
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">Bônus Exclusivo!</span>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-bold">10 créditos grátis</span>{" "}
            na Lovable ao usar a ZOD
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.ul variants={fadeUp} custom={4} className="space-y-3 text-left">
          {benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-center w-5 h-5 bg-primary/20 rounded-full shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="font-medium">{benefit}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
