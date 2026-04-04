import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
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
import { motion } from "framer-motion";

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
      `Crie um site landing page para uma pizzaria chamada "${name}". Visual quente e acolhedor com fundo escuro (tons de preto e cinza escuro), acentos em ${primary || "vermelho queimado"} e ${secondary || "laranja"}. Use fontes display bold para títulos e uma fonte corpo clean. Seções: Hero com imagem de pizza artesanal saindo do forno, seção "Cardápio" com cards de pizzas (Margherita, Pepperoni, Quatro Queijos, Calabresa — com preço e descrição), seção "Sobre Nós" contando a história da pizzaria com estatísticas (anos de tradição, pizzas por mês, avaliações 5 estrelas), seção "Contato" com endereço, telefone, horário de funcionamento e formulário de pedido/reserva. Footer simples. Animações suaves com framer-motion. Design responsivo. Gere imagens para o hero e os cards de pizza. Estilo editorial italiano com toques modernos.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
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
      `Crie um site de pet shop chamado "${name}" com estética vibrante, acolhedora e playful. Paleta de cores quentes baseada em ${primary || "coral (#E8734A)"} como cor primária e ${secondary || "âmbar dourado (#E8A644)"} como secundária, com acentos em rosa, azul, verde, amarelo e lavanda sobre fundo creme claro. Tipografia Fredoka (display/headings — arredondada e divertida) + Nunito (body — limpa e legível). Bordas bem arredondadas. Animações com Framer Motion: navbar entra de cima com spring, hero com patinhas flutuantes e blobs de cor pulsantes, texto com fade-in escalonado, cards de serviços com stagger children e hover elevado, cards de produtos com emojis animados e botão reveal no hover, depoimentos com entrada rotateY spring, CTA com scale-in e patinhas flutuantes, footer com ícones sociais animados. Estrutura: Navbar fixa com blur, logo com ícone de cachorro, carrinho com badge. Hero full-height com grid 2 colunas (texto + imagem com badges flutuantes). Seção Serviços com 6 cards (Banho & Tosa, Veterinário, Nutrição, Estética Pet, Hotel Pet, Delivery). Seção Produtos com 4 cards com emoji, tag destaque, estrelas, preço com desconto, botão de compra. Seção Depoimentos com 3 cards. CTA com gradiente e patinhas flutuantes. Footer escuro com 4 colunas. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  sobrancelhas: {
    label: "✨ Design de Sobrancelhas",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site one-page para um estúdio de design de sobrancelhas chamado "${name}". Visual elegante e feminino com tons de ${primary || "creme e dourado"} e ${secondary || "rosé"}. Use Playfair Display para títulos e Raleway para corpo de texto. Seções: Navbar fixa com logo, links (Serviços, Sobre, Contato) e botão "Agendar". Hero com imagem de fundo de um salão de beleza luxuoso, título "Design de Sobrancelhas", subtítulo e botão CTA. Serviços com 3 cards: Microblading (R$350), Design Personalizado (R$80) e Micropigmentação (R$450), cada um com imagem e descrição. Sobre com texto sobre 8+ anos de experiência, estatísticas (2.500+ clientes, 5.0 avaliação) e um depoimento de cliente com 5 estrelas. Contato com cards de WhatsApp, Instagram, Endereço e Horário. Footer elegante. Design responsivo com animações suaves.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  mecanica: {
    label: "🔧 Mecânica Automotiva",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site para uma mecânica automotiva chamada "${name}". Tema escuro industrial com acentos em ${primary || "âmbar/laranja"}, cor secundária ${secondary || "cinza escuro"}. Tipografia Oswald para títulos e Inter para corpo. Animações suaves de entrada com Framer Motion. Inclui: navbar fixa com menu mobile, hero fullscreen com imagem de oficina e overlay escuro, seção de 6 serviços (Motor & Câmbio, Troca de Óleo, Suspensão & Freios, Elétrica Automotiva, Ar Condicionado, Revisão Completa) com cards, seção animada Sobre Nós com estatísticas (15+ anos, 5000+ clientes, 100% comprometimento, 98% satisfação), formulário de contato com campos nome/telefone/serviço/mensagem, informações de endereço/telefone/horário, e rodapé. Scroll suave, efeitos hover nos cards, texto com gradiente dourado nos destaques. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  hamburgueria: {
    label: "🍔 Hamburgueria",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site one-page premium para uma hamburgueria chamada "${name}", com visual impactante, moderno e apetitoso, estilo editorial urbano com clima noturno. Paleta com fundo escuro, tons ${primary || "âmbar e laranja queimado"}, ${secondary || "cobre e neutros elegantes"}. Tipografia marcante: fonte display forte para títulos e fonte clean para textos. Seções: Header fixo com logo, navegação suave e botão "Peça Agora". Hero com título grande, subtítulo apetitoso, CTAs "Ver Cardápio" e "Fazer Pedido", prova social com nota 4.9. Cardápio com cards elegantes (Smash Burger Clássico, X-Bacon Duplo, Frango Crocante, Batata Rústica, Milkshake Artesanal, Combo Família) com nome, descrição, preço e microinterações hover. Seção Sobre com foco em qualidade e ingredientes. Estatísticas (pedidos/mês, avaliação, anos de tradição). CTA forte para pedido. Contato com endereço, horário, telefone e Instagram. Footer elegante. Animações: entrada suave ao rolar, microinterações em botões e cards, zoom sutil na imagem principal, indicador de scroll animado. Tom de texto curto, comercial, apetitoso e premium em português brasileiro. Design responsivo e semântico.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  acaiteria: {
    label: "🫐 Açaiteria",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma açaiteria chamada "${name}". Estética tropical e vibrante com paleta baseada em ${primary || "roxo profundo do açaí"}, ${secondary || "verde amazônico"} e dourado como acento. Tipografia Playfair Display para títulos e DM Sans para corpo. Seções: (1) Hero com imagem de açaí bowl em círculo flutuante, CTA e badge de avaliação; (2) Cardápio com 3 cards de produtos (Tradicional, Premium, Smoothie) com fotos, preços e tags; (3) Sobre nós com grade de estatísticas e ícones de diferenciais (natural, artesanal, premium); (4) Contato com cartões de endereço, local, telefone e Instagram. Footer elegante. Animações suaves com Framer Motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  lavarapido: {
    label: "🚗 Lava-Rápido",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um lava-rápido premium chamado "${name}". Tema escuro e sofisticado com acentos em ${primary || "azul neon e ciano"}, cor secundária ${secondary || "cinza escuro metálico"}. Tipografia moderna e bold para títulos e clean para corpo. Seções: Navbar fixa com logo, links (Início, Serviços, Planos, Contato) e botão "Agendar Agora". Hero fullscreen com imagem cinematográfica de carro sendo lavado com jatos de água, título "Seu carro merece brilhar como novo", subtítulo sobre lavagem profissional, CTAs "Agendar Lavagem" e "Ver Serviços", estatísticas (5.000+ carros lavados, 4.9 avaliação, 100% satisfação). Seção Serviços com 6 cards (Lavagem Completa, Polimento Espelhado, Cristalização, Higienização Interna, Enceramento Premium, Express Wash) com ícones e descrições. Seção Planos & Preços com 3 cards (Básico R$49, Premium R$129 — mais popular, VIP R$249) com lista de itens inclusos e botão CTA. Seção Contato com formulário (nome, telefone, e-mail, mensagem) e informações (telefone, endereço, horário). Footer com logo, copyright e redes sociais. Animações suaves com Framer Motion. Design responsivo e cinematográfico.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
};

const SitesView = () => {
  const [projectName, setProjectName] = useState("");
  const [niche, setNiche] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [features, setFeatures] = useState("");
  const [copied, setCopied] = useState(false);

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

    if (address.trim()) generated += ` Endereço do estabelecimento: ${address.trim()}.`;
    if (phone.trim()) generated += ` Telefone: ${phone.trim()}.`;

    navigator.clipboard.writeText(generated);
    setCopied(true);
    toast.success("Tudo pronto! Cole na plataforma para criar seu site.");
    setTimeout(() => {
      setCopied(false);
      window.open("https://lovable.dev/projects/create", "_blank");
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">Fábrica de Sites</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Preencha os dados do seu projeto e crie seu site profissional com IA em segundos
        </p>
      </div>

      {/* Gerador Personalizado */}
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
