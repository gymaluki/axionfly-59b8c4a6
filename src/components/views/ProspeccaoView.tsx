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

type Categoria = "alimentacao" | "saude" | "beleza" | "servicos";

const categoriaStyles: Record<Categoria, { label: string; style: React.CSSProperties }> = {
  alimentacao: { label: "🍽️ Alimentação", style: { background: "rgba(16,185,129,0.15)", color: "#10B981" } },
  saude:       { label: "🏥 Saúde",       style: { background: "rgba(16,185,129,0.15)", color: "#10B981" } },
  beleza:      { label: "💇 Beleza",      style: { background: "rgba(36,99,235,0.15)", color: "#2F6EED" } },
  servicos:    { label: "⚙️ Serviços",    style: { background: "rgba(36,99,235,0.15)", color: "#2F6EED" } },
};

const nichos: { label: string; emoji: string; leads: string; cat: Categoria }[] = [
  { label: "Barbearias",         emoji: "✂️",  leads: "2.4k", cat: "beleza" },
  { label: "Pizzarias",          emoji: "🍕",  leads: "1.8k", cat: "alimentacao" },
  { label: "Hamburguerias",      emoji: "🍔",  leads: "1.2k", cat: "alimentacao" },
  { label: "Manicures",          emoji: "💅",  leads: "3.1k", cat: "beleza" },
  { label: "Dentistas",          emoji: "🦷",  leads: "4.5k", cat: "saude" },
  { label: "Clínicas",           emoji: "🏥",  leads: "2.7k", cat: "saude" },
  { label: "Academias",          emoji: "🏋️",  leads: "1.9k", cat: "saude" },
  { label: "Pet Shops",          emoji: "🐾",  leads: "1.4k", cat: "servicos" },
  { label: "Restaurantes",       emoji: "🍽️", leads: "5.2k", cat: "alimentacao" },
  { label: "Mecânicas",          emoji: "🔧",  leads: "2.1k", cat: "servicos" },
  { label: "Salões de Beleza",   emoji: "💇",  leads: "3.8k", cat: "beleza" },
  { label: "Estética",           emoji: "✨",  leads: "2.9k", cat: "beleza" },
  { label: "Imobiliárias",       emoji: "🏠",  leads: "1.6k", cat: "servicos" },
  { label: "Advogados",          emoji: "⚖️",  leads: "3.3k", cat: "servicos" },
  { label: "Contadores",         emoji: "📊",  leads: "1.1k", cat: "servicos" },
  { label: "Escolas de Idiomas", emoji: "🗣️", leads: "0.9k", cat: "servicos" },
  { label: "Padarias",           emoji: "🍞",  leads: "2.6k", cat: "alimentacao" },
  { label: "Farmácias",          emoji: "💊",  leads: "2.0k", cat: "saude" },
  { label: "Óticas",             emoji: "👓",  leads: "0.8k", cat: "saude" },
  { label: "Floricultura",       emoji: "🌸",  leads: "0.6k", cat: "servicos" },
  { label: "Lava Jato",          emoji: "🚗",  leads: "1.3k", cat: "servicos" },
  { label: "Fotógrafos",         emoji: "📸",  leads: "1.0k", cat: "servicos" },
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

// ━━━━━ Typewriter (apenas no nó dado) ━━━━━
const Typewriter = ({ before, accent, after, speed = 38 }: { before: string; accent: string; after?: string; speed?: number }) => {
  const full = before + accent + (after || "");
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
    const id = setInterval(() => {
      setI((prev) => {
        if (prev >= full.length) { clearInterval(id); return prev; }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [full, speed]);

  const shown = full.slice(0, i);
  const beforeShown = shown.slice(0, Math.min(i, before.length));
  const accentShown = shown.length > before.length
    ? shown.slice(before.length, before.length + accent.length)
    : "";
  const afterShown = shown.length > before.length + accent.length
    ? shown.slice(before.length + accent.length)
    : "";

  return (
    <span>
      {beforeShown}
      <span style={{ color: "#2463EB" }}>{accentShown}</span>
      {afterShown}
      <span className="inline-block w-[2px] h-[0.85em] bg-white/80 ml-1 align-middle animate-pulse" />
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

  const cidadeDisabled = !estado || estado === "todos";

  return (
    <div className="space-y-6" style={{ background: "transparent" }}>
      {/* ━━━━━━━━ 1. HERO BANNER ━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden p-7 md:p-9"
        style={{
          background: "#0D0D12",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(circle at 80% 20%, rgba(36,99,235,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <h1
              className="font-bold tracking-tight leading-tight"
              style={{ color: "#FFFFFF", fontSize: 32 }}
            >
              <Typewriter before="Encontre seus próximos " accent="clientes" after=" 🎯" />
            </h1>
            <p className="mt-3" style={{ color: "#6B7280", fontSize: 15 }}>
              Busque empresas reais por nicho e região — pronto pra prospectar
            </p>
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
              className="gap-2 rounded-lg font-semibold"
              style={{
                background: "#05050A",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#FFFFFF",
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </Button>
          )}
        </div>

        {/* Stat badges */}
        <div className="relative mt-6 flex flex-wrap gap-3">
          {[
            { icon: "🏢", to: 50000, suffix: "+", label: "EMPRESAS" },
            { icon: "🎯", to: 20,    suffix: "",  label: "NICHOS" },
            { icon: "📍", to: 27,    suffix: "",  label: "ESTADOS" },
          ].map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease: "easeOut" }}
              className="flex items-center gap-3"
              style={{
                background: "#05050A",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "12px 20px",
              }}
            >
              <span className="text-xl" style={{ color: "#2463EB" }}>{b.icon}</span>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-white text-base">
                  <Counter to={b.to} suffix={b.suffix} />
                </span>
                <span
                  className="uppercase font-semibold mt-0.5"
                  style={{ color: "#6B7280", fontSize: 11, letterSpacing: "0.08em" }}
                >
                  {b.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ━━━━━━━━ 2. FILTROS ━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        style={{
          background: "#0D0D12",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label
              className="uppercase font-semibold flex items-center gap-1.5"
              style={{ color: "#6B7280", fontSize: 12, letterSpacing: "0.05em" }}
            >
              <span>📍</span> Estado
            </label>
            <Select value={estado} onValueChange={(v) => { setEstado(v); setCidade(""); }}>
              <SelectTrigger
                className="h-12 rounded-[10px] text-white focus:ring-0 focus:ring-offset-0"
                style={{ background: "#05050A", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2463EB")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              >
                <SelectValue placeholder="Todos os estados" />
              </SelectTrigger>
              <SelectContent
                className="text-white max-h-72"
                style={{ background: "#0D0D12", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <SelectItem value="todos">Todos os estados</SelectItem>
                {estados.map(e => (
                  <SelectItem key={e.sigla} value={e.sigla}>{e.sigla} — {e.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label
              className="uppercase font-semibold flex items-center gap-1.5"
              style={{
                color: cidadeDisabled ? "#374151" : "#6B7280",
                fontSize: 12, letterSpacing: "0.05em",
              }}
            >
              <span style={{ opacity: cidadeDisabled ? 0.4 : 1 }}>🏙️</span> Cidade
            </label>
            <Select value={cidade} onValueChange={setCidade} disabled={cidadeDisabled || loadingCidades}>
              <SelectTrigger
                className="h-12 rounded-[10px] text-white focus:ring-0 focus:ring-offset-0 transition-opacity"
                style={{
                  background: "#05050A",
                  border: "1px solid rgba(255,255,255,0.08)",
                  opacity: cidadeDisabled ? 0.45 : 1,
                }}
                onFocus={(e) => { if (!cidadeDisabled) e.currentTarget.style.borderColor = "#2463EB"; }}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              >
                <SelectValue placeholder={loadingCidades ? "Carregando cidades..." : cidadeDisabled ? "Selecione um estado primeiro" : "Selecione a cidade"} />
              </SelectTrigger>
              <SelectContent
                className="text-white max-h-72"
                style={{ background: "#0D0D12", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <SelectItem value="todas">Todas as cidades</SelectItem>
                {cidades.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* ━━━━━━━━ 3. GRID DE NICHOS ━━━━━━━━ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label
            className="uppercase font-bold"
            style={{ color: "#6B7280", fontSize: 11, letterSpacing: "0.12em" }}
          >
            Selecione o nicho
          </label>
          {activeFilter && (
            <span
              className="font-bold flex items-center gap-1.5"
              style={{ color: "#2463EB", fontSize: 12 }}
            >
              <Check className="w-3.5 h-3.5" /> {activeFilter}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {nichos.map((n, idx) => {
            const isSelected = activeFilter === n.label;
            const cat = categoriaStyles[n.cat];
            return (
              <motion.button
                key={n.label}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.035, duration: 0.28, ease: "easeOut" }}
                onClick={() => setActiveFilter(n.label)}
                className="nicho-card group relative text-left transition-all"
                data-selected={isSelected}
                style={{
                  background: isSelected ? "rgba(36,99,235,0.08)" : "#0D0D12",
                  border: isSelected
                    ? "1.5px solid #2463EB"
                    : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  padding: 20,
                  transition: "all 180ms ease",
                }}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(36,99,235,0.15)", border: "1px solid rgba(36,99,235,0.4)" }}
                    >
                      <Check className="w-3 h-3" strokeWidth={3} style={{ color: "#2463EB" }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-start justify-between gap-2">
                  <span style={{ fontSize: 32, lineHeight: 1 }}>{n.emoji}</span>
                  {!isSelected && (
                    <span
                      className="font-semibold rounded-full"
                      style={{ ...cat.style, fontSize: 11, padding: "2px 8px", lineHeight: "16px" }}
                    >
                      {cat.label}
                    </span>
                  )}
                </div>

                <div
                  className="mt-3 font-bold text-white leading-tight"
                  style={{ fontSize: 16 }}
                >
                  {n.label}
                </div>

                <div className="mt-3 mb-3" style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

                <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
                  <span style={{ color: "#6B7280" }}>{n.leads} empresas</span>
                  <span className="font-semibold" style={{ color: "#2463EB" }}>Ver leads →</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <style>{`
        .nicho-card[data-selected="false"]:hover {
          background: #111118 !important;
          border-color: rgba(36,99,235,0.4) !important;
          box-shadow: 0 0 0 1px rgba(36,99,235,0.2);
        }
        @keyframes shimmer-sweep {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
        .btn-search:not(:disabled):hover .shimmer-sweep {
          animation: shimmer-sweep 0.6s ease-out forwards;
        }
        @keyframes ring-pulse {
          0%   { transform: scale(0.4); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes ghost-shimmer-anim {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .ghost-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 100%);
          background-size: 800px 100%;
          animation: ghost-shimmer-anim 1.8s linear infinite;
        }
      `}</style>

      {/* ━━━━━━━━ 4. BOTÃO ━━━━━━━━ */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        onClick={handleSearch}
        disabled={loading || !activeFilter}
        className={cn(
          "btn-search relative w-full overflow-hidden flex items-center justify-center gap-2 font-bold transition-all",
          (!activeFilter || loading) && "cursor-not-allowed"
        )}
        style={{
          height: 52,
          borderRadius: 12,
          fontSize: 15,
          background: !activeFilter ? "#1F2937" : "#2463EB",
          color: !activeFilter ? "#6B7280" : "#FFFFFF",
          boxShadow: activeFilter && !loading ? "0 4px 20px rgba(36,99,235,0.25)" : "none",
        }}
        onMouseEnter={(e) => {
          if (!activeFilter || loading) return;
          e.currentTarget.style.background = "#2F6EED";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(36,99,235,0.35)";
        }}
        onMouseLeave={(e) => {
          if (!activeFilter || loading) return;
          e.currentTarget.style.background = "#2463EB";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(36,99,235,0.25)";
        }}
      >
        {activeFilter && !loading && (
          <span
            aria-hidden
            className="shimmer-sweep pointer-events-none absolute inset-0 -translate-x-full"
            style={{
              background: "linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
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
            <span>⚡</span>
            <span>Buscar Leads Agora</span>
          </>
        )}
      </motion.button>

      {/* ━━━━━━━━ 5. RESULTADOS / VAZIO ━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      >
        {results.length > 0 ? (
          <div
            className="overflow-hidden"
            style={{
              background: "#0D0D12",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <th className="text-left px-6 py-4 uppercase font-bold" style={{ color: "#6B7280", fontSize: 11, letterSpacing: "0.1em" }}>Negócio</th>
                    <th className="text-left px-6 py-4 uppercase font-bold hidden lg:table-cell" style={{ color: "#6B7280", fontSize: 11, letterSpacing: "0.1em" }}>Descrição</th>
                    <th className="text-left px-6 py-4 uppercase font-bold" style={{ color: "#6B7280", fontSize: 11, letterSpacing: "0.1em" }}>Telefone</th>
                    <th className="text-right px-6 py-4 uppercase font-bold" style={{ color: "#6B7280", fontSize: 11, letterSpacing: "0.1em" }}>Ações</th>
                  </tr>
                </thead>
                <tbody key={key}>
                  {results.map((r, i) => (
                    <motion.tr
                      key={r.url + i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3, ease: "easeOut" }}
                      className="group transition-colors"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#111118")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div
                            className="p-2 rounded-lg shrink-0"
                            style={{ background: "rgba(36,99,235,0.1)", color: "#2F6EED" }}
                          >
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white block text-base">{r.title}</span>
                            <span className="text-xs mt-0.5 block" style={{ color: "#374151" }}>{extractDomain(r.url)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm hidden lg:table-cell max-w-xs truncate font-medium" style={{ color: "#6B7280" }}>
                        {r.description || "—"}
                      </td>
                      <td className="px-6 py-5">
                        {r.phone ? (
                          <span
                            className="inline-flex items-center gap-2 text-sm font-bold text-white px-3 py-1.5 rounded-lg"
                            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}
                          >
                            <Phone className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
                            {r.phone}
                          </span>
                        ) : (
                          <span className="text-xs font-medium" style={{ color: "#374151" }}>—</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm" variant="outline"
                            onClick={() => openExternalLink(`https://www.google.com/maps/search/${encodeURIComponent(r.title)}`)}
                            className="gap-2 font-semibold text-white"
                            style={{ background: "#05050A", border: "1px solid rgba(255,255,255,0.08)" }}
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
                            className="gap-2 font-bold text-white border-0"
                            style={{ background: "#2463EB" }}
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
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
          <div
            className="flex flex-col items-center justify-center py-20 gap-4"
            style={{
              background: "#0D0D12",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <Search className="w-10 h-10" style={{ color: "#374151" }} />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-white">Nenhum lead encontrado</p>
              <p className="text-sm" style={{ color: "#6B7280" }}>Tente mudar o nicho ou buscar em outra cidade/estado.</p>
            </div>
          </div>
        ) : (
          /* ESTADO VAZIO */
          <div className="space-y-4">
            <div
              className="relative overflow-hidden flex flex-col items-center justify-center py-16 px-6"
              style={{
                background: "#0D0D12",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
              }}
            >
              <div className="relative w-40 h-40 flex items-center justify-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: "2px solid #2463EB",
                      animation: "ring-pulse 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
                      animationDelay: `${i * 0.8}s`,
                      opacity: 0,
                    }}
                  />
                ))}
                <div style={{ fontSize: 80, lineHeight: 1, filter: "drop-shadow(0 0 24px rgba(36,99,235,0.45))" }}>
                  🎯
                </div>
              </div>
              <div className="mt-6 text-center space-y-2 max-w-md">
                <p className="font-bold text-white" style={{ fontSize: 17 }}>
                  Selecione um nicho e a região acima
                </p>
                <p style={{ color: "#6B7280", fontSize: 14 }}>
                  Você verá empresas reais prontas para receber sua proposta
                </p>
              </div>
            </div>

            {/* Skeleton ghost cards */}
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5"
                  style={{
                    background: "#0D0D12",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                  }}
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
