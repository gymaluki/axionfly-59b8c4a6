import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Sparkles,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Store,
  Palette,
  Type,
  MapPin,
  Phone,
  Clock,
  Eye,
  Target,
  MessageSquare,
  FileText,
  MousePointerClick,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import AIBuildersGrid from "@/components/AIBuildersGrid";
import AIBuilderPicker from "@/components/AIBuilderPicker";

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
    desc: "Visualização de produtos com fotos de alta qualidade e navegação intuitiva.",
    prompt: "Estilo catálogo/e-commerce limpo: priorizar visualização dos produtos com fotos grandes e fundos neutros, navegação intuitiva com filtros e categorias bem visíveis, grid de produtos organizado.",
  },
  {
    value: "local-first",
    label: "📍 Local-First (Geolocalização)",
    desc: "Informações práticas em destaque: mapa, 'Como chegar', horário e telefone.",
    prompt: "Estilo local-first: colocar informações práticas em primeiro plano (mapa de localização, botão 'Como Chegar', horário de funcionamento, telefone clicável). Design extremamente rápido e mobile-first.",
  },
  {
    value: "institucional",
    label: "🏢 Institucional Moderno",
    desc: "Transmite autoridade e profissionalismo com seção 'Quem Somos' e cores sólidas.",
    prompt: "Estilo institucional moderno: passar autoridade e profissionalismo com estrutura organizada, fotos da equipe, seção 'Quem Somos' detalhada, cores sólidas, fontes serifadas para transmitir confiança e tradição.",
  },
  {
    value: "lifestyle",
    label: "🌿 Visual / Estético (Lifestyle)",
    desc: "Foca em vender experiência e estilo de vida com fotos ambientadas.",
    prompt: "Estilo visual/lifestyle: foco em vender uma experiência e estilo de vida, menos texto e mais imagens ambientadas e vídeos em tela cheia. Design elegante com margens amplas e tipografia refinada.",
  },
  {
    value: "cardapio-digital",
    label: "📋 Cardápio Digital / Reservas",
    desc: "Grids organizados, fotos dos pratos, preços destacados e integração com agendamento.",
    prompt: "Estilo cardápio digital: facilitar escolhas rápidas com grids organizados, fotos dos pratos/serviços, preços bem destacados, integração direta com sistema de pagamento ou agendamento online.",
  },
];

const siteObjectives = [
  { value: "leads", label: "📩 Gerar Leads", desc: "Captar contatos e potenciais clientes" },
  { value: "vendas", label: "🛒 Vender Produtos/Serviços", desc: "Levar o visitante a comprar" },
  { value: "portfolio", label: "🎨 Portfólio", desc: "Mostrar trabalhos e projetos realizados" },
  { value: "institucional", label: "🏢 Institucional", desc: "Apresentar a empresa e gerar confiança" },
];

const toneOptions = [
  { value: "formal", label: "👔 Formal", desc: "Sério, profissional e corporativo" },
  { value: "amigavel", label: "😊 Amigável", desc: "Próximo, caloroso e acessível" },
  { value: "criativo", label: "🎨 Criativo", desc: "Ousado, divertido e inovador" },
  { value: "autoritario", label: "🏆 Autoritário", desc: "Especialista, confiante e direto" },
];

const pageOptions = [
  { value: "inicio", label: "Início" },
  { value: "sobre", label: "Sobre Nós" },
  { value: "servicos", label: "Serviços" },
  { value: "depoimentos", label: "Depoimentos" },
  { value: "faq", label: "FAQ" },
  { value: "blog", label: "Blog" },
  { value: "galeria", label: "Galeria de Fotos" },
  { value: "precos", label: "Preços / Planos" },
];

const ctaOptions = [
  { value: "whatsapp", label: "📱 Enviar WhatsApp", desc: "Redireciona para conversa no WhatsApp" },
  { value: "checkout", label: "💳 Ir para Checkout", desc: "Leva direto para a página de pagamento" },
  { value: "formulario", label: "📝 Preencher Formulário", desc: "Abre um formulário de contato/orçamento" },
  { value: "agendar", label: "📅 Agendar Horário", desc: "Leva para agendamento online" },
  { value: "ligar", label: "📞 Ligar Agora", desc: "Inicia uma ligação telefônica" },
];

const sloganSuggestions: Record<string, string[]> = {
  barbearia: ["Estilo & Tradição", "Onde o corte vira arte", "Seu visual, nossa missão", "A navalha da confiança", "Mais que um corte, uma experiência"],
  pizzaria: ["Sabor que conquista", "Direto do forno pro coração", "A fatia perfeita existe", "Tradição em cada mordida", "Pizza feita com paixão"],
  "fine-dining": ["Sabores que contam histórias", "Uma experiência além do paladar", "Onde a arte encontra a gastronomia", "Excelência em cada detalhe"],
  "restaurante-bairro": ["Comida de verdade, feita com amor", "O sabor de se sentir em casa", "Tempero de família", "Aqui todo mundo é de casa"],
  clinica: ["Seu sorriso em boas mãos", "Cuidado que transforma sorrisos", "Tecnologia e confiança para o seu sorriso", "Saúde bucal com excelência"],
  petshop: ["Amor em cada patinha", "Seu pet merece o melhor", "Cuidado que faz o rabo abanar", "O paraíso do seu pet"],
  sobrancelhas: ["O olhar que encanta", "Beleza nos mínimos detalhes", "Realce o que você tem de melhor", "Design que transforma"],
  mecanica: ["Confiança embaixo do capô", "Seu carro em boas mãos", "Performance e segurança garantidas", "A solução que você precisa"],
  hamburgueria: ["Sabor sem limites", "O smash que vicia", "Feito na brasa, com alma", "Aqui o burger é levado a sério"],
  acaiteria: ["Energia pura da Amazônia", "Sabor tropical, alma brasileira", "Açaí do jeito que você merece", "Refrescância que dá energia"],
  lavarapido: ["Brilho que impressiona", "Seu carro como novo, sempre", "Cuidado premium pro seu veículo", "Limpeza que você vê e sente"],
  assistencia: ["Tecnologia que volta a funcionar", "Conserto rápido, confiança total", "Seu dispositivo em boas mãos", "A solução tech que você precisa"],
  academia: ["Supere seus limites", "Transforme corpo e mente", "O treino que muda sua vida", "Força, foco e resultado"],
  advogado: ["Justiça com estratégia", "Seu direito, nossa luta", "Advocacia de resultado", "Confiança e competência jurídica"],
  imobiliaria: ["O lar dos seus sonhos te espera", "Seu novo endereço começa aqui", "Realizando sonhos em cada chave", "Imóveis que combinam com você"],
  salaobeleza: ["Beleza que transforma", "Realce a sua essência", "Seu momento de brilhar", "Beleza com personalidade"],
  contabilidade: ["Números que fazem sentido", "Seu negócio em boas contas", "Contabilidade inteligente", "Resultados que você pode contar"],
  estetica: ["Beleza é cuidar de si", "Sua melhor versão começa aqui", "Estética com resultado real", "Cuide-se, você merece"],
  marmitaria: ["Comida de verdade, feita com amor", "Sabor caseiro todo dia", "Sua refeição, nossa dedicação", "Tempero de mãe, praticidade de chef"],
  idiomas: ["O mundo fala, você também", "Fluência que abre portas", "Seu futuro é bilíngue", "Aprenda o idioma da oportunidade"],
  fotografo: ["Momentos que duram para sempre", "A arte de contar histórias em imagens", "Cada clique, uma emoção", "Fotografia que eterniza"],
  "marketing-digital": ["Resultados que você pode medir", "Marketing que converte de verdade", "Seu negócio no topo digital", "Estratégia + criatividade = resultado"],
  "artes-marciais": ["Forje seu espírito de luta", "Disciplina que transforma", "Supere-se a cada round", "Força interior, poder exterior"],
  papelaria: ["A beleza está nos detalhes", "Criatividade em cada página", "Papelaria que inspira", "Sua história merece ser escrita com estilo"],
};

const TOTAL_STEPS = 5;

const stepMeta = [
  { icon: Store, label: "Negócio" },
  { icon: Palette, label: "Design" },
  { icon: Type, label: "Visual" },
  { icon: MapPin, label: "Contato" },
  { icon: Eye, label: "Revisão" },
];

const SitesView = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [niche, setNiche] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [features, setFeatures] = useState("");
  const [font, setFont] = useState("");
  const [designStyle, setDesignStyle] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [slogan, setSlogan] = useState("");
  const [siteObjective, setSiteObjective] = useState("");
  const [tone, setTone] = useState("");
  const [selectedPages, setSelectedPages] = useState<string[]>(["inicio"]);
  const [ctaPrincipal, setCtaPrincipal] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [whatsappOrdering, setWhatsappOrdering] = useState(false);

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem("pending_site_creation");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setProjectName(data.projectName || "");
        setNiche(data.niche || "");
        setAddress(data.address || "");
        setPhone(data.phone || "");
        setPrimaryColor(data.primaryColor || "");
        setSecondaryColor(data.secondaryColor || "");
        setFeatures(data.features || "");
        setFont(data.font || "");
        setDesignStyle(data.designStyle || "");
        setSlogan(data.slogan || "");
        setSiteObjective(data.siteObjective || "");
        setTone(data.tone || "");
        setSelectedPages(data.selectedPages || ["inicio"]);
        setCtaPrincipal(data.ctaPrincipal || "");
        setBusinessHours(data.businessHours || "");
        setWhatsappOrdering(data.whatsappOrdering || false);
        setStep(data.step || 0);
        
        // Opcional: limpar após carregar para não ficar lixo no localStorage
        // Mas talvez seja melhor manter até o usuário realmente gerar o site
      } catch (e) {
        console.error("Erro ao carregar dados salvos:", e);
      }
    }
  }, []);

  const [hasInstalledExtension, setHasInstalledExtension] = useState(() => {
    return localStorage.getItem("has_installed_hyperbuild") === "true";
  });
  const [showExtensionModal, setShowExtensionModal] = useState(false);

  const foodNiches = ["pizzaria", "fine-dining", "restaurante-bairro", "hamburgueria", "acaiteria", "marmitaria"];

  const canAdvance = useMemo(() => {
    if (step === 0) return projectName.trim().length > 0 && niche.length > 0;
    return true; // other steps are optional
  }, [step, projectName, niche]);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const handleGenerate = () => {
    const template = nicheTemplates[niche];
    if (!template) return;

    let generated = template.buildPrompt(
      projectName.trim(),
      primaryColor.trim(),
      secondaryColor.trim(),
      features.trim()
    );

    if (font) {
      const selectedFont = fontOptions.find((f) => f.value === font);
      if (selectedFont) {
        generated += ` Use as fontes ${selectedFont.label} (a primeira para títulos/headings e a segunda para corpo de texto).`;
      }
    }

    if (designStyle) {
      const selectedStyle = designStyles.find((s) => s.value === designStyle);
      if (selectedStyle) {
        generated += ` ${selectedStyle.prompt}`;
      }
    }

    if (address.trim()) generated += ` Endereço do estabelecimento: ${address.trim()}.`;
    if (phone.trim()) generated += ` Telefone: ${phone.trim()}.`;
    if (businessHours.trim()) generated += ` Horário de funcionamento: ${businessHours.trim()}.`;
    if (slogan.trim()) generated += ` Slogan/tagline do negócio: "${slogan.trim()}". Use essa frase de forma destacada no hero ou header.`;

    const selectedTone = toneOptions.find(t => t.value === tone);
    if (selectedTone) generated += ` Tom de voz dos textos: ${selectedTone.label.replace(/^.\s/, "")} — ${selectedTone.desc}.`;

    const selectedObjective = siteObjectives.find(o => o.value === siteObjective);
    if (selectedObjective) generated += ` Objetivo principal do site: ${selectedObjective.desc}.`;

    if (selectedPages.length > 0) {
      const pageLabels = selectedPages.map(p => pageOptions.find(o => o.value === p)?.label).filter(Boolean);
      if (pageLabels.length > 0) generated += ` Incluir as seções: ${pageLabels.join(", ")}.`;
    }

    const selectedCta = ctaOptions.find(c => c.value === ctaPrincipal);
    if (selectedCta) generated += ` Botão CTA principal: "${selectedCta.label.replace(/^.\s/, "")}" — ${selectedCta.desc}.`;

    if (whatsappOrdering) {
      generated += ` IMPORTANTE: Inclua um sistema de pedidos via WhatsApp completo. Crie uma seção de cardápio interativo com botões "+" e "−" ao lado de cada item para adicionar/remover do carrinho, mostrando a quantidade selecionada entre os botões. Itens selecionados devem ter destaque visual. Adicione um botão flutuante fixo no canto inferior direito com ícone de carrinho e contador de itens (só aparece quando há itens no carrinho). Ao clicar, abra um modal de checkout em 2 etapas: Etapa 1 com campos Nome, Endereço, Forma de pagamento (Dinheiro/Cartão Crédito/Cartão Débito/PIX como toggles) e Observação. Etapa 2 com revisão completa e botão "Enviar WhatsApp". Ao confirmar, gere uma mensagem formatada com emojis (🍕 PEDIDO, 👤 Nome, 📍 Endereço, 💳 Pagamento, 📋 Itens, 📝 Observação) e envie via https://wa.me/{numero}?text={mensagem}. Após envio, limpar carrinho e fechar modal.`;
    }

    setGeneratedPrompt(generated);

    if (!hasInstalledExtension) {
      setShowExtensionModal(true);
    } else {
      setPickerOpen(true);
    }
  };

  const handleConfirmExtension = () => {
    localStorage.setItem("has_installed_hyperbuild", "true");
    setHasInstalledExtension(true);
    setShowExtensionModal(false);
    setPickerOpen(true);
  };

  const handleGoToExtension = () => {
    // Salva o estado atual do formulário para não perder os dados
    const formData = {
      projectName,
      niche,
      address,
      phone,
      primaryColor,
      secondaryColor,
      features,
      font,
      designStyle,
      slogan,
      siteObjective,
      tone,
      selectedPages,
      ctaPrincipal,
      businessHours,
      whatsappOrdering,
      step
    };
    localStorage.setItem("pending_site_creation", JSON.stringify(formData));
    
    // Redireciona para a seção de extensão dentro do dashboard
    navigate("/dashboard?view=extensao-lovable");
  };

  const nicheEntries = Object.entries(nicheTemplates);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Sobre o seu negócio</h3>
              <p className="text-sm text-muted-foreground">
                Comece escolhendo o nome e o tipo do seu projeto
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nome do Projeto *</label>
                <Input
                  placeholder="Ex: Royal Barber, Forno & Massa"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-secondary/50 border-border h-12 text-base"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Slogan / Tagline
                </label>
                <Input
                  placeholder="Ex: Estilo & Tradição, Sabor que conquista"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="bg-secondary/50 border-border"
                />
                <p className="text-xs text-muted-foreground">Frase curta que resume o seu negócio. Clique numa sugestão abaixo:</p>
                {niche && sloganSuggestions[niche] && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {sloganSuggestions[niche].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSlogan(s)}
                        className={cn(
                          "text-xs px-3 py-1.5 rounded-full border transition-all duration-200",
                          slogan === s
                            ? "border-primary bg-primary/15 text-primary font-medium"
                            : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tipo de Negócio *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {nicheEntries.map(([key, t]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setNiche(key)}
                      className={cn(
                        "text-left p-3 rounded-xl border transition-all duration-200 text-sm",
                        niche === key
                          ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                          : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-primary/5"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Estilo de Design</h3>
              <p className="text-sm text-muted-foreground">
                Escolha o estilo visual que combina com o seu negócio
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {designStyles.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setDesignStyle(s.value)}
                  className={cn(
                    "text-left p-4 rounded-xl border transition-all duration-200",
                    designStyle === s.value
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                      : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-primary/5"
                  )}
                >
                  <p className="text-sm font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                </button>
              ))}
            </div>

            {/* Objetivo do Site */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Objetivo do Site
              </label>
              <div className="grid sm:grid-cols-2 gap-2">
                {siteObjectives.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setSiteObjective(siteObjective === o.value ? "" : o.value)}
                    className={cn(
                      "text-left p-3 rounded-xl border transition-all duration-200 text-sm",
                      siteObjective === o.value
                        ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                        : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-primary/5"
                    )}
                  >
                    <span className="font-medium text-foreground">{o.label}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{o.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tom de Voz */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Tom de Voz
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {toneOptions.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(tone === t.value ? "" : t.value)}
                    className={cn(
                      "text-left p-3 rounded-xl border transition-all duration-200 text-sm",
                      tone === t.value
                        ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                        : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-primary/5"
                    )}
                  >
                    <span className="font-medium text-foreground">{t.label}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/guia-design")}
              className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              Ver guia completo de estilos <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Personalização Visual</h3>
              <p className="text-sm text-muted-foreground">
                Defina cores, fontes e funcionalidades extras
              </p>
            </div>

            <div className="space-y-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {fontOptions.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setFont(font === f.value ? "" : f.value)}
                      className={cn(
                        "text-left p-3 rounded-xl border transition-all duration-200 text-sm",
                        font === f.value
                          ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                          : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-primary/5"
                      )}
                    >
                      <span className="font-medium text-foreground">{f.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">— {f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Funcionalidades Extras</label>
                <Input
                  placeholder="Ex: Agendamento, Cardápio, Blog, Galeria de Fotos"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="bg-secondary/50 border-border"
                />
              </div>

              {/* WhatsApp Ordering Card - only for food niches */}
              {foodNiches.includes(niche) && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">🚀 Automação</label>
                  <button
                    type="button"
                    onClick={() => setWhatsappOrdering(!whatsappOrdering)}
                    className={cn(
                      "w-full text-left p-5 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group",
                      whatsappOrdering
                        ? "border-green-500 bg-green-500/10 ring-2 ring-green-500/20 shadow-lg shadow-green-500/10"
                        : "border-border bg-card hover:border-green-500/50 hover:bg-green-500/5"
                    )}
                  >
                    {/* Background glow when active */}
                    {whatsappOrdering && (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/10 pointer-events-none" />
                    )}
                    
                    <div className="relative flex items-start gap-4">
                      {/* Icon */}
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                        whatsappOrdering 
                          ? "bg-green-500/20 shadow-md shadow-green-500/20" 
                          : "bg-secondary/50 group-hover:bg-green-500/10"
                      )}>
                        <MessageSquare className={cn(
                          "w-6 h-6 transition-colors",
                          whatsappOrdering ? "text-green-400" : "text-muted-foreground group-hover:text-green-400"
                        )} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-foreground">
                            Pedidos via WhatsApp
                          </h4>
                          {/* Toggle indicator */}
                          <div className={cn(
                            "w-11 h-6 rounded-full transition-all duration-300 flex items-center px-0.5",
                            whatsappOrdering ? "bg-green-500" : "bg-muted"
                          )}>
                            <div className={cn(
                              "w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300",
                              whatsappOrdering ? "translate-x-5" : "translate-x-0"
                            )} />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Seus clientes escolhem os itens direto no site e o pedido vai formatado pro WhatsApp — sem app, sem comissão.
                        </p>
                        
                        {/* Feature pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {["Cardápio interativo", "Carrinho inline", "Checkout 2 etapas", "Envio automático"].map((feat) => (
                            <span 
                              key={feat}
                              className={cn(
                                "text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors",
                                whatsappOrdering 
                                  ? "bg-green-500/15 text-green-300 border border-green-500/20" 
                                  : "bg-secondary/50 text-muted-foreground border border-border"
                              )}
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Informações de Contato</h3>
              <p className="text-sm text-muted-foreground">
                Adicione endereço e telefone para aparecer no site
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Endereço
                </label>
                <Input
                  placeholder="Ex: Rua das Flores, 123 - Centro, São Paulo"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-secondary/50 border-border h-12"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Telefone / WhatsApp
                </label>
                <Input
                  placeholder="Ex: (11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-secondary/50 border-border h-12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Horário de Funcionamento
                </label>
                <Input
                  placeholder="Ex: Seg-Sex 9h às 18h, Sáb 9h às 13h"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  className="bg-secondary/50 border-border h-12"
                />
              </div>

              {/* Páginas Desejadas */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Páginas / Seções do Site
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {pageOptions.map((p) => {
                    const isSelected = selectedPages.includes(p.value);
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() =>
                          setSelectedPages(
                            isSelected
                              ? selectedPages.filter((v) => v !== p.value)
                              : [...selectedPages, p.value]
                          )
                        }
                        className={cn(
                          "p-2.5 rounded-xl border transition-all duration-200 text-sm text-center",
                          isSelected
                            ? "border-primary bg-primary/10 ring-1 ring-primary/30 text-foreground font-medium"
                            : "border-border bg-secondary/30 hover:border-primary/40 text-muted-foreground"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA Principal */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-primary" />
                  Botão Principal (CTA)
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {ctaOptions.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCtaPrincipal(ctaPrincipal === c.value ? "" : c.value)}
                      className={cn(
                        "text-left p-3 rounded-xl border transition-all duration-200 text-sm",
                        ctaPrincipal === c.value
                          ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                          : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-primary/5"
                      )}
                    >
                      <span className="font-medium text-foreground">{c.label}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Revisão Final</h3>
              <p className="text-sm text-muted-foreground">
                Confira as informações antes de gerar seu site
              </p>
            </div>

            <div className="space-y-3">
              <ReviewItem label="Nome" value={projectName} />
              <ReviewItem label="Slogan" value={slogan || "Não informado"} />
              <ReviewItem label="Tipo" value={nicheTemplates[niche]?.label || "—"} />
              <ReviewItem
                label="Objetivo"
                value={siteObjectives.find((o) => o.value === siteObjective)?.label || "Não definido"}
              />
              <ReviewItem
                label="Tom de Voz"
                value={toneOptions.find((t) => t.value === tone)?.label || "Padrão"}
              />
              <ReviewItem
                label="Estilo"
                value={designStyles.find((s) => s.value === designStyle)?.label || "Padrão do nicho"}
              />
              <ReviewItem
                label="Fonte"
                value={fontOptions.find((f) => f.value === font)?.label || "Padrão do nicho"}
              />
              <ReviewItem label="Cor Principal" value={primaryColor || "Padrão do nicho"} />
              <ReviewItem label="Cor Secundária" value={secondaryColor || "Padrão do nicho"} />
              <ReviewItem
                label="Páginas"
                value={selectedPages.length > 0
                  ? selectedPages.map(p => pageOptions.find(o => o.value === p)?.label).filter(Boolean).join(", ")
                  : "Padrão do nicho"}
              />
              <ReviewItem
                label="CTA Principal"
                value={ctaOptions.find((c) => c.value === ctaPrincipal)?.label || "Padrão do nicho"}
              />
              <ReviewItem label="Endereço" value={address || "Não informado"} />
              <ReviewItem label="Telefone" value={phone || "Não informado"} />
              <ReviewItem label="Horário" value={businessHours || "Não informado"} />
              <ReviewItem label="Extras" value={features || "Nenhum"} />
              {foodNiches.includes(niche) && (
                <ReviewItem label="Pedidos WhatsApp" value={whatsappOrdering ? "✅ Ativado" : "Desativado"} />
              )}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="hero"
                size="lg"
                onClick={handleGenerate}
                className="w-full"
              >
                <Sparkles className="w-4 h-4" />
                Criar Meu Site com IA
              </Button>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Criador de Sites</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Responda passo a passo e crie seu site profissional com IA
        </p>
      </div>

      {/* Step indicators */}
      <div className="relative max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between relative z-10">
          {stepMeta.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (i <= step || canAdvance) setStep(i);
                }}
                className={cn(
                  "flex flex-col items-center group transition-all duration-300",
                  i > step && !canAdvance && "opacity-40 cursor-not-allowed"
                )}
                disabled={i > step && !canAdvance}
              >
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isDone ? "#10b981" : isActive ? "#2563EB" : "transparent",
                    borderColor: isDone ? "#10b981" : isActive ? "#2563EB" : "rgba(255,255,255,0.15)",
                  }}
                  className={cn(
                    "w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative z-10",
                    isActive && "shadow-[0_0_20px_rgba(37,99,235,0.4)]",
                    isDone && "shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  )}
                >
                  {isDone ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-[#475569]")} />
                  )}
                </motion.div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest mt-3 transition-colors",
                  isActive ? "text-primary" : "text-[#475569]"
                )}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress Line */}
        <div className="absolute top-[50px] left-[15%] right-[15%] h-[2px] bg-white/10 -z-0">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${(step) * 25}%` }}
            className="h-full bg-gradient-to-r from-green-500 to-primary shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-card/50 border border-border rounded-2xl p-6 min-h-[340px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step < 4 && (
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div className="flex flex-col items-end gap-1">
            {step === 0 && !canAdvance && (projectName.trim().length === 0 || niche.length === 0) && (
              <span className="text-xs text-destructive">
                {projectName.trim().length === 0 ? "Preencha o nome do projeto" : "Selecione o tipo de negócio"}
              </span>
            )}
            <Button
              variant="neon"
              onClick={() => setStep(Math.min(TOTAL_STEPS - 1, step + 1))}
              disabled={!canAdvance}
              className="gap-2"
            >
              Avançar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex justify-start">
          <Button
            variant="ghost"
            onClick={() => setStep(3)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      )}

      <AIBuilderPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        prompt={generatedPrompt}
      />

      {/* Extension Install Check Modal */}
      <AnimatePresence>
        {showExtensionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Lovable Infinito
                </h2>
                <p className="text-muted-foreground text-sm">
                  Para criar sites ilimitados e sem travas, você já instalou a nossa extensão e gerou seu token?
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full h-12 font-bold gap-2" 
                  variant="neon"
                  onClick={handleConfirmExtension}
                >
                  <Check className="w-5 h-5" />
                  Sim, já instalei e configurei
                </Button>
                <Button 
                  className="w-full h-12 font-bold gap-2" 
                  variant="outline"
                  onClick={handleGoToExtension}
                >
                  <ExternalLink className="w-5 h-5" />
                  Não, quero instalar agora
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ReviewItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30 border border-border">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground text-right max-w-[60%] truncate">{value}</span>
  </div>
);

export default SitesView;
