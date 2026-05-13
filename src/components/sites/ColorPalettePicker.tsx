import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, Palette, Check } from "lucide-react";

interface ColorOption {
  name: string;
  hex: string;
}

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

const LIGHT_HEXES = new Set([
  "#FFFFFF", "#FAFAF7", "#F5F0E8", "#E5E7EB", "#FDA4AF",
  "#C4B5FD", "#5EEAD4", "#FACC15", "#F0C419", "#E8C07A",
]);

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function parseValue(value: string): { color: ColorOption | null; custom: string } {
  if (!value) return { color: null, custom: "" };
  const match = COLOR_OPTIONS.find(
    (c) => `${c.name} (${c.hex})` === value || c.name === value
  );
  if (match) return { color: match, custom: "" };
  return { color: null, custom: value };
}

export function ColorPalettePicker({ label, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const { color, custom } = parseValue(value);
  const hasValue = !!value;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Palette className="w-4 h-4 text-primary" />
        {label}
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border transition-all",
              "bg-secondary/50 border-border hover:border-primary/50 hover:bg-secondary",
              open && "border-primary/60 ring-1 ring-primary/30"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              {color ? (
                <span
                  className="w-5 h-5 rounded-md border border-border/40 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
              ) : (
                <span className="w-5 h-5 rounded-md border border-dashed border-border shrink-0 bg-gradient-to-br from-primary/20 to-secondary" />
              )}
              <span
                className={cn(
                  "text-sm truncate",
                  hasValue ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {hasValue ? (color ? color.name : custom) : "Selecionar cor"}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform shrink-0",
                open && "rotate-180"
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-[280px] p-3 bg-card border-border"
        >
          <div className="grid grid-cols-9 gap-1.5">
            {COLOR_OPTIONS.map((c) => {
              const selected = color?.hex === c.hex;
              return (
                <button
                  key={c.hex}
                  type="button"
                  title={c.name}
                  onClick={() => {
                    onChange(`${c.name} (${c.hex})`);
                    setShowCustom(false);
                    setOpen(false);
                  }}
                  className={cn(
                    "relative w-6 h-6 rounded-md border transition-all hover:scale-125 hover:z-10",
                    selected
                      ? "border-primary ring-2 ring-primary/50 scale-110"
                      : "border-border/30"
                  )}
                  style={{ backgroundColor: c.hex }}
                >
                  {selected && (
                    <Check
                      className={cn(
                        "absolute inset-0 m-auto w-3 h-3",
                        LIGHT_HEXES.has(c.hex) ? "text-black" : "text-white"
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-border/60 space-y-2">
            <button
              type="button"
              onClick={() => setShowCustom((v) => !v)}
              className="text-xs text-primary hover:underline font-medium"
            >
              {showCustom ? "Ocultar campo personalizado" : "+ Cor personalizada"}
            </button>

            {(showCustom || (!color && custom)) && (
              <Input
                placeholder="Ex: verde menta, #FF6B00"
                value={custom}
                onChange={(e) => onChange(e.target.value)}
                className="bg-secondary/50 border-border h-8 text-xs"
              />
            )}

            {hasValue && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setShowCustom(false);
                  setOpen(false);
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Limpar seleção
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
