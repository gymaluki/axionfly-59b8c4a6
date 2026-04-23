import { useState } from "react";
import { AIBuilderPicker } from "@/components/AIBuilderPicker";
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone, Maximize2 } from "lucide-react";

interface Scenario {
  label: string;
  width: number;
  height: number;
  icon: typeof Monitor;
  note: string;
}

const scenarios: Scenario[] = [
  { label: "Mobile S", width: 320, height: 640, icon: Smartphone, note: "iPhone SE 1ª geração — menor largura suportada" },
  { label: "Mobile M", width: 375, height: 720, icon: Smartphone, note: "iPhone padrão" },
  { label: "Mobile L", width: 414, height: 780, icon: Smartphone, note: "iPhone Plus / Android grande" },
  { label: "Tablet", width: 768, height: 900, icon: Tablet, note: "iPad retrato — breakpoint sm" },
  { label: "Tablet L", width: 1024, height: 800, icon: Tablet, note: "iPad paisagem — breakpoint lg" },
  { label: "Laptop", width: 1280, height: 800, icon: Monitor, note: "Notebook padrão" },
  { label: "Desktop", width: 1536, height: 900, icon: Monitor, note: "Desktop full HD" },
  { label: "Wide", width: 1920, height: 1000, icon: Maximize2, note: "Monitor amplo — testa max-w-5xl" },
];

const samplePrompt =
  "Crie um site institucional moderno para uma empresa de tecnologia chamada AxionFly, com hero, lista de features, depoimentos e formulário de contato.";

const QAGrid = () => {
  const [activeWidth, setActiveWidth] = useState<number | null>(null);
  const [livePickerOpen, setLivePickerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-xs font-medium text-primary">QA / Layout</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">QA do Grid — AIBuilderPicker</h1>
          <p className="text-muted-foreground max-w-2xl">
            Cada cartão renderiza o modal de seleção em uma largura de viewport real (via iframe).
            Procure por: cortes de texto, overflow horizontal, badge "MAIS ESCOLHIDO" sobreposto, scroll quebrado,
            logos cortados ou cards com altura desigual.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setLivePickerOpen(true)}>Abrir picker no viewport real</Button>
            <Button variant="outline" onClick={() => setActiveWidth(null)}>
              Mostrar todos
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {scenarios.map((s) => {
            const Icon = s.icon;
            const active = activeWidth === s.width;
            return (
              <button
                key={s.label}
                onClick={() => setActiveWidth(active ? null : s.width)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{s.label}</span>
                <span className="text-xs text-muted-foreground ml-auto">{s.width}px</span>
              </button>
            );
          })}
        </section>

        <section className="grid gap-8">
          {scenarios
            .filter((s) => activeWidth === null || s.width === activeWidth)
            .map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="space-y-3">
                  <div className="flex items-end justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-semibold">
                        {s.label}{" "}
                        <span className="text-muted-foreground font-normal">
                          ({s.width} × {s.height})
                        </span>
                      </h2>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.note}</p>
                  </div>
                  <div className="w-full overflow-x-auto rounded-2xl border border-border bg-secondary/30 p-3">
                    <div
                      className="mx-auto rounded-xl overflow-hidden border border-border bg-background shadow-lg"
                      style={{ width: s.width }}
                    >
                      <iframe
                        title={`QA-${s.label}`}
                        src="/qa-grid/frame"
                        width={s.width}
                        height={s.height}
                        className="block"
                        style={{ border: 0 }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </section>

        <footer className="pt-6 border-t border-border text-xs text-muted-foreground">
          Checklist: (1) Sem scroll horizontal; (2) Badge "MAIS ESCOLHIDO" visível e não cortada;
          (3) Logos centralizados nos quadrados; (4) Texto "freeInfo" sem corte estranho;
          (5) Modal scrollável quando altura é pequena; (6) Botão fechar acessível.
        </footer>
      </div>

      <AIBuilderPicker
        open={livePickerOpen}
        onClose={() => setLivePickerOpen(false)}
        prompt={samplePrompt}
      />
    </div>
  );
};

export default QAGrid;
