import { motion, type Easing } from "framer-motion";
import { Check, Sparkles, Shield } from "lucide-react";
import googleMapsLogo from "@/assets/google-maps-logo.png";
import lovableLogo from "@/assets/lovable-logo.png";
import hyperbuildLogo from "@/assets/hyperbuild-logo.jpg";

const ease: Easing = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease },
  }),
};

function LovableLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 256 256" fill="none">
        <defs>
          <linearGradient id="heart-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="50%" stopColor="#C850C0" />
            <stop offset="100%" stopColor="#4158D0" />
          </linearGradient>
        </defs>
        <path
          d="M128 224s-96-64-96-128c0-35.3 28.7-64 64-64 20.4 0 38.6 9.5 50.3 24.4C155.7 41.5 171.6 32 192 32c35.3 0 64 28.7 64 64 0 64-128 128-128 128z"
          fill="url(#heart-grad)"
        />
      </svg>
      <span className="text-2xl font-bold text-foreground">Lovable</span>
    </div>
  );
}

const partners = [
  {
    name: "Extensão Lovable",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg",
    title: "Créditos Infinitos",
    description: "Parceria exclusiva Hyperbuild Pro para uso ilimitado da IA.",
    badgeTitle: "Recurso Exclusivo",
    glowColor: "rgba(37, 99, 235, 0.4)",
    benefits: [
      "Zero limites de geração",
      "Sincronização em tempo real",
      "Exclusivo AxionFly"
    ],
  },
  {
    name: "Lovable",
    logo: "https://uzsvdtahsnkfjuuuipfh.supabase.co/storage/v1/object/public/files/uploads/ShsuAt31DMUOEDUhs93J86XVyP73/1739373972688-6677p-logo.png",
    title: "Plataforma de Elite",
    description: "Integração total para desenvolvimento e deploy acelerado.",
    badgeTitle: "Deploy Ilimitado",
    glowColor: "rgba(37, 99, 235, 0.4)",
    benefits: [
      "Hospedagem inclusa",
      "SSL automático grátis",
      "Deploy em 1 clique"
    ],
  },
  {
    name: "Google Maps",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg",
    title: "Prospecção Global",
    description: "Dados oficiais do Google para encontrar negócios sem site.",
    badgeTitle: "Dados Reais",
    glowColor: "rgba(34, 197, 94, 0.3)",
    benefits: [
      "Busca em 27 estados",
      "Dados atualizados",
      "Filtros inteligentes"
    ],
  },
];

export default function LovablePartnership() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="flex justify-center mb-8">
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-6 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-sm">
          Infraestrutura de Elite
        </span>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="text-center mb-20 space-y-6"
      >
        <h2 className="text-4xl md:text-7xl font-black text-foreground leading-[1.1]">
          Parcerias que garantem <br />
          seu <span className="gradient-text">sucesso total</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium">
          Trabalhamos apenas com os gigantes. Tecnologia de ponta para quem busca resultados extraordinários.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {partners.map((partner, idx) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -10 }}
            className="group rounded-3xl border border-border/50 bg-card/40 p-8 flex flex-col space-y-8 transition-all duration-500 hover:border-primary/40 backdrop-blur-sm relative overflow-hidden"
          >
            {/* Glow Effect */}
            <div 
              className="absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-[60px] -z-10"
              style={{ backgroundColor: partner.glowColor }}
            />

            {/* Logo */}
            <div className="flex justify-center h-20 items-center">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="h-16 w-auto object-contain group-hover:scale-110 transition-transform duration-500" 
              />
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-foreground">{partner.title}</h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {partner.description}
              </p>
            </div>

            {/* Badge */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
              <span className="text-xs font-black uppercase tracking-widest text-primary">
                {partner.badgeTitle}
              </span>
            </div>

            {/* Benefits */}
            <ul className="space-y-4 flex-1">
              {partner.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                  <div className="flex items-center justify-center w-5 h-5 bg-primary/10 rounded-full shrink-0">
                    <Check className="w-3 h-3 text-primary stroke-[3px]" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            {partner.name === "Google Maps" && (
              <div className="h-32 rounded-xl border border-border/50 bg-background/50 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ed/Map_of_Brazil_with_states.svg')] bg-center bg-no-repeat bg-contain opacity-20 p-4" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <MapPin className="w-8 h-8 text-primary fill-primary/20" />
                </motion.div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function MapPin({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
