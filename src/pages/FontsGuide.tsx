import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, type Easing } from "framer-motion";

const ease: Easing = [0.16, 1, 0.3, 1];

const fontOptions = [
  {
    value: "playfair-raleway",
    label: "Playfair Display + Raleway",
    desc: "Clássico e elegante",
    detail: "Playfair Display é uma fonte serifada com traços finos e grossos — perfeita para títulos sofisticados. Raleway é uma fonte sans-serif leve e moderna para corpo de texto. Juntas, transmitem luxo e refinamento.",
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Raleway', sans-serif",
    sampleHeading: "Elegância & Tradição",
    sampleBody: "Um visual clássico que transmite confiança e sofisticação para o seu negócio.",
  },
  {
    value: "inter-space",
    label: "Inter + Space Grotesk",
    desc: "Moderno e limpo",
    detail: "Inter é a fonte mais popular da web moderna — altamente legível em qualquer tamanho. Space Grotesk adiciona personalidade geométrica aos títulos. Ideal para negócios tech e modernos.",
    headingFont: "'Inter', sans-serif",
    bodyFont: "'Inter', sans-serif",
    sampleHeading: "Design Moderno & Limpo",
    sampleBody: "Tipografia pensada para máxima legibilidade e um visual contemporâneo.",
  },
  {
    value: "poppins-dm",
    label: "Poppins + DM Sans",
    desc: "Amigável e atual",
    detail: "Poppins tem formas geométricas arredondadas que transmitem simpatia e modernidade. DM Sans complementa com uma leitura agradável. Ótima para negócios que querem parecer acessíveis e confiáveis.",
    headingFont: "'Poppins', sans-serif",
    bodyFont: "'DM Sans', sans-serif",
    sampleHeading: "Simpático & Acessível",
    sampleBody: "Fontes arredondadas que criam uma experiência amigável e convidativa.",
  },
  {
    value: "oswald-roboto",
    label: "Oswald + Roboto",
    desc: "Forte e industrial",
    detail: "Oswald é uma fonte condensada e impactante — perfeita para títulos que chamam atenção. Roboto é a fonte padrão do Google, extremamente versátil. Combinação ideal para negócios que querem transmitir força e energia.",
    headingFont: "'Oswald', sans-serif",
    bodyFont: "'Roboto', sans-serif",
    sampleHeading: "FORÇA & IMPACTO",
    sampleBody: "Tipografia bold e condensada para negócios que querem se destacar com energia.",
  },
  {
    value: "cormorant-lato",
    label: "Cormorant Garamond + Lato",
    desc: "Sofisticado e premium",
    detail: "Cormorant Garamond é uma fonte serifada fina e elegante inspirada no estilo clássico francês. Lato é limpa e humanista. Juntas, criam um visual premium e requintado — perfeito para restaurantes fine dining e marcas de luxo.",
    headingFont: "'Cormorant Garamond', serif",
    bodyFont: "'Lato', sans-serif",
    sampleHeading: "Requinte & Sofisticação",
    sampleBody: "Uma combinação premium que eleva a percepção de valor do seu negócio.",
  },
  {
    value: "fredoka-nunito",
    label: "Fredoka + Nunito",
    desc: "Divertido e arredondado",
    detail: "Fredoka tem formas super arredondadas e brincalhonas — perfeita para negócios descontraídos como pet shops, sorveterias e lojas infantis. Nunito mantém a leitura limpa com o mesmo estilo suave.",
    headingFont: "'Fredoka', sans-serif",
    bodyFont: "'Nunito', sans-serif",
    sampleHeading: "Diversão & Alegria",
    sampleBody: "Formas arredondadas e suaves que transmitem acolhimento e descontração.",
  },
  {
    value: "montserrat-opensans",
    label: "Montserrat + Open Sans",
    desc: "Versátil e profissional",
    detail: "Montserrat é geométrica e elegante, inspirada nos letreiros de Buenos Aires. Open Sans é uma das fontes mais legíveis da web. Combinação versátil que funciona para qualquer tipo de negócio.",
    headingFont: "'Montserrat', sans-serif",
    bodyFont: "'Open Sans', sans-serif",
    sampleHeading: "Versatilidade Total",
    sampleBody: "Funciona para qualquer segmento — do escritório ao restaurante, sempre profissional.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease },
  }),
};

const FontsGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="space-y-3 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Guia de <span className="gradient-text">Fontes</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Veja como cada combinação de fontes fica visualmente e escolha a que melhor combina com o negócio.
          </p>
        </motion.div>

        <div className="space-y-6 mb-12">
          {fontOptions.map((font, i) => (
            <motion.div
              key={font.value}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i + 1}
              className="glass rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-bold text-foreground">{font.label}</h3>
                <span className="text-xs font-medium bg-primary/15 text-primary px-3 py-1 rounded-full border border-primary/20">
                  {font.desc}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{font.detail}</p>

              <div className="p-6 rounded-xl bg-secondary/20 border border-border space-y-3">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Prévia</p>
                <p
                  className="text-2xl md:text-3xl font-bold text-foreground"
                  style={{ fontFamily: font.headingFont }}
                >
                  {font.sampleHeading}
                </p>
                <p
                  className="text-base text-muted-foreground leading-relaxed"
                  style={{ fontFamily: font.bodyFont }}
                >
                  {font.sampleBody}
                </p>
                <div className="flex gap-4 pt-2 text-xs text-muted-foreground">
                  <span>Aa Bb Cc Dd Ee Ff Gg Hh</span>
                  <span>1234567890</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center pb-12">
          <Button variant="neon" size="lg" onClick={() => navigate("/dashboard")}>
            Voltar para a Plataforma
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FontsGuide;
