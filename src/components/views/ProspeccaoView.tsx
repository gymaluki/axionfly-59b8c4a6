import { useState, useEffect, useRef } from "react";
import { Search, MessageCircle, MapPin, Loader2, Phone, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Categoria = "alimentacao" | "beleza" | "saude" | "servicos";

const categoriaStyles: Record<Categoria, { label: string; bg: string; text: string; ring: string }> = {
  alimentacao: { label: "🍽️ Alimentação", bg: "bg-emerald-500/15", text: "text-emerald-300", ring: "ring-emerald-500/20" },
  beleza:      { label: "💆 Beleza",      bg: "bg-pink-500/15",    text: "text-pink-300",    ring: "ring-pink-500/20" },
  saude:       { label: "🏥 Saúde",       bg: "bg-sky-500/15",     text: "text-sky-300",     ring: "ring-sky-500/20" },
  servicos:    { label: "⚙️ Serviços",    bg: "bg-orange-500/15",  text: "text-orange-300",  ring: "ring-orange-500/20" },
};

const nichos: { label: string; emoji: string; leads: string; cat: Categoria }[] = [
  { label: "Barbearias",          emoji: "✂️",  leads: "2.4k", cat: "beleza" },
  { label: "Pizzarias",           emoji: "🍕",  leads: "1.8k", cat: "alimentacao" },
  { label: "Hamburguerias",       emoji: "🍔",  leads: "1.2k", cat: "alimentacao" },
  { label: "Manicures",           emoji: "💅",  leads: "3.1k", cat: "beleza" },
  { label: "Dentistas",           emoji: "🦷",  leads: "4.5k", cat: "saude" },
  { label: "Clínicas",            emoji: "🏥",  leads: "2.7k", cat: "saude" },
  { label: "Academias",           emoji: "🏋️",  leads: "1.9k", cat: "saude" },
  { label: "Pet Shops",           emoji: "🐾",  leads: "1.4k", cat: "servicos" },
  { label: "Restaurantes",        emoji: "🍽️", leads: "5.2k", cat: "alimentacao" },
  { label: "Mecânicas",           emoji: "🔧",  leads: "2.1k", cat: "servicos" },
  { label: "Salões de Beleza",    emoji: "💇",  leads: "3.8k", cat: "beleza" },
  { label: "Estética",            emoji: "✨",  leads: "2.9k", cat: "beleza" },
  { label: "Imobiliárias",        emoji: "🏠",  leads: "1.6k", cat: "servicos" },
  { label: "Advogados",           emoji: "⚖️",  leads: "3.3k", cat: "servicos" },
  { label: "Contadores",          emoji: "📊",  leads: "1.1k", cat: "servicos" },
  { label: "Escolas de Idiomas",  emoji: "🗣️",  leads: "0.9k", cat: "servicos" },
  { label: "Padarias",            emoji: "🍞",  leads: "2.6k", cat: "alimentacao" },
  { label: "Farmácias",           emoji: "💊",  leads: "2.0k", cat: "saude" },
  { label: "Óticas",              emoji: "👓",  leads: "0.8k", cat: "saude" },
  { label: "Floricultura",        emoji: "🌸",  leads: "0.6k", cat: "servicos" },
  { label: "Lava Jato",           emoji: "🚗",  leads: "1.3k", cat: "servicos" },
  { label: "Fotógrafos",          emoji: "📸",  leads: "1.0k", cat: "servicos" },
];

const estados = [
  { sigla: "AC", nome: "Acre" }, { sigla: "AL", nome: "Alagoas" }, { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" }, { sigla: "BA", nome: "Bahia" }, { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" }, { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" }, { sigla: "MA", nome: "Maranhão" }, { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" }, { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" }, { sigla: "PB", nome: "Paraíba" }, { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" }, { sigla: "PI", nome: "Piauí" }, { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" }, { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" }, { sigla: "RR", nome: "Roraima" }, { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" }, { sigla: "SE", nome: "Sergipe" }, { sigla: "TO", nome: "Tocantins" },
];

interface SearchResult {
  url: string;
  title: string;
  description: string;
  phone: string | null;
}

const extractPhone = (text: string): string | null => {
  const patterns = [
    /\(?\d{2}\)?\s*9?\d{4}[-.\s]?\d{4}/,
    /\+55\s*\(?\d{2}\)?\s*9?\d{4}[-.\s]?\d{4}/,
  ];
  for (const p of patterns) {
    const match = text.match(p);
    if (match) return match[0].trim();
  }
  return null;
};

const openExternalLink = (url: string) => {
  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (w) w.opener = null;
};

// ━━━━━ Typewriter ━━━━━
const Typewriter = ({ text, speed = 38 }: { text: string; speed?: number }) => {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span>
      {shown}
      <span className="inline-block w-[3px] h-[0.9em] bg-white/80 ml-1 animate-pulse align-middle" />
    </span>
  );
};

// ━━━━━ Counter ━━━━━
const Counter = ({ to, suffix = "", duration = 1400 }: { to: number; suffix?: string; duration?: number }) => {
  const [n, setN] = useState(0);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    let raf = 0;
    const step = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min((t - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{n.toLocaleString("pt-BR")}{suffix}</>;
};

const ProspeccaoView = () => {
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cidades, setCidades] = useState<string[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [activeFilter, setActiveFilter] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [key, setKey] = useState(0);

  // Load saved state
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const saved = localStorage.getItem(`prospeccao-view-state-${user.id}`);
      if (!saved) return;
      try {
        const s = JSON.parse(saved);
        setCidade(s.cidade || "");
        setEstado(s.estado || "");
        setActiveFilter(s.activeFilter || "");
        setResults(s.results || []);
        setSearched(s.searched || false);
      } catch {}
    };
    load();
  }, []);

  // Save state
  useEffect(() => {
    const save = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      localStorage.setItem(
        `prospeccao-view-state-${user.id}`,
        JSON.stringify({ cidade, estado, activeFilter, results, searched })
      );
    };
    save();
  }, [cidade, estado, activeFilter, results, searched]);

  // Cities
  useEffect(() => {
    if (!estado || estado === "todos") { setCidades([]); return; }
    const fetchCidades = async () => {
      setLoadingCidades(true);
      try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?orderBy=nome`);
        const data = await res.json();
        setCidades(data.map((m: any) => m.nome));
      } catch { setCidades([]); }
      finally { setLoadingCidades(false); }
    };
    fetchCidades();
  }, [estado]);

  const buildLocation = () => {
    const parts: string[] = [];
    if (cidade && cidade !== "todas") parts.push(cidade);
    if (estado && estado !== "todos") {
      const est = estados.find(e => e.sigla === estado);
      if (est) parts.push(est.nome);
    }
    parts.push("Brasil");
    return parts.join(", ");
  };

  const doSearch = async (nicho: string) => {
    if (!nicho.trim()) return;
    const location = buildLocation();
    const query = `${nicho} em ${location}`.trim();
    setLoading(true);
    setSearched(true);
    setResults([]);
    try {
      const response = await firecrawlApi.search(query, { limit: 15, lang: "pt-br", country: "br" });
      if (response.success && Array.isArray(response.data)) {
        const mapped: SearchResult[] = (response.data as any[]).map((item: any) => {
          const allText = `${item.description || ""} ${item.markdown || ""}`;
          return {
            url: item.url || "",
            title: item.title || "Sem título",
            description: item.description || "",
            phone: extractPhone(allText),
          };
        });
        setResults(mapped);
        setKey(k => k + 1);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("search_history").insert({
            user_id: user.id, query, nicho, location, results_count: mapped.length,
          });
        }
      } else {
        toast.error(response.error || "Nenhum resultado encontrado");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao buscar leads. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!activeFilter) { toast.error("Selecione um nicho antes de buscar"); return; }
    doSearch(activeFilter);
  };

  const extractDomain = (url: string) => {
    try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
  };

  return (
    <div className="space-y-8">
      {/* ━━━━━━━━ 1. HERO BANNER ━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl border border-white/10 p-6 md:p-10"
        style={{
          background:
            "linear-gradient(135deg, #4f6ef7 0%, #5d4fe8 45%, #7c3aed 100%)",
        }}
      >
        {/* Noise overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
        {/* Dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* Floating particles */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/60"
              initial={{
                x: `${(i * 83) % 100}%`,
                y: `${(i * 47) % 100}%`,
                opacity: 0.2,
              }}
              animate={{
                y: [`${(i * 47) % 100}%`, `${((i * 47) % 100) - 30}%`, `${(i * 47) % 100}%`],
                opacity: [0.2, 0.7, 0.2],
              }}
              transition={{
                duration: 6 + (i % 5),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-[#7c3aed]/40 blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-5xl font-black tracking-tight text-white leading-[1.05]"
              >
                <Typewriter text="Encontre seus próximos clientes 🎯" />
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className="text-white/85 text-sm md:text-base mt-3 font-medium"
              >
                Mais de 50.000 empresas reais prontas pra prospectar
              </motion.p>
            </div>

            {(searched || results.length > 0 || activeFilter || cidade || estado) && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (!confirm("Limpar a pesquisa salva e reiniciar?")) return;
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) localStorage.removeItem(`prospeccao-view-state-${user.id}`);
                  setCidade(""); setEstado(""); setActiveFilter("");
                  setResults([]); setSearched(false);
                  toast.success("Pesquisa reiniciada!");
                }}
                className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-full font-bold backdrop-blur-md"
              >
                <RotateCcw className="w-4 h-4" />
                Reiniciar
              </Button>
            )}
          </div>

          {/* Badges com counters */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mt-7 max-w-2xl">
            {[
              { icon: "🏢", to: 50000, suffix: "+", label: "Empresas" },
              { icon: "🎯", to: 20,    suffix: "",  label: "Nichos" },
              { icon: "🇧🇷", to: 27,   suffix: "",  label: "Estados" },
            ].map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 1.8 + i * 0.12, ease: "easeOut" }}
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-3 md:px-4 py-3 flex items-center gap-2 md:gap-3"
              >
                <span className="text-xl md:text-2xl">{b.icon}</span>
                <div className="min-w-0">
                  <div className="text-white font-black text-base md:text-xl leading-none">
                    <Counter to={b.to} suffix={b.suffix} />
                    {b.to >= 1000 ? "" : ""}
                    {b.to === 50000 ? "" : ""}
                  </div>
                  <div className="text-white/70 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1">
                    {b.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ━━━━━━━━ 2. FILTROS DE LOCALIZAÇÃO ━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-6 md:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Estado */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#cbd5e1] flex items-center gap-2">
              <span>📍</span> Estado
            </label>
            <Select value={estado} onValueChange={(v) => { setEstado(v); setCidade(""); }}>
              <SelectTrigger className="h-12 bg-[#111827] border-white/10 hover:border-[#4f6ef7]/50 focus:border-[#4f6ef7] focus:ring-4 focus:ring-[#4f6ef7]/20 rounded-xl transition-all duration-300">
                <SelectValue placeholder="Todos os estados" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d0d14] border-white/10 text-white max-h-72">
                <SelectItem value="todos">Todos os estados</SelectItem>
                {estados.map(e => (
                  <SelectItem key={e.sigla} value={e.sigla}>{e.sigla} — {e.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cidade — slide-down */}
          <AnimatePresence mode="wait">
            {estado && estado !== "todos" ? (
              <motion.div
                key="cidade-field"
                initial={{ opacity: 0, y: -12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -12, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-2"
              >
                <label className="text-xs font-bold text-[#cbd5e1] flex items-center gap-2">
                  <span>🏙️</span> Cidade
                </label>
                <Select value={cidade} onValueChange={setCidade} disabled={loadingCidades}>
                  <SelectTrigger className="h-12 bg-[#111827] border-white/10 hover:border-[#4f6ef7]/50 focus:border-[#4f6ef7] focus:ring-4 focus:ring-[#4f6ef7]/20 rounded-xl transition-all duration-300">
                    <SelectValue placeholder={loadingCidades ? "Carregando cidades..." : "Selecione a cidade"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d0d14] border-white/10 text-white max-h-72">
                    <SelectItem value="todas">Todas as cidades</SelectItem>
                    {cidades.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </motion.div>
            ) : (
              <motion.div
                key="cidade-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <label className="text-xs font-bold text-[#cbd5e1]/40 flex items-center gap-2">
                  <span className="opacity-50">🏙️</span> Cidade
                </label>
                <div className="h-12 rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center px-4 text-sm text-[#6b7280]">
                  Selecione um estado primeiro
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ━━━━━━━━ 3. GRID DE NICHOS ━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-bold text-[#cbd5e1] uppercase tracking-[0.1em]">
            Selecione o nicho
          </label>
          {activeFilter && (
            <span className="text-xs text-[#7c9bff] font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> {activeFilter} selecionado
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {nichos.map((n, idx) => {
            const isSelected = activeFilter === n.label;
            const cat = categoriaStyles[n.cat];
            return (
              <motion.button
                key={n.label}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveFilter(n.label)}
                className={cn(
                  "group relative text-left p-4 rounded-2xl border transition-all duration-200 ease-out overflow-hidden",
                  isSelected
                    ? "border-2 border-[#4f6ef7] shadow-[0_0_30px_rgba(79,110,247,0.35)]"
                    : "border border-white/[0.06] hover:border-[#4f6ef7] hover:shadow-[0_0_20px_rgba(79,110,247,0.3)]"
                )}
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(79,110,247,0.18), rgba(124,58,237,0.10))"
                    : "#111827",
                }}
              >
                {/* Hover lighten */}
                <div className="pointer-events-none absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-200" />

                {/* Checkmark */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 16 }}
                      className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#4f6ef7] flex items-center justify-center shadow-[0_0_14px_rgba(79,110,247,0.7)] z-10"
                    >
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative flex items-start justify-between gap-2">
                  <span className="text-[40px] leading-none">{n.emoji}</span>
                  {!isSelected && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full ring-1",
                        cat.bg, cat.text, cat.ring
                      )}
                    >
                      {cat.label}
                    </span>
                  )}
                </div>

                <div className="relative font-bold text-[18px] text-white mt-3 leading-tight">
                  {n.label}
                </div>

                <div className="relative mt-3 mb-3 h-px bg-white/5" />

                <div className="relative flex items-center justify-between">
                  <span className="text-xs text-[#94a3b8] font-medium">{n.leads} empresas</span>
                  <span className="text-xs text-[#7c9bff] font-bold">Ver leads →</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ━━━━━━━━ 4. BOTÃO PRINCIPAL ━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
      >
        <button
          onClick={handleSearch}
          disabled={loading || !activeFilter}
          className={cn(
            "shimmer-btn relative w-full h-14 rounded-[14px] font-bold text-base tracking-wide overflow-hidden",
            "flex items-center justify-center gap-3 transition-all duration-300",
            !activeFilter || loading
              ? "bg-[#1f2937] text-[#6b7280] cursor-not-allowed"
              : "text-white shadow-[0_0_30px_rgba(79,110,247,0.45)] hover:shadow-[0_0_45px_rgba(124,58,237,0.55)] hover:scale-[1.01] active:scale-[0.99]"
          )}
          style={
            !activeFilter || loading
              ? undefined
              : { background: "linear-gradient(90deg, #4f6ef7 0%, #7c3aed 100%)" }
          }
        >
          {/* Shimmer sweep */}
          {activeFilter && !loading && (
            <span
              aria-hidden
              className="shimmer-sweep pointer-events-none absolute inset-0 -translate-x-full"
              style={{
                background:
                  "linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
              }}
            />
          )}
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Buscando leads...</span>
            </>
          ) : (
            <>
              <span className="text-lg">⚡</span>
              <span>Buscar Leads Agora</span>
            </>
          )}
        </button>
        <style>{`
          .shimmer-btn:hover .shimmer-sweep {
            animation: shimmer-sweep 0.6s ease-out forwards;
          }
          @keyframes shimmer-sweep {
            from { transform: translateX(-100%); }
            to   { transform: translateX(100%); }
          }
        `}</style>
      </motion.div>

      {/* ━━━━━━━━ 5. RESULTADOS / ESTADO VAZIO ━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
      >
        {results.length > 0 ? (
          <div className="bg-[#0f172a]/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.1em]">Negócio</th>
                    <th className="text-left px-6 py-4 text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.1em] hidden lg:table-cell">Descrição</th>
                    <th className="text-left px-6 py-4 text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.1em]">Telefone</th>
                    <th className="text-right px-6 py-4 text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.1em]">Ações</th>
                  </tr>
                </thead>
                <tbody key={key}>
                  {results.map((r, i) => (
                    <motion.tr
                      key={r.url + i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
                      className="border-b border-white/5 hover:bg-[#4f6ef7]/5 transition-all duration-200 group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-[#4f6ef7]/10 text-[#7c9bff] shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white block text-base">{r.title}</span>
                            <span className="text-xs text-[#64748b] mt-0.5 block">{extractDomain(r.url)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-[#94a3b8] hidden lg:table-cell max-w-xs truncate font-medium">
                        {r.description || "—"}
                      </td>
                      <td className="px-6 py-5">
                        {r.phone ? (
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-white bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            {r.phone}
                          </span>
                        ) : (
                          <span className="text-xs text-[#475569] font-medium">—</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex gap-2 justify-end opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm" variant="outline"
                            onClick={() => openExternalLink(`https://www.google.com/maps/search/${encodeURIComponent(r.title)}`)}
                            className="gap-2 font-bold border-white/10 hover:bg-white/5"
                          >
                            <MapPin className="w-3.5 h-3.5" /> Maps
                          </Button>
                          <Button
                            size="sm"
                            onClick={async () => {
                              const phoneNum = r.phone ? r.phone.replace(/\D/g, "") : "";
                              const fullNum = phoneNum.startsWith("55") ? phoneNum : `55${phoneNum}`;
                              const msg = encodeURIComponent(`Olá! Vi seu negócio online e gostaria de apresentar uma proposta. Podemos conversar?`);
                              const { data: { user } } = await supabase.auth.getUser();
                              if (user) {
                                await supabase.from("contacted_leads").insert({
                                  user_id: user.id, lead_name: r.title, phone: r.phone,
                                  website: extractDomain(r.url), source_url: r.url, status: "contatado",
                                });
                              }
                              openExternalLink(`https://wa.me/${phoneNum ? fullNum : ""}?text=${msg}`);
                            }}
                            className="gap-2 font-black uppercase text-[10px] tracking-widest text-white shadow-[0_0_15px_rgba(79,110,247,0.3)] border-0"
                            style={{ background: "linear-gradient(90deg, #4f6ef7, #7c3aed)" }}
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" /> WhatsApp
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : searched && !loading ? (
          <div className="bg-[#0f172a]/80 border border-white/10 rounded-2xl flex flex-col items-center justify-center py-20 text-[#64748b] gap-4">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <Search className="w-10 h-10 opacity-20" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-white">Nenhum lead encontrado</p>
              <p className="text-sm">Tente mudar o nicho ou buscar em outra cidade/estado.</p>
            </div>
          </div>
        ) : (
          /* ━━ ESTADO VAZIO ━━ */
          <div className="space-y-6">
            <div className="relative bg-gradient-to-b from-[#0f172a]/80 to-[#0a0f1e]/80 border border-white/10 rounded-2xl py-16 px-6 overflow-hidden">
              <div className="relative flex flex-col items-center gap-6">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="absolute inset-0 rounded-full border-2 border-[#4f6ef7]"
                      style={{
                        animation: `target-pulse 2.4s cubic-bezier(0.4,0,0.6,1) infinite`,
                        animationDelay: `${i * 0.8}s`,
                        opacity: 0,
                      }}
                    />
                  ))}
                  <div className="relative text-[80px] leading-none drop-shadow-[0_0_30px_rgba(79,110,247,0.6)]">
                    🎯
                  </div>
                </div>
                <div className="text-center space-y-2 max-w-md">
                  <p className="text-lg font-black text-white tracking-tight">
                    Selecione um nicho e a região acima
                  </p>
                  <p className="text-sm text-[#94a3b8] font-medium leading-relaxed">
                    Você verá empresas reais prontas para receber sua proposta
                  </p>
                </div>
              </div>
              <style>{`
                @keyframes target-pulse {
                  0%   { transform: scale(0.4); opacity: 0.7; }
                  100% { transform: scale(1.6); opacity: 0; }
                }
                @keyframes ghost-shimmer {
                  0%   { background-position: -400px 0; }
                  100% { background-position: 400px 0; }
                }
                .ghost-shimmer {
                  background: linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 100%);
                  background-size: 800px 100%;
                  animation: ghost-shimmer 1.8s linear infinite;
                }
              `}</style>
            </div>

            {/* Skeleton ghost cards */}
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="bg-[#0f172a]/60 border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl ghost-shimmer shrink-0" />
                  <div className="flex-1 space-y-2.5">
                    <div className="h-3.5 rounded ghost-shimmer w-1/3" />
                    <div className="h-2.5 rounded ghost-shimmer w-2/3" />
                  </div>
                  <div className="w-24 h-9 rounded-lg ghost-shimmer" />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProspeccaoView;
