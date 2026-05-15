import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, type Easing } from "framer-motion";
import { Helmet } from "react-helmet-async";

const ease: Easing = [0.16, 1, 0.3, 1];

const designStyles = [
  {
    value: "conversao",
    label: "🎯 Design de Conversão (Landing Page)",
    desc: "Focado inteiramente em uma única ação (CTA), como \"Comprar Agora\" ou \"Pedir no WhatsApp\". Estrutura vertical com depoimentos, benefícios e preços claros, eliminando menus complexos para não distrair o cliente.",
    ideal: "Infoprodutos, serviços específicos e promoções de página única.",
    visual: "Fundo limpo, botão CTA grande e chamativo, seções de prova social, depoimentos e preços destacados. Sem menu lateral ou navegação complexa.",
    preview: "bg-gradient-to-b from-primary/20 to-background",
  },
  {
    value: "catalogo",
    label: "🛍️ Catálogo / E-commerce Clean",
    desc: "Prioriza a visualização dos produtos com fotos de alta qualidade e fundos neutros. Navegação intuitiva com filtros de busca e categorias bem visíveis para que o cliente encontre o que precisa em poucos cliques.",
    ideal: "Lojas de roupas, eletrônicos e móveis.",
    visual: "Grid de produtos organizado, fotos grandes, filtros laterais, fundo neutro/branco com tipografia limpa.",
    preview: "bg-gradient-to-br from-secondary/40 to-muted/30",
  },
  {
    value: "local-first",
    label: "📍 Local-First (Foco em Geolocalização)",
    desc: "Coloca informações práticas em primeiro plano: mapa de localização, botão de \"Como chegar\", horário de funcionamento e telefone. Projetado para ser extremamente rápido no celular, pois o cliente geralmente está na rua procurando o local.",
    ideal: "Restaurantes, oficinas, consultórios e salões de beleza.",
    visual: "Mapa integrado em destaque, botões de ação rápida (ligar, WhatsApp, rota), horário de funcionamento visível, design mobile-first.",
    preview: "bg-gradient-to-br from-accent/15 to-primary/10",
  },
  {
    value: "institucional",
    label: "🏢 Institucional Moderno",
    desc: "Passa autoridade e profissionalismo através de uma estrutura organizada, fotos da equipe ou do estabelecimento e uma seção de \"Quem Somos\". Utiliza cores sólidas e fontes serifadas para transmitir confiança e tradição.",
    ideal: "Imobiliárias, escritórios de advocacia e empresas de engenharia.",
    visual: "Layout estruturado, fotos corporativas, paleta sóbria (azul marinho, cinza, dourado), tipografia serifada para títulos.",
    preview: "bg-gradient-to-b from-muted/40 to-background",
  },
  {
    value: "lifestyle",
    label: "🌿 Visual / Estético (Lifestyle)",
    desc: "Foca menos em texto e mais em vender uma \"experiência\" ou \"estilo de vida\". Utiliza fotos ambientadas e vídeos em tela cheia que mostram o produto em uso. Design elegante com margens amplas.",
    ideal: "Cafeterias gourmet, spas, hotéis e marcas de decoração.",
    visual: "Fotos full-width, muito espaço em branco, tipografia fina e elegante, paleta suave (nude, bege, verde-oliva).",
    preview: "bg-gradient-to-br from-accent/10 to-background",
  },
  {
    value: "cardapio-digital",
    label: "📋 Cardápio Digital / Reservas",
    desc: "Especializado em facilitar escolhas rápidas. Usa grids organizadas com fotos dos pratos ou serviços, preços destacados e integração direta com sistemas de pagamento ou agendamento online.",
    ideal: "Restaurantes, lanchonetes, bares e salões com agendamento.",
    visual: "Grid com fotos dos itens, preços grandes, categorias por abas, botão de pedido/reserva direto, paleta quente.",
    preview: "bg-gradient-to-br from-destructive/10 to-accent/10",
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

const DesignStylesGuide = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Guia de Estilos de Design — AxionFly</title>
        <meta name="description" content="Conheça os estilos de design de conversão, catálogo e local-first da AxionFly para criar sites que convertem." />
        <meta property="og:title" content="Guia de Estilos de Design — AxionFly" />
        <meta property="og:description" content="Conheça os estilos de design de conversão, catálogo e local-first da AxionFly." />
        <meta property="og:url" content="https://axionfly.lovable.app/guia-design" />
        <link rel="canonical" href="https://axionfly.lovable.app/guia-design" />
      </Helmet>
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
            Guia de <span className="gradient-text">Estilos de Design</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Entenda cada estilo de design disponível na AxionFly e escolha o ideal para o negócio do seu cliente.
          </p>
        </motion.div>

        <div className="space-y-6 mb-12">
          {designStyles.map((style, i) => (
            <motion.div
              key={style.value}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i + 1}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className={`h-3 w-full ${style.preview}`} />
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-foreground">{style.label}</h2>
                <p className="text-muted-foreground leading-relaxed">{style.desc}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">Ideal para</p>
                    <p className="text-sm text-foreground">{style.ideal}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">Visual</p>
                    <p className="text-sm text-foreground">{style.visual}</p>
                  </div>
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
    </>
  );
};

export default DesignStylesGuide;
