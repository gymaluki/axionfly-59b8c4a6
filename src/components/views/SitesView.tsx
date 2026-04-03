import { useState } from "react";
import { Copy, Check, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SitesView = () => {
  const [projectName, setProjectName] = useState("");
  const [niche, setNiche] = useState("");
  const [features, setFeatures] = useState("");
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Fábrica de Sites</h2>
        <p className="text-muted-foreground text-sm mt-1">Gere prompts profissionais para criar sites no Lovable</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nome do Projeto</label>
          <Input
            placeholder="Ex: MeuNegócio"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-secondary/50 border-border"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nicho</label>
          <Input
            placeholder="Ex: Barbearia, Restaurante"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="bg-secondary/50 border-border"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Funcionalidades</label>
          <Input
            placeholder="Ex: Agendamento, Cardápio, Blog"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className="bg-secondary/50 border-border"
          />
        </div>
      </div>

      <Button variant="neon" size="lg" onClick={handleGenerate} disabled={!projectName.trim() || !niche.trim()}>
        <Sparkles className="w-4 h-4" />
        Gerar Prompt Profissional
      </Button>

      {/* Terminal Output */}
      <div className="terminal-bg p-5 min-h-[300px]">
        {!prompt ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground space-y-3">
            <Code2 className="w-10 h-10 opacity-30" />
            <p className="text-sm font-sans">Preencha os campos e gere seu prompt</p>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-accent/90 text-sm leading-relaxed">{prompt}</pre>
        )}
      </div>

      {prompt && (
        <Button variant="hero" size="lg" onClick={handleCopy} className="w-full">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copiado!" : "Copiar Prompt e Criar no Lovable"}
        </Button>
      )}
    </div>
  );
};

export default SitesView;
