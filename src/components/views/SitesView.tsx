import { useState } from "react";
import { Copy, Check, Code2, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const presetPrompts = [
  {
    label: "🪒 Barbearia Premium",
    prompt: `Crie um site landing page para uma barbearia chamada "Royal Barber". Visual premium e sofisticado com fundo escuro (tons de cinza escuro/quase preto), acentos em dourado (gold gradient). Use a fonte Playfair Display para títulos e Raleway para corpo de texto. Seções: Hero fullscreen com imagem de barbearia premium e título "Estilo & Tradição" com gradiente dourado, botão "Agende seu Horário". Seção "Nossos Serviços" com 3 cards (Corte Masculino R$60, Barba R$45, Tratamento Capilar R$80 — cada um com imagem, descrição e preço). Seção "Sobre Nós" com texto sobre tradição e excelência, com estatísticas (15+ anos de experiência, 10.000+ clientes atendidos, 5 barbeiros especialistas, nota 4.9 de avaliação). Seção "Contato" com informações (endereço, telefone, horário de funcionamento e formulário). Footer simples. Animações suaves com framer-motion. Design responsivo.`,
  },
  {
    label: "🍕 Pizzaria Artesanal",
    prompt: `Crie um site landing page para uma pizzaria chamada "Forno & Massa". Visual quente e acolhedor com fundo escuro (tons de preto e cinza escuro), acentos em vermelho queimado e laranja. Use fontes display bold para títulos e uma fonte corpo clean. Seções: Hero com imagem de pizza artesanal saindo do forno, seção "Cardápio" com cards de pizzas (Margherita, Pepperoni, Quatro Queijos, Calabresa — com preço e descrição), seção "Sobre Nós" contando a história da pizzaria com estatísticas (anos de tradição, pizzas por mês, avaliações 5 estrelas), seção "Contato" com endereço, telefone, horário de funcionamento e formulário de pedido/reserva. Footer simples. Animações suaves com framer-motion. Design responsivo. Gere imagens para o hero e os cards de pizza. Estilo editorial italiano com toques modernos.`,
  },
  {
    label: "🍷 Restaurante Fine Dining",
    prompt: `Crie um site de restaurante fine dining com tema escuro (fundo #1a1410), acentos dourados, tipografia Cormorant Garamond + Raleway. Seções: hero fullscreen com imagem do restaurante, cardápio com pratos alternados (filé, pasta, sobremesa) com fotos e preços, sobre com foto do chef e estatísticas (anos, clientes, avaliação), contato com reservas/endereço/horário, navbar fixa com blur e botão de reserva, footer elegante. Divisores dourados em gradiente entre seções. Animações suaves com framer-motion. Design responsivo.`,
  },
  {
    label: "🍲 Restaurante de Bairro",
    prompt: `Crie um site de restaurante de bairro acolhedor chamado 'Cantinho da Vó'. Tons terrosos (terracotta, amarelo quente, creme), tipografia Merriweather + Open Sans. Hero com fachada do restaurante, badge 'desde 1998', botões de cardápio e WhatsApp. Cardápio com cards de feijoada/picanha/moqueca com fotos, estrelas, tags e preços. Seção sobre com foto do interior rústico, história da fundadora e ícones (tradição, família, caseiro, amor). Contato com telefone, WhatsApp, endereço e horário. Footer simples. Estilo casual, emojis, linguagem calorosa.`,
  },
  {
    label: "🦷 Clínica Odontológica",
    prompt: `Crie um site para clínica odontológica chamado 'Sorriso+'. Use azul claro como cor primária, verde-água como accent, fundo branco/cinza claro, tipografia Plus Jakarta Sans. Faça um hero split com texto à esquerda e foto do consultório à direita, com badges de biossegurança, CRO e horários flexíveis. Seção de serviços com cards contendo foto e ícone para clareamento dental, ortodontia invisível e implantes dentários, mais um grid de serviços extras (limpeza, odontopediatria, scanner 3D). Seção sobre a dentista com foto profissional, CRO, formação USP/UNICAMP, e estatísticas (pacientes, avaliação). Seção de depoimentos de pacientes com estrelas e iniciais. Seção de contato com botões de WhatsApp, telefone e Instagram, mais endereço e horário. Navbar fixa com logo 'S+' e botão de agendar. Footer com CRO. Design profissional, limpo e que transmita confiança.`,
  },
];

const SitesView = () => {
  const [projectName, setProjectName] = useState("");
  const [niche, setNiche] = useState("");
  const [features, setFeatures] = useState("");
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedPreset, setCopiedPreset] = useState<number | null>(null);

  const handleGenerate = () => {
    if (!projectName.trim() || !niche.trim()) return;

    const generated = `Create a complete, modern, and professional ${niche} website called "${projectName}" using React, TypeScript, and Tailwind CSS.

## Design Requirements:
- Dark mode by default with a sleek, premium aesthetic
- Neon accent colors (purple and cyan gradients)
- Smooth animations and micro-interactions
- Fully responsive (mobile, tablet, desktop)
- Professional typography with Inter font

## Pages & Features:
${features ? features.split(",").map((f) => `- ${f.trim()}`).join("\n") : "- Landing page with hero section\n- About section\n- Contact form\n- Pricing section"}

## Technical Requirements:
- Use shadcn/ui components
- Implement React Router for navigation
- Add form validation with react-hook-form
- Use Lucide React for all icons
- SEO optimized with proper meta tags
- Fast loading with lazy loading for images

## Additional Instructions:
- All user-facing text must be in Brazilian Portuguese (pt-BR)
- Include a sticky header with smooth scroll navigation
- Add hover effects and transitions to all interactive elements
- Use glass morphism effects for cards
- Include a professional footer with social links`;

    setPrompt(generated);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success("Prompt copiado! Cole no Lovable para criar seu site.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPreset = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPreset(index);
    toast.success("Prompt copiado! Cole no Lovable para criar seu site.");
    setTimeout(() => setCopiedPreset(null), 2000);
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
        <p className="text-muted-foreground text-sm mt-1">Gere prompts profissionais para criar sites no Lovable</p>
      </div>

      {/* Prompts Prontos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Prompts Prontos — Clique para Copiar
        </h3>
        <div className="grid gap-3">
          {presetPrompts.map((preset, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleCopyPreset(i, preset.prompt)}
              className="w-full text-left glass rounded-xl p-4 hover:neon-border transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{preset.label}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {copiedPreset === i ? (
                    <><Check className="w-3.5 h-3.5 text-green-400" /> Copiado!</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" /> Copiar</>
                  )}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{preset.prompt}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Gerador Personalizado */}
      <div className="space-y-4 border-t border-border/50 pt-8">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          Gerador Personalizado
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nome do Projeto</label>
            <Input placeholder="Ex: MeuNegócio" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="bg-secondary/50 border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nicho</label>
            <Input placeholder="Ex: Barbearia, Restaurante" value={niche} onChange={(e) => setNiche(e.target.value)} className="bg-secondary/50 border-border" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Funcionalidades</label>
            <Input placeholder="Ex: Agendamento, Cardápio, Blog" value={features} onChange={(e) => setFeatures(e.target.value)} className="bg-secondary/50 border-border" />
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button variant="neon" size="lg" onClick={handleGenerate} disabled={!projectName.trim() || !niche.trim()}>
            <Sparkles className="w-4 h-4" /> Gerar Prompt Profissional
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={prompt ? "filled" : "empty"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="terminal-bg p-5 min-h-[200px]"
          >
            {!prompt ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground space-y-3">
                <Code2 className="w-10 h-10 opacity-30" />
                <p className="text-sm font-sans">Preencha os campos e gere seu prompt</p>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-accent/90 text-sm leading-relaxed">{prompt}</pre>
            )}
          </motion.div>
        </AnimatePresence>

        {prompt && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="hero" size="lg" onClick={handleCopy} className="w-full">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copiado!" : "Copiar Prompt e Criar no Lovable"}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SitesView;
