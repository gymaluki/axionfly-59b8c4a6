import { motion, type Easing } from "framer-motion";
import { Check, Sparkles, Shield } from "lucide-react";
import lovableLogo from "@/assets/lovable-logo.png";
import googleMapsLogo from "@/assets/google-maps-logo.png";

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
    logo: lovableLogo,
    logoClass: "h-10 brightness-0 invert",
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
    logo: googleMapsLogo,
    logoClass: "h-14",
    title: "Parceria com Google",
    description: "Potencializado pela infraestrutura e dados do Google Maps para prospecção",
    badgeIcon: <Shield className="w-4 h-4 text-primary" />,
    badgeTitle: "Tecnologia Google",
    badgeText: "IA avançada e infraestrutura de classe mundial",
    benefits: [
      "Google AI e Machine Learning",
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
            <div className="flex justify-center py-4">
              <img
                src={partner.logo}
                alt={`Logo ${partner.name}`}
                className={partner.logoClass}
              />
            </div>

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
