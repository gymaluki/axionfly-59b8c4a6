import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check, Sparkles, ExternalLink, ArrowRight, ArrowLeft, RotateCcw,
  Store, Palette, Type, MapPin, Phone, Clock, Eye, MessageSquare,
  MousePointerClick, Search,
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AIBuildersGrid from "@/components/AIBuildersGrid";
import AIBuilderPicker from "@/components/AIBuilderPicker";
import ProspeccaoView from "@/components/views/ProspeccaoView";
import { ColorPalettePicker } from "@/components/sites/ColorPalettePicker";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NicheTemplate {
  label: string;
  buildPrompt: (name: string, primaryColor: string, secondaryColor: string, features: string) => string;
}

const nicheTemplates: Record<string, NicheTemplate> = {
  barbearia: {
    label: " Barbearia",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma barbearia chamada "${name}". Visual premium e sofisticado com fundo escuro (tons de cinza escuro/quase preto), acentos em ${primary || "dourado (gold gradient)"}. Cor secundária: ${secondary || "cinza escuro"}. Use a fonte Playfair Display para títulos e Raleway para corpo de texto. Seções: Hero fullscreen com imagem de barbearia premium e título "Estilo & Tradição" com gradiente ${primary || "dourado"}, botão "Agende seu Horário". Seção "Nossos Serviços" com 3 cards (Corte Masculino R$60, Barba R$45, Tratamento Capilar R$80 — cada um com imagem, descrição e preço). Seção "Sobre Nós" com texto sobre tradição e excelência, com estatísticas (15+ anos de experiência, 10.000+ clientes atendidos, 5 barbeiros especialistas, nota 4.9 de avaliação). Seção "Contato" com informações (endereço, telefone, horário de funcionamento e formulário). Footer simples. Animações suaves com framer-motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  pizzaria: {
    label: " Pizzaria",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma pizzaria chamada "${name}". Visual quente e acolhedor com fundo escuro (tons de preto e cinza escuro), acentos em ${primary || "vermelho queimado"} e ${secondary || "laranja"}. Use fontes display bold para títulos e uma fonte corpo clean. Seções: Hero com imagem de pizza artesanal saindo do forno, seção "Cardápio" com cards de pizzas (Margherita, Pepperoni, Quatro Queijos, Calabresa — com preço e descrição), seção "Sobre Nós" contando a história da pizzaria com estatísticas (anos de tradição, pizzas por mês, avaliações 5 estrelas), seção "Contato" com endereço, telefone, horário de funcionamento e formulário de pedido/reserva. Footer simples. Animações suaves com framer-motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  "fine-dining": {
    label: " Restaurante Fine Dining",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site de restaurante fine dining chamado "${name}" com tema escuro (fundo #1a1410), acentos ${primary || "dourados"}, cor secundária ${secondary || "bordô"}, tipografia Cormorant Garamond + Raleway. Seções: hero fullscreen com imagem do restaurante, cardápio com pratos alternados (filé, pasta, sobremesa) com fotos e preços, sobre com foto do chef e estatísticas (anos, clientes, avaliação), contato com reservas/endereço/horário, navbar fixa com blur e botão de reserva, footer elegante. Divisores dourados em gradiente entre seções. Animações suaves com framer-motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  "restaurante-bairro": {
    label: " Restaurante de Bairro",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site de restaurante de bairro acolhedor chamado '${name}'. Tons ${primary || "terrosos (terracotta, amarelo quente, creme)"}, cor secundária ${secondary || "amarelo quente"}, tipografia Merriweather + Open Sans. Hero com fachada do restaurante, badge 'desde 1998', botões de cardápio e WhatsApp. Cardápio com cards de feijoada/picanha/moqueca com fotos, estrelas, tags e preços. Seção sobre com foto do interior rústico, história da fundadora e ícones (tradição, família, caseiro, amor). Contato com telefone, WhatsApp, endereço e horário. Footer simples. Estilo casual, emojis, linguagem calorosa.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  clinica: {
    label: " Clínica Odontológica",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site para clínica odontológica chamado '${name}'. Use ${primary || "azul claro"} como cor primária, ${secondary || "verde-água"} como accent, fundo branco/cinza claro, tipografia Plus Jakarta Sans. Faça um hero split com texto à esquerda e foto do consultório à direita, com badges de biossegurança, CRO e horários flexíveis. Seção de serviços com cards contendo foto e ícone para clareamento dental, ortodontia invisível e implantes dentários, mais um grid de serviços extras (limpeza, odontopediatria, scanner 3D). Seção sobre a dentista com foto profissional, CRO, formação USP/UNICAMP, e estatísticas (pacientes, avaliação). Seção de depoimentos de pacientes com estrelas e iniciais. Seção de contato com botões de WhatsApp, telefone e Instagram, mais endereço e horário. Navbar fixa com logo e botão de agendar. Footer com CRO. Design profissional, limpo e que transmita confiança.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  petshop: {
    label: " Pet Shop",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site de pet shop chamado "${name}" com estética vibrante, acolhedora e playful. Paleta de cores quentes baseada em ${primary || "coral (#E8734A)"} como cor primária e ${secondary || "âmbar dourado (#E8A644)"} como secundária, com acentos em rosa, azul, verde, amarelo e lavanda sobre fundo creme claro. Tipografia Fredoka (display/headings — arredondada e divertida) + Nunito (body — limpa e legível). Bordas bem arredondadas. Animações com Framer Motion. Estrutura: Navbar fixa com blur, logo com ícone de cachorro, carrinho com badge. Hero full-height com grid 2 colunas (texto + imagem com badges flutuantes). Seção Serviços com 6 cards. Seção Produtos com 4 cards. Seção Depoimentos com 3 cards. CTA com gradiente e patinhas flutuantes. Footer escuro com 4 colunas. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  sobrancelhas: {
    label: " Design de Sobrancelhas",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site one-page para um estúdio de design de sobrancelhas chamado "${name}". Visual elegante e feminino com tons de ${primary || "creme e dourado"} e ${secondary || "rosé"}. Use Playfair Display para títulos e Raleway para corpo de texto. Seções: Navbar fixa com logo, links (Serviços, Sobre, Contato) e botão "Agendar". Hero com imagem de fundo de um salão de beleza luxuoso, título "Design de Sobrancelhas", subtítulo e botão CTA. Serviços com 3 cards: Microblading (R$350), Design Personalizado (R$80) e Micropigmentação (R$450). Sobre com texto sobre 8+ anos de experiência, estatísticas. Contato com cards de WhatsApp, Instagram, Endereço e Horário. Footer elegante. Design responsivo com animações suaves.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  mecanica: {
    label: " Mecânica Automotiva",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site para uma mecânica automotiva chamada "${name}". Tema escuro industrial com acentos em ${primary || "âmbar/laranja"}, cor secundária ${secondary || "cinza escuro"}. Tipografia Oswald para títulos e Inter para corpo. Animações suaves com Framer Motion. Inclui: navbar fixa, hero fullscreen com imagem de oficina, seção de 6 serviços, seção Sobre Nós com estatísticas, formulário de contato e rodapé. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  hamburgueria: {
    label: " Hamburgueria",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site one-page premium para uma hamburgueria chamada "${name}", com visual impactante, moderno e apetitoso, estilo editorial urbano com clima noturno. Paleta com fundo escuro, tons ${primary || "âmbar e laranja queimado"}, ${secondary || "cobre e neutros elegantes"}. Tipografia marcante. Seções: Header fixo, Hero com título grande e CTAs, Cardápio com 6 cards elegantes, Seção Sobre, Estatísticas, CTA forte, Contato e Footer. Animações suaves. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  acaiteria: {
    label: " Açaiteria",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma açaiteria chamada "${name}". Estética tropical e vibrante com paleta baseada em ${primary || "roxo profundo do açaí"}, ${secondary || "verde amazônico"} e dourado como acento. Tipografia Playfair Display para títulos e DM Sans para corpo. Seções: Hero, Cardápio com 3 cards de produtos, Sobre nós com estatísticas, Contato. Footer elegante. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  lavarapido: {
    label: " Lava-Rápido",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um lava-rápido premium chamado "${name}". Tema escuro e sofisticado com acentos em ${primary || "azul neon e ciano"}, cor secundária ${secondary || "cinza escuro metálico"}. Seções: Navbar fixa, Hero fullscreen, Seção Serviços com 6 cards, Seção Planos & Preços com 3 cards, Seção Contato, Footer. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  assistencia: {
    label: " Assistência Técnica",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site de uma página para uma assistência técnica de celulares e computadores chamada "${name}". Tema escuro com acentos em ${primary || "azul elétrico"} e ${secondary || "verde-azulado"}. Seções: Header fixo, Hero com imagem de bancada, Seção Serviços com 8 cards, Seção Sobre Nós com estatísticas, Seção Contato com formulário. Footer minimalista. Animações com Framer Motion, glassmorphism. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  academia: {
    label: " Academia",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma academia chamada "${name}". Tema escuro e energético com acentos em ${primary || "vermelho e laranja"}, cor secundária ${secondary || "cinza escuro"}. Seções: Navbar fixa, Hero fullscreen, Seção Modalidades com cards, Seção Planos com 3 opções, Seção Sobre, Contato e Footer. Animações com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  advogado: {
    label: " Escritório de Advocacia",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um escritório de advocacia chamado "${name}". Visual sóbrio e profissional com fundo escuro, acentos em ${primary || "dourado"} e ${secondary || "azul marinho"}. Seções: Navbar fixa, Hero, Áreas de Atuação com cards, Seção Sobre com estatísticas, Depoimentos, Contato e Footer elegante. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  imobiliaria: {
    label: " Imobiliária",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma imobiliária chamada "${name}". Visual moderno e sofisticado com fundo claro, acentos em ${primary || "azul escuro"} e ${secondary || "dourado"}. Seções: Navbar fixa, Hero com busca de imóveis, Seção Destaques com 4 cards de imóveis, Seção Serviços, Seção Sobre com estatísticas, Contato e Footer. Animações suaves. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  salaobeleza: {
    label: " Salão de Beleza",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um salão de beleza chamado "${name}". Visual elegante e feminino com tons de ${primary || "rosa e dourado"}, cor secundária ${secondary || "nude e creme"}. Seções: Navbar fixa, Hero, Seção Serviços com cards, Seção Sobre, Depoimentos, Contato e Footer elegante. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  contabilidade: {
    label: " Contabilidade",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um escritório de contabilidade chamado "${name}". Visual profissional e confiável com fundo escuro, acentos em ${primary || "verde escuro"} e ${secondary || "azul"}. Seções: Navbar fixa, Hero, Seção Serviços com cards, Seção Sobre com estatísticas, Depoimentos, Contato e Footer. Animações suaves. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  estetica: {
    label: " Estética / Depilação",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um estúdio de depilação e estética chamado "${name}". Paleta de tons de creme (#f7f3ed fundo), ${primary || "dourado (hsl 38° 45% 60%)"} como acento, ${secondary || "charcoal escuro"} para texto. Fontes Playfair Display (headings) + Raleway (body). Glass cards com backdrop-blur. Seções: Navbar fixa, Hero fullscreen, Seção Serviços com cards, Seção Preços com 3 planos, Depoimentos, Contato e Footer elegante. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  marmitaria: {
    label: " Marmitaria",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma marmitaria chamada "${name}". Visual acolhedor e caseiro com fundo claro, tons de ${primary || "verde natural e terracota"}, cor secundária ${secondary || "amarelo quente"}. Seções: Navbar com logo, Hero com tag " Comida de verdade, feita com amor", Seção Cardápio com cards de marmitas, Seção Sobre com diferenciais, Seção Contato com formulário e Footer simples. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  idiomas: {
    label: " Escola de Idiomas",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma escola de idiomas chamada "${name}". Visual moderno e educacional com fundo claro, acentos em ${primary || "azul vibrante"} e ${secondary || "verde-esmeralda"}. Seções: Navbar, Hero com badge " Matrículas abertas 2026", Seção Cursos com cards de Inglês e Espanhol, Seção Sobre com 6 diferenciais, Seção Depoimentos, Seção Preços com 3 planos e Footer. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  fotografo: {
    label: " Fotógrafo",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site portfolio para um fotógrafo chamado "${name}". Visual minimalista e artístico com fundo escuro, acentos em ${primary || "branco e cinza claro"}, cor secundária ${secondary || "cinza escuro"}. Seções: Navbar minimalista com iniciais, Hero fullscreen com título "Fotografia Autoral" e botão "Ver Portfolio", Galeria com grid de 6 categorias (Paisagens, Urbano, Casamentos, Arquitetura, Fashion, Documental), Seção Sobre com estatísticas (projetos, anos, prêmios), Seção Contato com formulário e links de redes sociais, Footer elegante. Tipografia fina e espaçosa. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  "marketing-digital": {
    label: " Marketing Digital",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma agência de marketing digital chamada "${name}". Visual moderno e profissional com fundo escuro, acentos em ${primary || "azul elétrico"} e ${secondary || "roxo vibrante"}. Seções: Navbar fixa com botão "Fale Conosco", Hero com badge "Transforme seu negócio digital" e título "Marketing Digital que Converte", Seção Serviços com 6 cards (SEO, Tráfego Pago, Branding, Social Media, Email Marketing, Analytics), Estatísticas (350+ clientes, 12M+ leads, 98% satisfação, 5x ROI), Seção Depoimentos com 3 clientes, CTA "Pronto para escalar?" com botão de consultoria gratuita, Footer com links sociais. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  "artes-marciais": {
    label: " Academia de Artes Marciais",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma academia de artes marciais chamada "${name}". Tema escuro e agressivo com acentos em ${primary || "vermelho sangue"} e ${secondary || "cinza escuro"}. Tipografia Oswald condensada para títulos uppercase. Seções: Navbar fixa com botão "AULA GRÁTIS", Hero fullscreen com título "FORJE SEU ESPÍRITO DE LUTA", Seção Modalidades com 4 cards (Boxe, Muay Thai, Jiu-Jitsu, MMA), Estatísticas (500+ alunos, 15+ anos, 8 professores, 30+ campeões), Seção Planos com 3 opções (Básico, Premium, Black), CTA com botão pulsante, Footer minimalista. Animações intensas com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  papelaria: {
    label: " Papelaria / Artesanato",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma papelaria artesanal chamada "${name}". Visual delicado e feminino com fundo claro (creme/off-white), acentos em ${primary || "rosa suave"} e ${secondary || "verde-menta"}. Tipografia elegante e leve. Seções: Navbar com logo e links (Início, Produtos, Categorias, Sobre, Contato), Hero com título "A beleza está nos detalhes" e botões "Ver Coleção" e "Nossa História", Seção Produtos com 6 cards de itens com preços e tags (Novo, Popular, Oferta), Seção Categorias com 6 cards, Seção Sobre com história e diferenciais (Sustentável, Entrega Rápida, Qualidade), Newsletter, Footer com 3 colunas. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  manicure: {
    label: " Manicure",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site one-page para um estúdio de manicure chamado "${name}". Visual delicado e moderno com fundo claro (off-white), acentos em ${primary || "rosa suave"} e ${secondary || "dourado rosé"}. Tipografia elegante. Seções: Navbar fixa, Hero com título sobre cuidado das unhas, Serviços (esmaltação em gel, alongamento, spa dos pés, nail art) com preços, Galeria com fotos de unhas, Sobre, Contato com agendamento. Footer simples. Animações suaves.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  dentista: {
    label: " Dentista",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site para consultório odontológico chamado "${name}". Visual limpo e profissional com fundo branco/cinza claro, acentos em ${primary || "azul sereno"} e ${secondary || "verde-água"}. Tipografia Plus Jakarta Sans. Seções: Hero split com badge de CRO, Serviços (clareamento, ortodontia invisível, implantes, limpeza) com cards, Sobre com formação, Depoimentos, Contato com WhatsApp e botão de agendamento. Design que transmite confiança.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  restaurante: {
    label: " Restaurante",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site para um restaurante chamado "${name}". Visual acolhedor e apetitoso com fundo escuro, tons ${primary || "terrosos"} e ${secondary || "dourado"}. Tipografia clássica + sans moderna. Seções: Hero com fachada, Cardápio com pratos principais, Sobre com história, Reservas, Contato com endereço, telefone e horário. Footer elegante. Animações suaves.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  padaria: {
    label: " Padaria",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site para uma padaria artesanal chamada "${name}". Visual quente e caseiro com fundo creme, acentos em ${primary || "marrom dourado"} e ${secondary || "amarelo trigo"}. Tipografia clássica. Seções: Hero com pães saindo do forno, Produtos (pães, bolos, doces, salgados) com fotos e preços, Sobre com tradição, Encomendas, Contato com endereço e horário. Footer simples.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  farmacia: {
    label: " Farmácia",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site para uma farmácia chamada "${name}". Visual clean e confiável com fundo branco, acentos em ${primary || "verde saúde"} e ${secondary || "azul"}. Tipografia limpa. Seções: Hero com proposta de atendimento humanizado, Serviços (entrega, manipulação, vacinas, aferição), Sobre, Contato com WhatsApp, endereço e horário. Footer simples e profissional.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  otica: {
    label: " Ótica",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site para uma ótica chamada "${name}". Visual moderno e sofisticado com fundo claro, acentos em ${primary || "azul profundo"} e ${secondary || "dourado"}. Tipografia elegante. Seções: Hero com modelos de óculos, Coleções (solar, grau, infantil, esportivo) com cards, Serviços (exame de vista, ajuste, garantia), Sobre, Contato com endereço e horário. Footer elegante.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  floricultura: {
    label: " Floricultura",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site para uma floricultura chamada "${name}". Visual delicado e colorido com fundo claro, acentos em ${primary || "rosa floral"} e ${secondary || "verde folha"}. Tipografia romântica + sans. Seções: Hero com buquês, Produtos (buquês, arranjos, plantas, cestas) com fotos e preços, Entregas, Sobre, Contato com WhatsApp e endereço. Footer com redes sociais.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
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
    label: " Design de Conversão",
    desc: "Página única focada em uma ação (CTA). Ideal para infoprodutos, serviços e promoções.",
    prompt: "Estilo landing page de conversão: foco total em um único CTA principal, estrutura vertical sem menus complexos, com depoimentos, benefícios claros, prova social e preços destacados. Eliminar distrações para maximizar conversão.",
  },
  {
    value: "catalogo",
    label: " Catálogo / E-commerce Clean",
    desc: "Visualização de produtos com fotos de alta qualidade e navegação intuitiva.",
    prompt: "Estilo catálogo/e-commerce limpo: priorizar visualização dos produtos com fotos grandes e fundos neutros, navegação intuitiva com filtros e categorias bem visíveis, grid de produtos organizado.",
  },
  {
    value: "local-first",
    label: " Local-First (Geolocalização)",
    desc: "Informações práticas em destaque: mapa, 'Como chegar', horário e telefone.",
    prompt: "Estilo local-first: colocar informações práticas em primeiro plano (mapa de localização, botão 'Como Chegar', horário de funcionamento, telefone clicável). Design extremamente rápido e mobile-first.",
  },
  {
    value: "institucional",
    label: " Institucional Moderno",
    desc: "Transmite autoridade e profissionalismo com seção 'Quem Somos' e cores sólidas.",
    prompt: "Estilo institucional moderno: passar autoridade e profissionalismo com estrutura organizada, fotos da equipe, seção 'Quem Somos' detalhada, cores sólidas, fontes serifadas para transmitir confiança e tradição.",
  },
  {
    value: "lifestyle",
    label: " Visual / Estético (Lifestyle)",
    desc: "Foca em vender experiência e estilo de vida com fotos ambientadas.",
    prompt: "Estilo visual/lifestyle: foco em vender uma experiência e estilo de vida, menos texto e mais imagens ambientadas e vídeos em tela cheia. Design elegante com margens amplas e tipografia refinada.",
  },
  {
    value: "cardapio-digital",
    label: " Cardápio Digital / Reservas",
    desc: "Grids organizados, fotos dos pratos, preços destacados e integração com agendamento.",
    prompt: "Estilo cardápio digital: facilitar escolhas rápidas com grids organizados, fotos dos pratos/serviços, preços bem destacados, integração direta com sistema de pagamento ou agendamento online.",
  },
];

const siteObjectives = [
  { value: "leads", label: " Gerar Leads", desc: "Captar contatos e potenciais clientes" },
  { value: "vendas", label: " Vender Produtos/Serviços", desc: "Levar o visitante a comprar" },
  { value: "portfolio", label: " Portfólio", desc: "Mostrar trabalhos e projetos realizados" },
  { value: "institucional", label: " Institucional", desc: "Apresentar a empresa e gerar confiança" },
];

const toneOptions = [
  { value: "formal", label: " Formal", desc: "Sério, profissional e corporativo" },
  { value: "amigavel", label: " Amigável", desc: "Próximo, caloroso e acessível" },
  { value: "criativo", label: " Criativo", desc: "Ousado, divertido e inovador" },
  { value: "autoritario", label: " Autoritário", desc: "Especialista, confiante e direto" },
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
  { value: "whatsapp", label: " Enviar WhatsApp", desc: "Redireciona para conversa no WhatsApp" },
  { value: "checkout", label: " Ir para Checkout", desc: "Leva direto para a página de pagamento" },
  { value: "formulario", label: " Preencher Formulário", desc: "Abre um formulário de contato/orçamento" },
  { value: "agendar", label: " Agendar Horário", desc: "Leva para agendamento online" },
  { value: "ligar", label: " Ligar Agora", desc: "Inicia uma ligação telefônica" },
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

// ============================================================
// LÓGICA INTERNA — não é exibida ao usuário
// Mapeia o nicho para presets de design, tom, páginas, fontes, etc.
// ============================================================
const nicheInternalConfig: Record<string, {
  designStyle: string;
  siteGoal: string;
  voiceTone: string;
  pages: string[];
  fontPair: string;
  defaultPrimary: string;
  defaultSecondary: string;
}> = {
  pizzaria:           { designStyle: "cardapio-digital", siteGoal: "gerar-pedidos", voiceTone: "amigavel",    pages: ["inicio","cardapio","localizacao","contato"], fontPair: "Playfair Display + Raleway",     defaultPrimary: "#E31837", defaultSecondary: "#FF6B35" },
  hamburgueria:       { designStyle: "cardapio-digital", siteGoal: "gerar-pedidos", voiceTone: "criativo",    pages: ["inicio","cardapio","contato"],                fontPair: "Oswald + Roboto",                 defaultPrimary: "#F97316", defaultSecondary: "#1A1A1A" },
  restaurante:        { designStyle: "cardapio-digital", siteGoal: "gerar-pedidos", voiceTone: "amigavel",    pages: ["inicio","cardapio","sobre","contato"],         fontPair: "Cormorant Garamond + Lato",        defaultPrimary: "#8B2E2E", defaultSecondary: "#D4AF37" },
  padaria:            { designStyle: "local-first",      siteGoal: "gerar-pedidos", voiceTone: "amigavel",    pages: ["inicio","produtos","sobre","contato"],         fontPair: "Playfair Display + Open Sans",     defaultPrimary: "#A0522D", defaultSecondary: "#E8B84A" },
  marmitaria:         { designStyle: "cardapio-digital", siteGoal: "gerar-pedidos", voiceTone: "amigavel",    pages: ["inicio","cardapio","contato"],                 fontPair: "Poppins + DM Sans",                defaultPrimary: "#16A34A", defaultSecondary: "#FACC15" },
  acaiteria:          { designStyle: "cardapio-digital", siteGoal: "gerar-pedidos", voiceTone: "criativo",    pages: ["inicio","cardapio","contato"],                 fontPair: "Playfair Display + DM Sans",       defaultPrimary: "#6B21A8", defaultSecondary: "#16A34A" },
  "fine-dining":      { designStyle: "lifestyle",        siteGoal: "institucional", voiceTone: "formal",      pages: ["inicio","cardapio","sobre","contato"],         fontPair: "Cormorant Garamond + Raleway",     defaultPrimary: "#D4AF37", defaultSecondary: "#1A1410" },
  "restaurante-bairro":{designStyle: "local-first",      siteGoal: "gerar-pedidos", voiceTone: "amigavel",    pages: ["inicio","cardapio","sobre","contato"],         fontPair: "Merriweather + Open Sans",         defaultPrimary: "#C2410C", defaultSecondary: "#FACC15" },
  barbearia:          { designStyle: "local-first",      siteGoal: "gerar-leads",   voiceTone: "autoritario", pages: ["inicio","servicos","galeria","contato"],       fontPair: "Oswald + Roboto",                  defaultPrimary: "#D4AF37", defaultSecondary: "#1A1A2E" },
  manicure:           { designStyle: "lifestyle",        siteGoal: "gerar-leads",   voiceTone: "amigavel",    pages: ["inicio","servicos","galeria","contato"],       fontPair: "Playfair Display + Raleway",       defaultPrimary: "#F472B6", defaultSecondary: "#D4AF37" },
  salaobeleza:        { designStyle: "lifestyle",        siteGoal: "gerar-leads",   voiceTone: "amigavel",    pages: ["inicio","servicos","sobre","contato"],         fontPair: "Cormorant Garamond + Lato",        defaultPrimary: "#F472B6", defaultSecondary: "#D4AF37" },
  estetica:           { designStyle: "lifestyle",        siteGoal: "gerar-leads",   voiceTone: "amigavel",    pages: ["inicio","servicos","sobre","contato"],         fontPair: "Cormorant Garamond + Lato",        defaultPrimary: "#F472B6", defaultSecondary: "#D4AF37" },
  sobrancelhas:       { designStyle: "lifestyle",        siteGoal: "gerar-leads",   voiceTone: "amigavel",    pages: ["inicio","servicos","contato"],                 fontPair: "Playfair Display + Raleway",       defaultPrimary: "#D4AF37", defaultSecondary: "#F472B6" },
  dentista:           { designStyle: "institucional",    siteGoal: "gerar-leads",   voiceTone: "formal",      pages: ["inicio","servicos","sobre","contato"],         fontPair: "Plus Jakarta Sans + Inter",        defaultPrimary: "#0EA5E9", defaultSecondary: "#10B981" },
  clinica:            { designStyle: "institucional",    siteGoal: "gerar-leads",   voiceTone: "formal",      pages: ["inicio","servicos","sobre","contato"],         fontPair: "Plus Jakarta Sans + Inter",        defaultPrimary: "#0EA5E9", defaultSecondary: "#10B981" },
  farmacia:           { designStyle: "institucional",    siteGoal: "institucional", voiceTone: "formal",      pages: ["inicio","servicos","contato"],                 fontPair: "Inter + Space Grotesk",            defaultPrimary: "#16A34A", defaultSecondary: "#0EA5E9" },
  otica:              { designStyle: "catalogo",         siteGoal: "gerar-leads",   voiceTone: "formal",      pages: ["inicio","produtos","servicos","contato"],      fontPair: "Cormorant Garamond + Lato",        defaultPrimary: "#1E3A8A", defaultSecondary: "#D4AF37" },
  academia:           { designStyle: "conversao",        siteGoal: "gerar-leads",   voiceTone: "autoritario", pages: ["inicio","planos","sobre","contato"],           fontPair: "Oswald + Roboto",                  defaultPrimary: "#DC2626", defaultSecondary: "#F97316" },
  "artes-marciais":   { designStyle: "conversao",        siteGoal: "gerar-leads",   voiceTone: "autoritario", pages: ["inicio","modalidades","planos","contato"],     fontPair: "Oswald + Roboto",                  defaultPrimary: "#DC2626", defaultSecondary: "#1A1A1A" },
  petshop:            { designStyle: "lifestyle",        siteGoal: "gerar-pedidos", voiceTone: "amigavel",    pages: ["inicio","servicos","produtos","contato"],      fontPair: "Fredoka + Nunito",                 defaultPrimary: "#E8734A", defaultSecondary: "#E8A644" },
  mecanica:           { designStyle: "local-first",      siteGoal: "gerar-leads",   voiceTone: "autoritario", pages: ["inicio","servicos","sobre","contato"],         fontPair: "Oswald + Inter",                   defaultPrimary: "#F97316", defaultSecondary: "#1A1A1A" },
  lavarapido:         { designStyle: "local-first",      siteGoal: "gerar-leads",   voiceTone: "criativo",    pages: ["inicio","servicos","planos","contato"],        fontPair: "Inter + Space Grotesk",            defaultPrimary: "#0EA5E9", defaultSecondary: "#1A1A1A" },
  assistencia:        { designStyle: "local-first",      siteGoal: "gerar-leads",   voiceTone: "autoritario", pages: ["inicio","servicos","sobre","contato"],         fontPair: "Inter + Space Grotesk",            defaultPrimary: "#0EA5E9", defaultSecondary: "#10B981" },
  imobiliaria:        { designStyle: "catalogo",         siteGoal: "gerar-leads",   voiceTone: "formal",      pages: ["inicio","imoveis","servicos","contato"],       fontPair: "Cormorant Garamond + Lato",        defaultPrimary: "#1E3A8A", defaultSecondary: "#D4AF37" },
  advogado:           { designStyle: "institucional",    siteGoal: "gerar-leads",   voiceTone: "formal",      pages: ["inicio","areas","sobre","contato"],            fontPair: "Cormorant Garamond + Raleway",     defaultPrimary: "#D4AF37", defaultSecondary: "#1E3A8A" },
  contabilidade:      { designStyle: "institucional",    siteGoal: "gerar-leads",   voiceTone: "formal",      pages: ["inicio","servicos","sobre","contato"],         fontPair: "Inter + Space Grotesk",            defaultPrimary: "#16A34A", defaultSecondary: "#1E3A8A" },
  idiomas:            { designStyle: "conversao",        siteGoal: "gerar-leads",   voiceTone: "amigavel",    pages: ["inicio","cursos","planos","contato"],          fontPair: "Poppins + DM Sans",                defaultPrimary: "#0EA5E9", defaultSecondary: "#10B981" },
  fotografo:          { designStyle: "lifestyle",        siteGoal: "portfolio",     voiceTone: "criativo",    pages: ["inicio","portfolio","sobre","contato"],        fontPair: "Playfair Display + Raleway",       defaultPrimary: "#F8FAFC", defaultSecondary: "#1A1A1A" },
  floricultura:       { designStyle: "catalogo",         siteGoal: "gerar-pedidos", voiceTone: "amigavel",    pages: ["inicio","produtos","contato"],                 fontPair: "Cormorant Garamond + Lato",        defaultPrimary: "#F472B6", defaultSecondary: "#16A34A" },
  papelaria:          { designStyle: "catalogo",         siteGoal: "gerar-pedidos", voiceTone: "criativo",    pages: ["inicio","produtos","sobre","contato"],         fontPair: "Cormorant Garamond + Lato",        defaultPrimary: "#F472B6", defaultSecondary: "#10B981" },
  "marketing-digital":{ designStyle: "conversao",        siteGoal: "gerar-leads",   voiceTone: "autoritario", pages: ["inicio","servicos","cases","contato"],         fontPair: "Inter + Space Grotesk",            defaultPrimary: "#2563EB", defaultSecondary: "#7C3AED" },
};

// ============================================================
// Cores nomeadas para o dropdown
// ============================================================
const namedColors: { name: string; hex: string }[] = [
  { name: "Vermelho Pepperoni", hex: "#E31837" },
  { name: "Azul Oceano",        hex: "#0EA5E9" },
  { name: "Verde Folha",        hex: "#16A34A" },
  { name: "Roxo Profundo",      hex: "#6B21A8" },
  { name: "Laranja Queimado",   hex: "#EA580C" },
  { name: "Preto Elegante",     hex: "#0F172A" },
  { name: "Branco Gelo",        hex: "#F8FAFC" },
  { name: "Dourado Premium",    hex: "#D4AF37" },
  { name: "Rosa Quartzo",       hex: "#F472B6" },
  { name: "Azul Marinho",       hex: "#1E3A8A" },
  { name: "Verde Esmeralda",    hex: "#10B981" },
  { name: "Cinza Grafite",      hex: "#374151" },
];

// ============================================================
// Funcionalidades extras (chips)
// ============================================================
const featureOptions = [
  "Cardápio Digital",
  "Galeria de Fotos",
  "Agendamento Online",
  "Mapa / Localização",
  "Formulário de Contato",
  "Depoimentos",
  "WhatsApp Flutuante",
  "FAQ",
  "Promoções / Banners",
];

// CTAs simplificados conforme o briefing
const simpleCtaOptions = [
  { value: "whatsapp",   label: "Enviar WhatsApp" },
  { value: "ligar",      label: "Ligar Agora" },
  { value: "formulario", label: "Preencher Formulário" },
  { value: "agendar",    label: "Agendar Horário" },
];

const TOTAL_STEPS = 6; // 0:Nicho 1:Leads 2:Negócio 3:Visual 4:Contato 5:Revisão

const stepMeta = [
  { icon: Store,    label: "Nicho" },
  { icon: Search,   label: "Leads" },
  { icon: Type,     label: "Negócio" },
  { icon: Palette,  label: "Visual" },
  { icon: MapPin,   label: "Contato" },
  { icon: Eye,      label: "Revisão" },
];

const SitesView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [niche, setNiche] = useState("");
  const [projectName, setProjectName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [ctaPrincipal, setCtaPrincipal] = useState("");

  const [pickerOpen, setPickerOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // ---- persistência local ----
  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`sites-quiz-state-${user.id}`);
    if (saved) {
      try {
        const s = JSON.parse(saved);
        setStep(s.step || 0);
        setNiche(s.niche || "");
        setProjectName(s.projectName || "");
        setSlogan(s.slogan || "");
        setPrimaryColor(s.primaryColor || "");
        setSecondaryColor(s.secondaryColor || "");
        setSelectedFeatures(s.selectedFeatures || []);
        setAddress(s.address || "");
        setPhone(s.phone || "");
        setBusinessHours(s.businessHours || "");
        setCtaPrincipal(s.ctaPrincipal || "");
      } catch {}
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(
      `sites-quiz-state-${user.id}`,
      JSON.stringify({
        step, niche, projectName, slogan, primaryColor, secondaryColor,
        selectedFeatures, address, phone, businessHours, ctaPrincipal,
      }),
    );
  }, [user, step, niche, projectName, slogan, primaryColor, secondaryColor, selectedFeatures, address, phone, businessHours, ctaPrincipal]);

  // ---- aplica cores padrão do nicho ao selecionar (sem mostrar lógica interna) ----
  useEffect(() => {
    if (!niche) return;
    const cfg = nicheInternalConfig[niche];
    if (!cfg) return;
    if (!primaryColor) setPrimaryColor(cfg.defaultPrimary);
    if (!secondaryColor) setSecondaryColor(cfg.defaultSecondary);
  }, [niche]); // eslint-disable-line

  // ---- extensão (modal) ----
  const [hasInstalledExtension, setHasInstalledExtension] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  useEffect(() => {
    if (user) {
      setHasInstalledExtension(localStorage.getItem(`has_installed_hyperbuild-${user.id}`) === "true");
    }
  }, [user]);

  const canAdvance = useMemo(() => {
    if (step === 0) return niche.length > 0;
    if (step === 1) return true; // Leads é opcional
    if (step === 2) return projectName.trim().length > 0;
    if (step === 3) return primaryColor.length > 0 && secondaryColor.length > 0;
    return true;
  }, [step, niche, projectName, primaryColor, secondaryColor]);

  const validationMessage = useMemo(() => {
    if (step === 0 && niche.length === 0) return "Selecione o tipo de negócio";
    if (step === 2 && projectName.trim().length === 0) return "Preencha o nome do projeto";
    if (step === 3 && (!primaryColor || !secondaryColor)) return "Escolha as duas cores";
    return "";
  }, [step, niche, projectName, primaryColor, secondaryColor]);

  const toggleFeature = (f: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  };

  const handleGenerate = () => {
    const template = nicheTemplates[niche];
    if (!template) return;
    const cfg = nicheInternalConfig[niche];

    const featuresStr = selectedFeatures.join(", ");
    const cta = simpleCtaOptions.find((c) => c.value === ctaPrincipal)?.label || "Entrar em contato";

    const prompt = `Você é um especialista em UI/UX e copywriting de alta conversão. Crie uma landing page profissional, responsiva e otimizada com as seguintes especificações:

### 1. NEGÓCIO
- **Nome:** ${projectName.trim()}
- **Nicho:** ${template.label}
- **Slogan:** ${slogan.trim() || "(gere um slogan curto e impactante baseado no nicho)"}

### 2. ESTRATÉGIA (interna)
- **Estilo de design:** ${cfg?.designStyle || "moderno"}
- **Objetivo do site:** ${cfg?.siteGoal || "conversão"}
- **Tom de voz:** ${cfg?.voiceTone || "profissional"}
- **Páginas/seções:** ${cfg?.pages.join(", ") || "início, sobre, serviços, contato"}
- **Tipografia recomendada:** ${cfg?.fontPair || "Inter + Space Grotesk"}

### 3. VISUAL
- **Cor principal:** ${primaryColor}
- **Cor secundária:** ${secondaryColor}
- **Funcionalidades extras:** ${featuresStr || "nenhuma"}

### 4. CONTATO
- **Endereço:** ${address.trim() || "Não informado"}
- **Telefone/WhatsApp:** ${phone.trim() || "Não informado"}
- **Horário:** ${businessHours.trim() || "Não informado"}
- **CTA Principal:** ${cta}

### 5. REQUISITOS
- Mobile-first, contraste WCAG AA, animações suaves com Framer Motion.
- Implemente os recursos extras escolhidos como seções dedicadas quando aplicável.
- O botão principal de toda página deve executar a ação "${cta}".

---
BASE DO TEMPLATE:
${template.buildPrompt(projectName.trim(), primaryColor, secondaryColor, featuresStr)}`;

    setGeneratedPrompt(prompt);

    if (!hasInstalledExtension) setShowExtensionModal(true);
    else setPickerOpen(true);
  };

  const handleConfirmExtension = () => {
    if (user) localStorage.setItem(`has_installed_hyperbuild-${user.id}`, "true");
    setHasInstalledExtension(true);
    setShowExtensionModal(false);
    setPickerOpen(true);
  };

  const handleGoToExtension = () => navigate("/dashboard?view=extensao-lovable");

  const nicheEntries = Object.entries(nicheTemplates);

  // ============================================================
  // RENDER DAS ETAPAS
  // ============================================================
  const renderStep = () => {
    switch (step) {
      // ---------- ETAPA 1 — NICHO ----------
      case 0:
        return (
          <div>
            <h2>Qual é o seu negócio?</h2>
            <p className="subtitle">Escolha o nicho que melhor representa o que você faz.</p>
            <div className="niche-grid">
              {nicheEntries.map(([key, t]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setNiche(key)}
                  className={cn("niche-card", niche === key && "selected")}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        );

      // ---------- ETAPA 2 — BUSCA DE LEADS ----------
      case 1:
        return (
          <div>
            <h2>Encontre seus clientes</h2>
            <p className="subtitle">
              Use a busca para achar negócios reais do seu nicho. Quando terminar, clique em <span style={{ color: "var(--q-accent-bright)", fontWeight: 600 }}>Avançar</span> para criar o site.
            </p>
            <div className="leads-wrapper quiz-prospeccao-wrap">
              <ProspeccaoView />
            </div>
            <style>{`
              .quiz-prospeccao-wrap .prospeccao-root { min-height: 0 !important; margin: 0 !important; }
              .quiz-prospeccao-wrap .pp-scroll { max-height: none !important; overflow: visible !important; }
              .quiz-prospeccao-wrap ::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none !important; }
              .quiz-prospeccao-wrap * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
            `}</style>
          </div>
        );

      // ---------- ETAPA 3 — NEGÓCIO ----------
      case 2:
        return (
          <div>
            <h2>Sobre o seu negócio</h2>
            <p className="subtitle">Como o seu negócio se chama e qual é a frase que o representa?</p>

            <div className="field-group">
              <label className="field-label">Nome do Projeto *</label>
              <input
                className="field-input"
                placeholder="Ex: Forno & Massa"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="field-group">
              <label className="field-label">
                <MessageSquare /> Slogan / Tagline
              </label>
              <input
                className="field-input"
                placeholder="Ex: Sabor que conquista"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
              />
              {niche && sloganSuggestions[niche] && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ fontSize: 11, color: "var(--q-text-muted)", marginBottom: 8, fontWeight: 500 }}>
                    Sugestões com base no seu nicho:
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {sloganSuggestions[niche].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSlogan(s)}
                        className={cn("sugg-chip", slogan === s && "selected")}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      // ---------- ETAPA 4 — VISUAL ----------
      case 3:
        return (
          <div>
            <h2>Personalização visual</h2>
            <p className="subtitle">Escolha as cores e os recursos extras do seu site.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div className="field-group" style={{ marginBottom: 0 }}>
                <label className="field-label">Cor Principal *</label>
                <Select value={primaryColor} onValueChange={setPrimaryColor}>
                  <SelectTrigger className="q-select-trigger">
                    <SelectValue placeholder="Selecione a cor principal">
                      {primaryColor && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)", background: primaryColor }} />
                          {namedColors.find((c) => c.hex === primaryColor)?.name || primaryColor}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {namedColors.map((c) => (
                      <SelectItem key={c.hex} value={c.hex}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)", background: c.hex }} />
                          {c.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="field-group" style={{ marginBottom: 0 }}>
                <label className="field-label">Cor Secundária *</label>
                <Select value={secondaryColor} onValueChange={setSecondaryColor}>
                  <SelectTrigger className="q-select-trigger">
                    <SelectValue placeholder="Selecione a cor secundária">
                      {secondaryColor && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)", background: secondaryColor }} />
                          {namedColors.find((c) => c.hex === secondaryColor)?.name || secondaryColor}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {namedColors.map((c) => (
                      <SelectItem key={c.hex} value={c.hex}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)", background: c.hex }} />
                          {c.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Funcionalidades Extras</label>
              <div className="chips-grid">
                {featureOptions.map((f) => {
                  const active = selectedFeatures.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFeature(f)}
                      className={cn("chip", active && "selected")}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      // ---------- ETAPA 5 — CONTATO ----------
      case 4:
        return (
          <div>
            <h2>Informações de contato</h2>
            <p className="subtitle">Onde os seus clientes podem encontrar você.</p>

            <div className="field-group">
              <label className="field-label"><MapPin /> Endereço</label>
              <input
                className="field-input"
                placeholder="Ex: Rua das Flores, 123 — Centro, São Paulo"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoFocus
              />
            </div>

            <div className="field-group">
              <label className="field-label"><Phone /> Telefone / WhatsApp</label>
              <input
                className="field-input"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                  let masked = digits;
                  if (digits.length > 6) masked = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
                  else if (digits.length > 2) masked = `(${digits.slice(0,2)}) ${digits.slice(2)}`;
                  else if (digits.length > 0) masked = `(${digits}`;
                  setPhone(masked);
                }}
              />
            </div>

            <div className="field-group">
              <label className="field-label"><Clock /> Horário de Funcionamento</label>
              <input
                className="field-input"
                placeholder="Seg–Sex 11h às 23h, Sáb e Dom 11h às 00h"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label"><MousePointerClick /> Botão Principal (CTA)</label>
              <div className="cta-grid">
                {simpleCtaOptions.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCtaPrincipal(c.value)}
                    className={cn("cta-option", ctaPrincipal === c.value && "selected")}
                  >
                    {ctaPrincipal === c.value && <Check style={{ width: 16, height: 16 }} />}
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // ---------- ETAPA 6 — REVISÃO ----------
      case 5:
        return (
          <div>
            <h2>Revisão final</h2>
            <p className="subtitle">Confira tudo antes de gerar o seu site com a IA.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <ReviewItem label="Nicho" value={nicheTemplates[niche]?.label || "—"} />
              <ReviewItem label="Nome" value={projectName || "—"} />
              <ReviewItem label="Slogan" value={slogan || "Não informado"} />

              <div className="review-row">
                <span className="label">Cores</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)", background: primaryColor }} />
                    {namedColors.find((c) => c.hex === primaryColor)?.name || "—"}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)", background: secondaryColor }} />
                    {namedColors.find((c) => c.hex === secondaryColor)?.name || "—"}
                  </span>
                </div>
              </div>

              <ReviewItem label="Funcionalidades" value={selectedFeatures.length > 0 ? selectedFeatures.join(", ") : "Nenhuma"} />
              <ReviewItem label="Endereço" value={address || "Não informado"} />
              <ReviewItem label="Telefone" value={phone || "Não informado"} />
              <ReviewItem label="Horário" value={businessHours || "Não informado"} />
              <ReviewItem label="CTA Principal" value={simpleCtaOptions.find((c) => c.value === ctaPrincipal)?.label || "Não definido"} />
            </div>

            <hr className="divider" />

            <button type="button" onClick={handleGenerate} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px 28px", fontSize: 16 }}>
              <Sparkles style={{ width: 18, height: 18 }} />
              Gerar Site com IA
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================
  // LAYOUT GERAL
  // ============================================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="quiz-shell max-w-3xl mx-auto"
    >
      {/* Header */}
      <div style={{ paddingTop: 12 }}>
        <h2 className="page-title">
          Criador de <span>Sites</span>
        </h2>
        <p className="page-subtitle">
          Encontre clientes reais e gere seu site profissional com IA em poucos passos
        </p>
      </div>

      {/* Step indicators */}
      <div className="progress-container">
        {stepMeta.map((s, i) => {
          const isActive = i === step;
          const isDone = i < step;
          return (
            <React.Fragment key={`step-${i}`}>
              <button
                type="button"
                onClick={() => { if (i <= step) setStep(i); }}
                className="step-wrap"
                disabled={i > step}
              >
                <div className={cn("step-circle", isDone && "completed", isActive && "active")}>
                  {isDone ? <Check style={{ width: 16, height: 16 }} /> : i + 1}
                </div>
                <span className="step-label">{s.label}</span>
              </button>
              {i < stepMeta.length - 1 && (
                <div className={cn("step-connector", i < step && "completed")} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step content */}
      <div className="quiz-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step < TOTAL_STEPS - 1 ? (
        <div className="quiz-footer">
          <button type="button" className="btn-ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> Voltar
          </button>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            {!canAdvance && validationMessage && (
              <span style={{ fontSize: 12, color: "#f87171" }}>{validationMessage}</span>
            )}
            <button
              type="button"
              onClick={() => setStep(Math.min(TOTAL_STEPS - 1, step + 1))}
              disabled={!canAdvance}
              className="btn-primary"
            >
              Avançar <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-footer">
          <button type="button" className="btn-ghost" onClick={() => setStep(TOTAL_STEPS - 2)}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> Voltar
          </button>
          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="btn-ghost"
            style={{ color: "#f87171" }}
          >
            <RotateCcw style={{ width: 16, height: 16 }} /> Reiniciar processo
          </button>
        </div>
      )}

      {/* Reset Confirm */}
      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent className="bg-[#0D0D12] border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Reiniciar processo?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Todas as respostas serão apagadas. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (user) localStorage.removeItem(`sites-quiz-state-${user.id}`);
                setStep(0);
                setNiche(""); setProjectName(""); setSlogan("");
                setPrimaryColor(""); setSecondaryColor("");
                setSelectedFeatures([]);
                setAddress(""); setPhone(""); setBusinessHours("");
                setCtaPrincipal(""); setGeneratedPrompt("");
                toast.success("Processo reiniciado!");
              }}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Sim, reiniciar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AIBuilderPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        prompt={generatedPrompt}
        siteName={projectName}
        niche={niche}
      />

      {/* Modal extensão */}
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
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] overflow-hidden">
                  <img src="/placeholder.svg" alt="Lovable" className="w-14 h-14 object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Lovable Infinito</h2>
                <p className="text-muted-foreground text-sm">
                  Para criar sites ilimitados e sem travas, você já instalou a nossa extensão e gerou seu token?
                </p>
              </div>

              <div className="space-y-3">
                <Button className="w-full h-12 font-bold gap-2" variant="neon" onClick={handleConfirmExtension}>
                  <Check className="w-5 h-5" /> Sim, já instalei e configurei
                </Button>
                <Button className="w-full h-12 font-bold gap-2" variant="outline" onClick={handleGoToExtension}>
                  <ExternalLink className="w-5 h-5" /> Não, quero instalar agora
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
  <div className="review-row">
    <span className="label">{label}</span>
    <span className="value truncate">{value}</span>
  </div>
);

export default SitesView;
