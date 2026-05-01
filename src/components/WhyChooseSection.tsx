import { motion, Variants } from "framer-motion";
import { Sparkles, MapPin, Palette, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Crie Sites com IA",
    description: "Nossa inteligência artificial gera sites completos de alta conversão baseados no nicho escolhido.",
  },
  {
    icon: MapPin,
    title: "Prospecção Automática",
    description: "Encontre negócios sem site em qualquer um dos 27 estados do Brasil com apenas alguns cliques.",
  },
  {
    icon: Palette,
    title: "Personalização Total",
    description: "Escolha cores, fontes e estilos de design para garantir que cada projeto seja único e profissional.",
  },
  {
    icon: BarChart3,
    title: "Dashboard de Vendas",
    description: "Acompanhe seus lucros, clientes atendidos e sites criados em um painel intuitivo e completo.",
  },
];

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
    <section id="recursos" className="container mx-auto px-4 py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="text-center mb-16 space-y-4">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="text-3xl md:text-5xl font-bold text-foreground tracking-tight"
        >
          Por que escolher a <span className="gradient-text">AxionFly</span>?
        </motion.h2>
        <motion.p 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="text-muted-foreground max-w-2xl mx-auto text-lg"
        >
          Tudo o que você precisa para criar e vender sites profissionais de forma escalável, em um único lugar.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i + 2}
            whileHover={{ y: -5 }}
            className="group relative p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
