import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface NicheTemplate {
  label: string;
  buildPrompt: (name: string, primaryColor: string, secondaryColor: string, features: string) => string;
}

const nicheTemplates: Record<string, NicheTemplate> = {
  barbearia: {
    label: "🪒 Barbearia",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma barbearia chamada "${name}". Visual premium e sofisticado com fundo escuro (tons de cinza escuro/quase preto), acentos em ${primary || "dourado (gold gradient)"}. Cor secundária: ${secondary || "cinza escuro"}. Use a fonte Playfair Display para títulos e Raleway para corpo de texto. Seções: Hero fullscreen com imagem de barbearia premium e título "Estilo & Tradição" com gradiente ${primary || "dourado"}, botão "Agende seu Horário". Seção "Nossos Serviços" com 3 cards (Corte Masculino R$60, Barba R$45, Tratamento Capilar R$80 — cada um com imagem, descrição e preço). Seção "Sobre Nós" com texto sobre tradição e excelência, com estatísticas (15+ anos de experiência, 10.000+ clientes atendidos, 5 barbeiros especialistas, nota 4.9 de avaliação). Seção "Contato" com informações (endereço, telefone, horário de funcionamento e formulário). Footer simples. Animações suaves com framer-motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  pizzaria: {
    label: "🍕 Pizzaria",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma pizzaria chamada "${name}". Visual quente e acolhedor com fundo escuro (tons de preto e cinza escuro), acentos em ${primary || "vermelho queimado"} e ${secondary || "laranja"}. Use fontes display bold para títulos e uma fonte corpo clean. Seções: Hero com imagem de pizza artesanal saindo do forno, seção "Cardápio" com cards de pizzas (Margherita, Pepperoni, Quatro Queijos, Calabresa — com preço e descrição), seção "Sobre Nós" contando a história da pizzaria com estatísticas (anos de tradição, pizzas por mês, avaliações 5 estrelas), seção "Contato" com endereço, telefone, horário de funcionamento e formulário de pedido/reserva. Footer simples. Animações suaves com framer-motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  "fine-dining": {
    label: "🍷 Restaurante Fine Dining",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site de restaurante fine dining chamado "${name}" com tema escuro (fundo #1a1410), acentos ${primary || "dourados"}, cor secundária ${secondary || "bordô"}, tipografia Cormorant Garamond + Raleway. Seções: hero fullscreen com imagem do restaurante, cardápio com pratos alternados (filé, pasta, sobremesa) com fotos e preços, sobre com foto do chef e estatísticas (anos, clientes, avaliação), contato com reservas/endereço/horário, navbar fixa com blur e botão de reserva, footer elegante. Divisores dourados em gradiente entre seções. Animações suaves com framer-motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  "restaurante-bairro": {
    label: "🍲 Restaurante de Bairro",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site de restaurante de bairro acolhedor chamado '${name}'. Tons ${primary || "terrosos (terracotta, amarelo quente, creme)"}, cor secundária ${secondary || "amarelo quente"}, tipografia Merriweather + Open Sans. Hero com fachada do restaurante, badge 'desde 1998', botões de cardápio e WhatsApp. Cardápio com cards de feijoada/picanha/moqueca com fotos, estrelas, tags e preços. Seção sobre com foto do interior rústico, história da fundadora e ícones (tradição, família, caseiro, amor). Contato com telefone, WhatsApp, endereço e horário. Footer simples. Estilo casual, emojis, linguagem calorosa.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  clinica: {
    label: "🦷 Clínica Odontológica",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site para clínica odontológica chamado '${name}'. Use ${primary || "azul claro"} como cor primária, ${secondary || "verde-água"} como accent, fundo branco/cinza claro, tipografia Plus Jakarta Sans. Faça um hero split com texto à esquerda e foto do consultório à direita, com badges de biossegurança, CRO e horários flexíveis. Seção de serviços com cards contendo foto e ícone para clareamento dental, ortodontia invisível e implantes dentários, mais um grid de serviços extras (limpeza, odontopediatria, scanner 3D). Seção sobre a dentista com foto profissional, CRO, formação USP/UNICAMP, e estatísticas (pacientes, avaliação). Seção de depoimentos de pacientes com estrelas e iniciais. Seção de contato com botões de WhatsApp, telefone e Instagram, mais endereço e horário. Navbar fixa com logo e botão de agendar. Footer com CRO. Design profissional, limpo e que transmita confiança.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  petshop: {
    label: "🐾 Pet Shop",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site de pet shop chamado "${name}" com estética vibrante, acolhedora e playful. Paleta de cores quentes baseada em ${primary || "coral (#E8734A)"} como cor primária e ${secondary || "âmbar dourado (#E8A644)"} como secundária, com acentos em rosa, azul, verde, amarelo e lavanda sobre fundo creme claro. Tipografia Fredoka (display/headings — arredondada e divertida) + Nunito (body — limpa e legível). Bordas bem arredondadas. Animações com Framer Motion. Estrutura: Navbar fixa com blur, logo com ícone de cachorro, carrinho com badge. Hero full-height com grid 2 colunas (texto + imagem com badges flutuantes). Seção Serviços com 6 cards. Seção Produtos com 4 cards. Seção Depoimentos com 3 cards. CTA com gradiente e patinhas flutuantes. Footer escuro com 4 colunas. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  sobrancelhas: {
    label: "✨ Design de Sobrancelhas",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site one-page para um estúdio de design de sobrancelhas chamado "${name}". Visual elegante e feminino com tons de ${primary || "creme e dourado"} e ${secondary || "rosé"}. Use Playfair Display para títulos e Raleway para corpo de texto. Seções: Navbar fixa com logo, links (Serviços, Sobre, Contato) e botão "Agendar". Hero com imagem de fundo de um salão de beleza luxuoso, título "Design de Sobrancelhas", subtítulo e botão CTA. Serviços com 3 cards: Microblading (R$350), Design Personalizado (R$80) e Micropigmentação (R$450). Sobre com texto sobre 8+ anos de experiência, estatísticas. Contato com cards de WhatsApp, Instagram, Endereço e Horário. Footer elegante. Design responsivo com animações suaves.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  mecanica: {
    label: "🔧 Mecânica Automotiva",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site para uma mecânica automotiva chamada "${name}". Tema escuro industrial com acentos em ${primary || "âmbar/laranja"}, cor secundária ${secondary || "cinza escuro"}. Tipografia Oswald para títulos e Inter para corpo. Animações suaves com Framer Motion. Inclui: navbar fixa, hero fullscreen com imagem de oficina, seção de 6 serviços, seção Sobre Nós com estatísticas, formulário de contato e rodapé. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  hamburgueria: {
    label: "🍔 Hamburgueria",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site one-page premium para uma hamburgueria chamada "${name}", com visual impactante, moderno e apetitoso, estilo editorial urbano com clima noturno. Paleta com fundo escuro, tons ${primary || "âmbar e laranja queimado"}, ${secondary || "cobre e neutros elegantes"}. Tipografia marcante. Seções: Header fixo, Hero com título grande e CTAs, Cardápio com 6 cards elegantes, Seção Sobre, Estatísticas, CTA forte, Contato e Footer. Animações suaves. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  acaiteria: {
    label: "🫐 Açaiteria",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma açaiteria chamada "${name}". Estética tropical e vibrante com paleta baseada em ${primary || "roxo profundo do açaí"}, ${secondary || "verde amazônico"} e dourado como acento. Tipografia Playfair Display para títulos e DM Sans para corpo. Seções: Hero, Cardápio com 3 cards de produtos, Sobre nós com estatísticas, Contato. Footer elegante. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  lavarapido: {
    label: "🚗 Lava-Rápido",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um lava-rápido premium chamado "${name}". Tema escuro e sofisticado com acentos em ${primary || "azul neon e ciano"}, cor secundária ${secondary || "cinza escuro metálico"}. Seções: Navbar fixa, Hero fullscreen, Seção Serviços com 6 cards, Seção Planos & Preços com 3 cards, Seção Contato, Footer. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  assistencia: {
    label: "🔧 Assistência Técnica",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site de uma página para uma assistência técnica de celulares e computadores chamada "${name}". Tema escuro com acentos em ${primary || "azul elétrico"} e ${secondary || "verde-azulado"}. Seções: Header fixo, Hero com imagem de bancada, Seção Serviços com 8 cards, Seção Sobre Nós com estatísticas, Seção Contato com formulário. Footer minimalista. Animações com Framer Motion, glassmorphism. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  academia: {
    label: "🏋️ Academia",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma academia chamada "${name}". Tema escuro e energético com acentos em ${primary || "vermelho e laranja"}, cor secundária ${secondary || "cinza escuro"}. Seções: Navbar fixa, Hero fullscreen, Seção Modalidades com cards, Seção Planos com 3 opções, Seção Sobre, Contato e Footer. Animações com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  advogado: {
    label: "⚖️ Escritório de Advocacia",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um escritório de advocacia chamado "${name}". Visual sóbrio e profissional com fundo escuro, acentos em ${primary || "dourado"} e ${secondary || "azul marinho"}. Seções: Navbar fixa, Hero, Áreas de Atuação com cards, Seção Sobre com estatísticas, Depoimentos, Contato e Footer elegante. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  imobiliaria: {
    label: "🏠 Imobiliária",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma imobiliária chamada "${name}". Visual moderno e sofisticado com fundo claro, acentos em ${primary || "azul escuro"} e ${secondary || "dourado"}. Seções: Navbar fixa, Hero com busca de imóveis, Seção Destaques com 4 cards de imóveis, Seção Serviços, Seção Sobre com estatísticas, Contato e Footer. Animações suaves. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  salaobeleza: {
    label: "💇 Salão de Beleza",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um salão de beleza chamado "${name}". Visual elegante e feminino com tons de ${primary || "rosa e dourado"}, cor secundária ${secondary || "nude e creme"}. Seções: Navbar fixa, Hero, Seção Serviços com cards, Seção Sobre, Depoimentos, Contato e Footer elegante. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  contabilidade: {
    label: "📊 Contabilidade",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um escritório de contabilidade chamado "${name}". Visual profissional e confiável com fundo escuro, acentos em ${primary || "verde escuro"} e ${secondary || "azul"}. Seções: Navbar fixa, Hero, Seção Serviços com cards, Seção Sobre com estatísticas, Depoimentos, Contato e Footer. Animações suaves. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  estetica: {
    label: "✨ Estética / Depilação",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um estúdio de depilação e estética chamado "${name}". Paleta de tons de creme (#f7f3ed fundo), ${primary || "dourado (hsl 38° 45% 60%)"} como acento, ${secondary || "charcoal escuro"} para texto. Fontes Playfair Display (headings) + Raleway (body). Glass cards com backdrop-blur. Seções: Navbar fixa, Hero fullscreen, Seção Serviços com cards, Seção Preços com 3 planos, Depoimentos, Contato e Footer elegante. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  marmitaria: {
    label: "🍱 Marmitaria",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma marmitaria chamada "${name}". Visual acolhedor e caseiro com fundo claro, tons de ${primary || "verde natural e terracota"}, cor secundária ${secondary || "amarelo quente"}. Seções: Navbar com logo, Hero com tag "🍽️ Comida de verdade, feita com amor", Seção Cardápio com cards de marmitas, Seção Sobre com diferenciais, Seção Contato com formulário e Footer simples. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  idiomas: {
    label: "🌍 Escola de Idiomas",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma escola de idiomas chamada "${name}". Visual moderno e educacional com fundo claro, acentos em ${primary || "azul vibrante"} e ${secondary || "verde-esmeralda"}. Seções: Navbar, Hero com badge "✨ Matrículas abertas 2026", Seção Cursos com cards de Inglês e Espanhol, Seção Sobre com 6 diferenciais, Seção Depoimentos, Seção Preços com 3 planos e Footer. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  fotografo: {
    label: "📸 Fotógrafo",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site portfolio para um fotógrafo chamado "${name}". Visual minimalista e artístico com fundo escuro, acentos em ${primary || "branco e cinza claro"}, cor secundária ${secondary || "cinza escuro"}. Seções: Navbar minimalista com iniciais, Hero fullscreen com título "Fotografia Autoral" e botão "Ver Portfolio", Galeria com grid de 6 categorias (Paisagens, Urbano, Casamentos, Arquitetura, Fashion, Documental), Seção Sobre com estatísticas (projetos, anos, prêmios), Seção Contato com formulário e links de redes sociais, Footer elegante. Tipografia fina e espaçosa. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  "marketing-digital": {
    label: "📈 Marketing Digital",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma agência de marketing digital chamada "${name}". Visual moderno e profissional com fundo escuro, acentos em ${primary || "azul elétrico"} e ${secondary || "roxo vibrante"}. Seções: Navbar fixa com botão "Fale Conosco", Hero com badge "Transforme seu negócio digital" e título "Marketing Digital que Converte", Seção Serviços com 6 cards (SEO, Tráfego Pago, Branding, Social Media, Email Marketing, Analytics), Estatísticas (350+ clientes, 12M+ leads, 98% satisfação, 5x ROI), Seção Depoimentos com 3 clientes, CTA "Pronto para escalar?" com botão de consultoria gratuita, Footer com links sociais. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  "artes-marciais": {
    label: "🥊 Academia de Artes Marciais",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma academia de artes marciais chamada "${name}". Tema escuro e agressivo com acentos em ${primary || "vermelho sangue"} e ${secondary || "cinza escuro"}. Tipografia Oswald condensada para títulos uppercase. Seções: Navbar fixa com botão "AULA GRÁTIS", Hero fullscreen com título "FORJE SEU ESPÍRITO DE LUTA", Seção Modalidades com 4 cards (Boxe, Muay Thai, Jiu-Jitsu, MMA), Estatísticas (500+ alunos, 15+ anos, 8 professores, 30+ campeões), Seção Planos com 3 opções (Básico, Premium, Black), CTA com botão pulsante, Footer minimalista. Animações intensas com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  papelaria: {
    label: "🌸 Papelaria / Artesanato",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma papelaria artesanal chamada "${name}". Visual delicado e feminino com fundo claro (creme/off-white), acentos em ${primary || "rosa suave"} e ${secondary || "verde-menta"}. Tipografia elegante e leve. Seções: Navbar com logo e links (Início, Produtos, Categorias, Sobre, Contato), Hero com título "A beleza está nos detalhes" e botões "Ver Coleção" e "Nossa História", Seção Produtos com 6 cards de itens (Cadernos Artesanais, Kit Washi Tapes, Canetas Premium, Envelopes & Lacres, Material de Arte, Stickers & Planner) com preços e tags (Novo, Popular, Oferta), Seção Categorias com 6 cards, Seção Sobre com história e diferenciais (Sustentável, Entrega Rápida, Qualidade), Newsletter, Footer com 3 colunas. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
};

const fontOptions = [
  { value: "playfair-raleway", label: "Playfair Display + Raleway", desc: "Clássico e elegante" },
  { value: "inter-space", label: "Inter + Space Grotesk", desc: "Moderno e limpo" },
  { value: "poppins-dm", label: "Poppins + DM Sans", desc: "Amigável e atual" },
  { value: "oswald-roboto", label: "Oswald + Roboto", desc: "Forte e industrial" },
  { value: "cormorant-lato", label: "Cormorant Garamond + Lato", desc: "Sofisticado e premium" },
  { value: "fredoka-nunito", label: "Fredoka + Nunito", desc: "Divertido e arredondado" },
  { value: "montserrat-opensans", label: "Montserrat + Open Sans", desc: "Versátil e profissional" },
];

const designStyles = [
  {
    value: "conversao",
    label: "🎯 Design de Conversão",
    desc: "Página única focada em uma ação (CTA). Ideal para infoprodutos, serviços e promoções.",
    prompt: "Estilo landing page de conversão: foco total em um único CTA principal, estrutura vertical sem menus complexos, com depoimentos, benefícios claros, prova social e preços destacados. Eliminar distrações para maximizar conversão.",
  },
  {
    value: "catalogo",
    label: "🛍️ Catálogo / E-commerce Clean",
    desc: "Visualização de produtos com fotos de alta qualidade e navegação intuitiva. Ideal para lojas de roupas, eletrônicos e móveis.",
    prompt: "Estilo catálogo/e-commerce limpo: priorizar visualização dos produtos com fotos grandes e fundos neutros, navegação intuitiva com filtros e categorias bem visíveis, grid de produtos organizado.",
  },
  {
    value: "local-first",
    label: "📍 Local-First (Geolocalização)",
    desc: "Informações práticas em destaque: mapa, 'Como chegar', horário e telefone. Ideal para restaurantes, oficinas e salões.",
    prompt: "Estilo local-first: colocar informações práticas em primeiro plano (mapa de localização, botão 'Como Chegar', horário de funcionamento, telefone clicável). Design extremamente rápido e mobile-first, otimizado para quem está na rua procurando o local.",
  },
  {
    value: "institucional",
    label: "🏢 Institucional Moderno",
    desc: "Transmite autoridade e profissionalismo com seção 'Quem Somos', fotos da equipe e cores sólidas. Ideal para escritórios e empresas.",
    prompt: "Estilo institucional moderno: passar autoridade e profissionalismo com estrutura organizada, fotos da equipe, seção 'Quem Somos' detalhada, cores sólidas, fontes serifadas para transmitir confiança e tradição.",
  },
  {
    value: "lifestyle",
    label: "🌿 Visual / Estético (Lifestyle)",
    desc: "Foca em vender experiência e estilo de vida com fotos ambientadas e design elegante. Ideal para cafeterias, spas e hotéis.",
    prompt: "Estilo visual/lifestyle: foco em vender uma experiência e estilo de vida, menos texto e mais imagens ambientadas e vídeos em tela cheia mostrando o produto em uso. Design elegante com margens amplas e tipografia refinada.",
  },
  {
    value: "cardapio-digital",
    label: "📋 Cardápio Digital / Reservas",
    desc: "Facilita escolhas rápidas com grids organizados, fotos dos pratos, preços destacados e integração com pagamento/agendamento.",
    prompt: "Estilo cardápio digital: facilitar escolhas rápidas com grids organizados, fotos dos pratos/serviços, preços bem destacados, integração direta com sistema de pagamento ou agendamento online.",
  },
];

const SitesView = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [niche, setNiche] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [features, setFeatures] = useState("");
  const [font, setFont] = useState("");
  const [designStyle, setDesignStyle] = useState("");
  const [copied, setCopied] = useState(false);
  const [showDesignInfo, setShowDesignInfo] = useState(false);

  const handleGenerate = () => {
    if (!projectName.trim() || !niche) return;

    const template = nicheTemplates[niche];
    if (!template) return;

    let generated = template.buildPrompt(
      projectName.trim(),
      primaryColor.trim(),
      secondaryColor.trim(),
      features.trim()
    );

    // Add font override
    if (font) {
      const selectedFont = fontOptions.find((f) => f.value === font);
      if (selectedFont) {
        generated += ` Use as fontes ${selectedFont.label} (a primeira para títulos/headings e a segunda para corpo de texto).`;
      }
    }

    // Add design style
    if (designStyle) {
      const selectedStyle = designStyles.find((s) => s.value === designStyle);
      if (selectedStyle) {
        generated += ` ${selectedStyle.prompt}`;
      }
    }

    if (address.trim()) generated += ` Endereço do estabelecimento: ${address.trim()}.`;
    if (phone.trim()) generated += ` Telefone: ${phone.trim()}.`;

    navigator.clipboard.writeText(generated)
      .catch(() => {
        toast.error("Não consegui copiar automaticamente. Você ainda pode gerar e colar manualmente.");
      })
      .finally(() => {
        setCopied(true);
        toast.success("Tudo pronto! Cole na plataforma para criar seu site.");
        setTimeout(() => {
          setCopied(false);
          const newWindow = window.open("https://lovable.dev/projects/create", "_blank", "noopener,noreferrer");
          if (newWindow) {
            newWindow.opener = null;
          }
        }, 1200);
      });
  };

  const selectedDesignInfo = designStyles.find((s) => s.value === designStyle);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">Criador de Sites</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Preencha os dados do seu projeto e crie seu site profissional com IA em segundos
        </p>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Gerador de Prompt
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nome do Projeto *</label>
            <Input
              placeholder="Ex: Royal Barber, Forno & Massa"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-secondary/50 border-border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tipo de Negócio *</label>
            <Select value={niche} onValueChange={setNiche}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Selecione o nicho" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(nicheTemplates).map(([key, t]) => (
                  <SelectItem key={key} value={key}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Design Style + Font */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground">Estilo de Design</label>
              <button
                type="button"
                onClick={() => setShowDesignInfo(!showDesignInfo)}
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Ver detalhes dos estilos"
              >
                <Info className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/guia-design")}
                className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                Ver guia completo <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <Select value={designStyle} onValueChange={setDesignStyle}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Selecione o estilo (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {designStyles.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDesignInfo && (
              <p className="text-xs text-muted-foreground">{selectedDesignInfo.desc}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground">Fonte das Letras</label>
              <button
                type="button"
                onClick={() => navigate("/guia-fontes")}
                className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                Ver exemplos <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <Select value={font} onValueChange={setFont}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Selecione a fonte (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label} — {f.desc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Design styles info panel */}
        <AnimatePresence>
          {showDesignInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-xl bg-secondary/30 border border-border">
                {designStyles.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => {
                      setDesignStyle(s.value);
                      setShowDesignInfo(false);
                    }}
                    className={`text-left p-3 rounded-lg border transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 ${
                      designStyle === s.value
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background/50"
                    }`}
                  >
                    <p className="text-sm font-semibold text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Endereço</label>
            <Input
              placeholder="Ex: Rua das Flores, 123 - Centro"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-secondary/50 border-border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Telefone / WhatsApp</label>
            <Input
              placeholder="Ex: (11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-secondary/50 border-border"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Cor Principal</label>
            <Input
              placeholder="Ex: dourado, azul escuro"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="bg-secondary/50 border-border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Cor Secundária</label>
            <Input
              placeholder="Ex: cinza, verde-água"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="bg-secondary/50 border-border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Funcionalidades Extras</label>
            <Input
              placeholder="Ex: Agendamento, Cardápio, Blog"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className="bg-secondary/50 border-border"
            />
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="hero"
            size="lg"
            onClick={handleGenerate}
            disabled={!projectName.trim() || !niche}
            className="w-full"
          >
            {copied ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {copied ? "Copiado! Redirecionando..." : "Criar Meu Site com IA"}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SitesView;
