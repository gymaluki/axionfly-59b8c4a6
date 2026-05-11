import { useState, useCallback, useMemo, useEffect } from "react";
import { 
  Check, 
  Sparkles, 
  ExternalLink, 
  RotateCcw, 
  Store, 
  Palette, 
  Type, 
  MessageSquare,
  Globe,
  Zap
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
import { cn } from "@/lib/utils";

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
  hamburgueria: {
    label: "🍔 Hamburgueria",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site one-page premium para uma hamburgueria chamada "${name}", com visual impactante, moderno e apetitoso, estilo editorial urbano com clima noturno. Paleta com fundo escuro, tons ${primary || "âmbar e laranja queimado"}, ${secondary || "cobre e neutros elegantes"}. Tipografia marcante. Seções: Header fixo, Hero com título grande e CTAs, Cardápio com 6 cards elegantes, Seção Sobre, Estatísticas, CTA forte, Contato e Footer. Animações suaves. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  salaobeleza: {
    label: "💇 Salão de Beleza",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um salão de beleza chamado "${name}". Visual elegante e feminino com tons de ${primary || "rosa e dourado"}, cor secundária ${secondary || "nude e creme"}. Seções: Navbar fixa, Hero, Seção Serviços com cards, Seção Sobre, Depoimentos, Contato e Footer elegante. Animações suaves com framer-motion. Design responsivo.${features ? ` Funcionalidades extras: ${features}.` : ""}`,
  },
  clinica: {
    label: "🦷 Clínica Odontológica",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site para clínica odontológica chamado '${name}'. Use ${primary || "azul claro"} como cor primária, ${secondary || "verde-água"} como accent, fundo branco/cinza claro, tipografia Plus Jakarta Sans. Faça um hero split com texto à esquerda e foto do consultório à direita, com badges de biossegurança, CRO e horários flexíveis. Seção de serviços with cards.`,
  },
  petshop: {
    label: "🐾 Pet Shop",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site de pet shop chamado "${name}" com estética vibrante, acolhedora e playful. Paleta de cores quentes baseada em ${primary || "coral (#E8734A)"} como cor primária e ${secondary || "âmbar dourado (#E8A644)"} como secundária.`,
  },
  sobrancelhas: {
    label: "✨ Design de Sobrancelhas",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site one-page para um estúdio de design de sobrancelhas chamado "${name}". Visual elegante e feminino com tons de ${primary || "creme e dourado"} e ${secondary || "rosé"}.`,
  },
  mecanica: {
    label: "🔧 Mecânica Automotiva",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site para uma mecânica automotiva chamada "${name}". Tema escuro industrial com acentos em ${primary || "âmbar/laranja"}, cor secundária ${secondary || "cinza escuro"}.`,
  },
  acaiteria: {
    label: "🫐 Açaiteria",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma açaiteria chamada "${name}". Estética tropical e vibrante com paleta baseada em ${primary || "roxo profundo do açaí"}.`,
  },
  advogado: {
    label: "⚖️ Escritório de Advocacia",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um escritório de advocacia chamado "${name}". Visual sóbrio e profissional com fundo escuro.`,
  },
  contabilidade: {
    label: "📊 Contabilidade",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para um escritório de contabilidade chamado "${name}". Visual profissional e confiável com fundo escuro.`,
  },
  "marketing-digital": {
    label: "📈 Marketing Digital",
    buildPrompt: (name, primary, secondary, features) =>
      `Crie um site landing page para uma agência de marketing digital chamada "${name}". Visual moderno e profissional.`,
  },
};

const fontPairs = [
  { label: "Premium (Playfair + Raleway)", value: "playfair-raleway" },
  { label: "Moderno (Montserrat + Open Sans)", value: "montserrat-open-sans" },
  { label: "Minimalista (Inter + Inter)", value: "inter-inter" },
  { label: "Elegante (Cormorant + Montserrat)", value: "cormorant-montserrat" },
  { label: "Arrojado (Oswald + Roboto)", value: "oswald-roboto" },
  { label: "Suave (Quicksand + Nunito)", value: "quicksand-nunito" },
  { label: "Profissional (Jakarta + Inter)", value: "jakarta-inter" },
];

const designStyles = [
  { label: "Minimalista & Clean", value: "minimalist" },
  { label: "Escuro & Premium", value: "dark-premium" },
  { label: "Vibrante & Moderno", value: "vibrant" },
  { label: "Glassmorphism (Efeito Vidro)", value: "glassmorphism" },
  { label: "Bento Grid Layout", value: "bento" },
  { label: "High-End Editorial", value: "editorial" },
];

interface AIBuildersGridProps {
  onSelect: (prompt: string) => void;
}

export const AIBuildersGrid = ({ onSelect }: AIBuildersGridProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    niche: "",
    name: "",
    primaryColor: "#3B82F6",
    secondaryColor: "#1e293b",
    fonts: "playfair-raleway",
    style: "dark-premium",
    features: ""
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleGenerate = () => {
    const template = nicheTemplates[formData.niche];
    if (!template) return;

    let prompt = template.buildPrompt(
      formData.name,
      formData.primaryColor,
      formData.secondaryColor,
      formData.features
    );

    // Append font and style info
    const fontInfo = fontPairs.find(f => f.value === formData.fonts)?.label;
    const styleInfo = designStyles.find(s => s.value === formData.style)?.label;
    
    prompt += ` Use o estilo visual "${styleInfo}" e a combinação de fontes "${fontInfo}".`;

    onSelect(prompt);
  };

  const isStep1Valid = formData.niche !== "";
  const isStep2Valid = formData.name.trim().length >= 3;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 w-8 rounded-full transition-all duration-300",
                step >= s ? "bg-primary" : "bg-white/10"
              )}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Etapa {step} de 4
        </span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Escolha o nicho do negócio</h3>
              <p className="text-muted-foreground">Selecione o segmento do comércio para que a IA crie a estrutura ideal.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(nicheTemplates).map(([id, t]) => (
                <button
                  key={id}
                  onClick={() => {
                    setFormData({ ...formData, niche: id });
                    handleNext();
                  }}
                  className={cn(
                    "p-4 rounded-2xl border transition-all text-left group relative overflow-hidden",
                    formData.niche === id 
                      ? "bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                      : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/10"
                  )}
                >
                  <span className="text-sm font-bold block relative z-10">{t.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Nome do Comércio</h3>
              <p className="text-muted-foreground">Como se chama o negócio? Este nome aparecerá em todo o site.</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Barbearia do João"
                  className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-primary/50"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={handleBack} className="flex-1 h-12 rounded-xl text-white hover:bg-white/10">
                  Voltar
                </Button>
                <Button 
                  disabled={!isStep2Valid} 
                  onClick={handleNext} 
                  className="flex-1 h-12 rounded-xl bg-primary text-white font-bold"
                >
                  Próximo
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Identidade Visual</h3>
              <p className="text-muted-foreground">Personalize as cores e a tipografia para combinar com a marca.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5" /> Cor Primária
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-14 h-14 p-1 bg-white/5 border-white/10 rounded-xl cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="h-14 bg-white/5 border-white/10 text-white rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5" /> Cor Secundária
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-14 h-14 p-1 bg-white/5 border-white/10 rounded-xl cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="h-14 bg-white/5 border-white/10 text-white rounded-xl"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Type className="w-3.5 h-3.5" /> Estilo de Fontes
                  </label>
                  <Select
                    value={formData.fonts}
                    onValueChange={(v) => setFormData({ ...formData, fonts: v })}
                  >
                    <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-xl">
                      <SelectValue placeholder="Selecione as fontes" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d0d14] border-white/10 text-white">
                      {fontPairs.map(f => (
                        <SelectItem key={f.value} value={f.value} className="hover:bg-white/5 focus:bg-white/5">
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> Estilo de Design
                  </label>
                  <Select
                    value={formData.style}
                    onValueChange={(v) => setFormData({ ...formData, style: v })}
                  >
                    <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-xl">
                      <SelectValue placeholder="Selecione o estilo" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d0d14] border-white/10 text-white">
                      {designStyles.map(s => (
                        <SelectItem key={s.value} value={s.value} className="hover:bg-white/5 focus:bg-white/5">
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" onClick={handleBack} className="flex-1 h-12 rounded-xl text-white hover:bg-white/10">
                Voltar
              </Button>
              <Button onClick={handleNext} className="flex-1 h-12 rounded-xl bg-primary text-white font-bold">
                Próximo
              </Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Recursos Adicionais</h3>
              <p className="text-muted-foreground">Opcional: Descreva alguma funcionalidade específica (Ex: sistema de reservas, chat, etc).</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Ex: Gostaria de um botão de agendamento via WhatsApp bem visível e uma galeria de fotos do salão..."
                  className="w-full min-h-[120px] pl-12 pt-4 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-primary/50 resize-none outline-none"
                />
              </div>
              
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Pronto para gerar</span>
                </div>
                <p className="text-[11px] text-[#94a3b8] font-medium leading-relaxed">
                  Ao clicar no botão abaixo, nossa IA irá processar suas escolhas e montar a estrutura completa do site.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="ghost" onClick={handleBack} className="flex-1 h-12 rounded-xl text-white hover:bg-white/10">
                  Voltar
                </Button>
                <Button 
                  onClick={handleGenerate} 
                  className="flex-2 h-12 rounded-xl bg-primary text-white font-bold px-8 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                >
                  Criar meu Site com IA
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIBuildersGrid;
