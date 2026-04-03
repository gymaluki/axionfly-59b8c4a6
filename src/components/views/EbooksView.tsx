import { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockEbook = `# Como Emagrecer de Forma Saudável

## Introdução
Neste e-book, você vai aprender as melhores estratégias baseadas em ciência para perder peso de forma sustentável e saudável.

---

## Capítulo 1 — Entendendo o Metabolismo
O metabolismo é o conjunto de processos químicos que mantêm o corpo vivo. Entender como ele funciona é o primeiro passo...

## Capítulo 2 — Alimentação Inteligente
Não se trata de dietas restritivas, mas sim de escolhas inteligentes no dia a dia...

## Capítulo 3 — O Papel do Exercício Físico
Exercícios não servem apenas para queimar calorias. Eles regulam hormônios, melhoram o humor...

## Capítulo 4 — Mindset e Consistência
A mentalidade é o fator mais importante. Sem consistência, nenhuma estratégia funciona...

## Capítulo 5 — Plano de Ação de 30 Dias
Aqui está seu plano prático para os próximos 30 dias, com metas semanais claras...

---

*E-book gerado com IA — ScaleAI*`;

const EbooksView = () => {
  const [topic, setTopic] = useState("");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setGenerated(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Gerador de E-books</h2>
        <p className="text-muted-foreground text-sm mt-1">Crie e-books completos com IA em segundos</p>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Ex: Emagrecimento, Finanças, Marketing Digital..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="bg-secondary/50 border-border h-11 flex-1"
        />
        <Button variant="neon" size="lg" onClick={handleGenerate} disabled={loading || !topic.trim()}>
          {loading ? <Loader2 className="animate-spin" /> : <BookOpen className="w-4 h-4" />}
          Gerar E-book
        </Button>
      </div>

      {/* Output */}
      <div className="glass rounded-xl p-6 min-h-[400px]">
        {!generated ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground space-y-3">
            <BookOpen className="w-10 h-10 opacity-30" />
            <p className="text-sm">Digite um tema e clique em &quot;Gerar E-book&quot;</p>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            {mockEbook.split("\n").map((line, i) => {
              if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold text-foreground mb-4">{line.replace("# ", "")}</h1>;
              if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold text-foreground mt-6 mb-2">{line.replace("## ", "")}</h2>;
              if (line === "---") return <hr key={i} className="border-border my-4" />;
              if (line.startsWith("*")) return <p key={i} className="text-muted-foreground italic text-xs mt-6">{line.replace(/\*/g, "")}</p>;
              if (line.trim() === "") return <div key={i} className="h-2" />;
              return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EbooksView;
