import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, Palette } from "lucide-react";

interface ColorOption {
  name: string;
  hex: string;
}

// Paleta curada de cores comuns para sites
const COLOR_OPTIONS: ColorOption[] = [
  { name: "Dourado Premium", hex: "#D4AF37" },
  { name: "Dourado Suave", hex: "#E8C07A" },
  { name: "Cobre", hex: "#B87333" },
  { name: "Bronze", hex: "#CD7F32" },
  { name: "Âmbar", hex: "#F59E0B" },
  { name: "Laranja Queimado", hex: "#E85D3A" },
  { name: "Coral", hex: "#FF6B6B" },
  { name: "Vermelho Vibrante", hex: "#E31837" },
  { name: "Bordô", hex: "#7C1D1D" },
  { name: "Rosa Quartzo", hex: "#F472B6" },
  { name: "Rosa Suave", hex: "#FDA4AF" },
  { name: "Roxo Profundo", hex: "#6D28D9" },
  { name: "Roxo Vibrante", hex: "#8B5CF6" },
  { name: "Lavanda", hex: "#C4B5FD" },
  { name: "Azul Marinho", hex: "#0F1B3D" },
  { name: "Azul Escuro", hex: "#1E3A8A" },
  { name: "Azul Sereno", hex: "#0EA5E9" },
  { name: "Azul Elétrico", hex: "#2563EB" },
  { name: "Azul Neon", hex: "#00B7FF" },
  { name: "Ciano", hex: "#06B6D4" },
  { name: "Verde Água", hex: "#5EEAD4" },
  { name: "Verde Esmeralda", hex: "#10B981" },
  { name: "Verde Natural", hex: "#22C55E" },
  { name: "Verde Floresta", hex: "#166534" },
  { name: "Verde Sage", hex: "#87A878" },
  { name: "Amarelo Vivo", hex: "#FACC15" },
  { name: "Amarelo Quente", hex: "#F0C419" },
  { name: "Terracota", hex: "#C4654A" },
  { name: "Marrom Café", hex: "#6B3A2A" },
  { name: "Bege Creme", hex: "#F5F0E8" },
  { name: "Cinza Claro", hex: "#E5E7EB" },
  { name: "Cinza Escuro", hex: "#374151" },
  { name: "Carvão", hex: "#1F2937" },
  { name: "Preto Fosco", hex: "#0A0A0A" },
  { name: "Branco Puro", hex: "#FFFFFF" },
  { name: "Branco Off", hex: "#FAFAF7" },
];

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPalettePicker({ label, value, onChange }: Props) {
  const [showCustom, setShowCustom] = useState(false);

  const isPreset = COLOR_OPTIONS.some(
    (c) => `${c.name} (${c.hex})` === value || c.name === value
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setShowCustom(false);
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Limpar
          </button>
        )}
      </div>

      {value && (
        <div className="text-xs text-muted-foreground">
          Selecionada: <span className="text-foreground font-medium">{value}</span>
        </div>
      )}

      <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2">
        {COLOR_OPTIONS.map((color) => {
          const fullValue = `${color.name} (${color.hex})`;
          const selected = value === fullValue;
          return (
            <button
              key={color.hex}
              type="button"
              title={color.name}
              onClick={() => {
                onChange(fullValue);
                setShowCustom(false);
              }}
              className={cn(
                "relative aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-lg",
                selected
                  ? "border-primary ring-2 ring-primary/40 scale-110"
                  : "border-border/40 hover:border-primary/50"
              )}
              style={{ backgroundColor: color.hex }}
            >
              {selected && (
                <Check
                  className={cn(
                    "absolute inset-0 m-auto w-4 h-4",
                    ["#FFFFFF", "#FAFAF7", "#F5F0E8", "#E5E7EB", "#FDA4AF", "#C4B5FD", "#5EEAD4", "#FACC15", "#F0C419", "#E8C07A"].includes(color.hex)
                      ? "text-black"
                      : "text-white"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowCustom((v) => !v)}
        className="text-xs text-primary hover:underline font-medium"
      >
        {showCustom ? "Fechar campo personalizado" : "+ Usar uma cor personalizada"}
      </button>

      {(showCustom || (!isPreset && value)) && (
        <Input
          placeholder="Ex: dourado rose, verde menta, #FF6B00"
          value={isPreset ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-secondary/50 border-border"
        />
      )}
    </div>
  );
}
