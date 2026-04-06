import { motion, type Easing } from "framer-motion";
import { Check, Sparkles, Shield } from "lucide-react";

const ease: Easing = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease },
  }),
};

const partners = [
  {
    name: "Lovable",
    logo: (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="currentColor"
              className="text-pink-400"
            />
          </svg>
        </div>
        <span className="text-2xl font-bold text-foreground">Lovable</span>
      </div>
    ),
    title: "Parceria com Lovable",
    description: "Integração completa com a plataforma Lovable para desenvolvimento acelerado",
    badgeIcon: <Sparkles className="w-4 h-4 text-primary" />,
    badgeTitle: "Bônus Exclusivo!",
    badgeText: (
      <>
        <span className="text-primary font-bold">10 créditos grátis</span> na Lovable ao usar a ZOD
      </>
    ),
    benefits: [
      "Deploy automático de projetos",
      "Hospedagem profissional incluída",
      "Atualizações em tempo real",
    ],
  },
  {
    name: "Google Maps",
    logo: (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="hsl(4, 90%, 58%)" />
            <circle cx="12" cy="9" r="2.5" fill="hsl(0, 0%, 100%)" />
          </svg>
        </div>
        <span className="text-2xl font-bold text-foreground">Google Maps</span>
      </div>
    ),
    title: "Parceria com Google",
    description: "Potencializado pela infraestrutura e dados do Google Maps para prospecção",
    badgeIcon: <Shield className="w-4 h-4 text-primary" />,
    badgeTitle: "Tecnologia Google",
    badgeText: "Busca avançada e dados geolocalizados de classe mundial",
    benefits: [
      "Google Maps e geolocalização",
      "Infraestrutura cloud confiável",
      "Escalabilidade garantida",
    ],
  },
];

export default function LovablePartnership() {
  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="text-center mb-12 space-y-3"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Nossas <span className="gradient-text">Parcerias</span>
        </h2>
        <p className="text-muted-foreground">
          Conectados com as melhores tecnologias do mercado
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {partners.map((partner, idx) => (
          <motion.div
            key={partner.name}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={idx + 1}
            whileHover={{ scale: 1.03, y: -4 }}
            className="rounded-2xl border border-border/50 p-8 flex flex-col space-y-6 transition-all duration-300 hover:border-primary/30"
            style={{
              backgroundColor: "hsl(var(--card))",
              backgroundImage:
                "radial-gradient(at 0% 100%, hsl(var(--primary) / 0.08) 0px, transparent 60%), radial-gradient(at 100% 0%, hsl(var(--accent) / 0.06) 0px, transparent 60%)",
            }}
          >
            {/* Logo */}
            <div className="flex justify-center">{partner.logo}</div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-foreground">{partner.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {partner.description}
              </p>
            </div>

            {/* Badge */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-1 text-center">
              <div className="flex items-center justify-center gap-2">
                {partner.badgeIcon}
                <span className="text-sm font-bold text-foreground">{partner.badgeTitle}</span>
              </div>
              <p className="text-sm text-muted-foreground">{partner.badgeText}</p>
            </div>

            {/* Benefits */}
            <ul className="space-y-3 flex-1">
              {partner.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center w-5 h-5 bg-primary/20 rounded-full shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
