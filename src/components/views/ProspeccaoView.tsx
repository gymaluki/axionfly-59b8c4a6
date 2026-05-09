import { useState, useEffect } from "react";
import {
  Loader2, ExternalLink, Download, MessageCircle, MapPin, Search,
  Scissors, Pizza, Sandwich, Sparkles, Stethoscope, Building2,
  Dumbbell, PawPrint, UtensilsCrossed, Wrench, Smile, Wand2,
  Home, Scale, Calculator, BookOpen, ShoppingBag, Pill, Glasses,
  Flower2, Car, Camera, RotateCcw,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type LucideIcon = typeof Scissors;

const nichos: { label: string; Icon: LucideIcon }[] = [
  { label: "Barbearias", Icon: Scissors },
  { label: "Pizzarias", Icon: Pizza },
  { label: "Hamburguerias", Icon: Sandwich },
  { label: "Manicures", Icon: Sparkles },
  { label: "Dentistas", Icon: Stethoscope },
  { label: "Clínicas", Icon: Building2 },
  { label: "Academias", Icon: Dumbbell },
  { label: "Pet Shops", Icon: PawPrint },
  { label: "Restaurantes", Icon: UtensilsCrossed },
  { label: "Mecânicas", Icon: Wrench },
  { label: "Salões de Beleza", Icon: Smile },
  { label: "Estética", Icon: Wand2 },
  { label: "Imobiliárias", Icon: Home },
  { label: "Advogados", Icon: Scale },
  { label: "Contadores", Icon: Calculator },
  { label: "Escolas de Idiomas", Icon: BookOpen },
  { label: "Padarias", Icon: ShoppingBag },
  { label: "Farmácias", Icon: Pill },
  { label: "Óticas", Icon: Glasses },
  { label: "Floricultura", Icon: Flower2 },
  { label: "Lava Jato", Icon: Car },
  { label: "Fotógrafos", Icon: Camera },
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

const ProspeccaoView = () => {
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cidades, setCidades] = useState<string[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [activeFilter, setActiveFilter] = useState("");
  const [searchMode, setSearchMode] = useState<"automatic" | "manual">("automatic");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualRedirectUrl, setManualRedirectUrl] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

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
        setSearchMode(s.searchMode || "automatic");
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
        JSON.stringify({ cidade, estado, activeFilter, results, searched, searchMode })
      );
    };
    save();
  }, [cidade, estado, activeFilter, results, searched, searchMode]);

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
    
    if (searchMode === "manual") {
      setLoading(true);
      setManualRedirectUrl(null);
      const location = buildLocation();
      const query = `${activeFilter} em ${location}`.trim();
      const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
      
      setTimeout(() => {
        setLoading(false);
        const win = window.open(mapsUrl, "_blank", "noopener,noreferrer");
        if (win) {
          toast.success("Redirecionando para o Google Maps...");
        } else {
          setManualRedirectUrl(mapsUrl);
          toast.error("Popup bloqueado pelo navegador");
        }
      }, 6000);
      return;
    }
    
    doSearch(activeFilter);
  };

  const extractDomain = (url: string) => {
    try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
  };

  const handleExportCSV = () => {
    if (!results.length) return;
    const header = ["Negócio", "Site", "Descrição", "Telefone", "URL"];
    const rows = results.map(r => [
      r.title, extractDomain(r.url), r.description.replace(/[\r\n,]/g, " "),
      r.phone || "", r.url,
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${activeFilter || "axionfly"}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado!");
  };

  const cidadeDisabled = !estado || estado === "todos";
  const activeNicho = nichos.find(n => n.label === activeFilter);

  const handleSelectNicho = (label: string) => {
    if (activeFilter === label) return;
    setActiveFilter(label);
    setResults([]);
    setSearched(false);
  };

  const handleClearNicho = () => {
    setActiveFilter("");
    setResults([]);
    setSearched(false);
    setEstado("");
    setCidade("");
    toast.info("Pesquisa reiniciada");
  };

  return (
    <div
      className="prospeccao-root -m-4 md:-m-8 min-h-[calc(100vh-64px)]"
      style={{ background: "#05050A", color: "#FFFFFF" }}
    >
      <style>{`
        .pp-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .pp-scroll::-webkit-scrollbar-track { background: transparent; }
        .pp-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 10px; }
        .pp-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.12); }

        .nicho-card { transition: all 160ms ease; }
        .nicho-card:hover:not([data-selected="true"]) {
          background: #111118 !important;
          border-color: rgba(36,99,235,0.3) !important;
          box-shadow: 0 0 0 1px rgba(36,99,235,0.1);
        }
        .nicho-card:hover:not([data-selected="true"]) .nicho-icon { color: #2463EB !important; }
        .nicho-card:hover:not([data-selected="true"]) span { color: #FFFFFF !important; }

        @keyframes pulse-blue {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.4; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulse-dot {
          animation: pulse-blue 2s infinite;
        }

        .row-result { transition: all 120ms ease-out; }
        .row-result:hover { background: #0D0D12 !important; }

        .btn-buscar { transition: all 160ms ease; position: relative; overflow: hidden; }
        .btn-buscar:not(:disabled):hover {
          background: #2F6EED !important;
          box-shadow: 0 4px 20px rgba(36,99,235,0.35);
        }
        .btn-buscar:not(:disabled):active { transform: scale(0.97); background: #1D4ED8 !important; }
        
        .btn-buscar::after {
          content: "";
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transition: none;
        }
        .btn-buscar:hover::after {
          left: 100%;
          transition: left 500ms linear;
        }

        .pp-select-trigger {
          background: #0D0D12 !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          color: #FFFFFF !important;
          height: 42px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          transition: all 160ms ease !important;
        }
        .pp-select-trigger:focus, .pp-select-trigger[data-state="open"] {
          border-color: #2463EB !important;
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(36,99,235,0.12) !important;
        }

        @keyframes skel-shimmer {
          0% { background-position: -400% 0; }
          100% { background-position: 400% 0; }
        }
        .skel {
          background: linear-gradient(90deg, #0D0D12 0%, #16161E 50%, #0D0D12 100%);
          background-size: 400% 100%;
          animation: skel-shimmer 2s ease infinite;
          border-radius: 8px;
        }

        @keyframes scan-line {
          0% { top: 0; opacity: 0; }
          5% { opacity: 0.5; }
          50% { opacity: 0.8; }
          95% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        .scanner-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #2463EB, transparent);
          box-shadow: 0 0 15px #2463EB;
          animation: scan-line 2.5s ease-in-out infinite;
          z-index: 10;
        }

      `}</style>

      {/* HEADER */}
      <div
        className="px-6 pt-6 pb-5 flex items-start justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div>
          <h1 className="text-[22px] font-bold leading-tight" style={{ color: "#FFFFFF" }}>
            Prospecção de <span style={{ color: "#2463EB" }}>Clientes</span>
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "#6B7280" }}>
            Selecione um nicho para começar
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["50k+ Empresas", "22 Nichos", "27 Estados"].map((pill) => (
            <div
              key={pill}
              className="px-2.5 py-1 rounded-full border flex items-center justify-center"
              style={{
                background: "rgba(36,99,235,0.1)",
                borderColor: "rgba(36,99,235,0.2)",
              }}
            >
              <span style={{ color: "#2463EB", fontSize: 11, fontWeight: 700, letterSpacing: "-0.01em" }}>
                {pill}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* GRID DE NICHOS */}
      <div className="px-6 py-6">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}
        >
          {nichos.map((n, idx) => {
            const selected = activeFilter === n.label;
            const Icon = n.Icon;
            return (
              <motion.button
                key={n.label}
                type="button"
                onClick={() => handleSelectNicho(n.label)}
                data-selected={selected}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: idx * 0.018 }}
                className="nicho-card relative flex items-center text-left"
                style={{
                  height: 52,
                  padding: "0 14px",
                  gap: 10,
                  borderRadius: 10,
                  background: selected 
                    ? "linear-gradient(135deg, #0F1629 0%, #0a1220 100%)" 
                    : "#0D0D12",
                  border: selected
                    ? "1px solid #2463EB"
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: selected 
                    ? "0 0 0 1px rgba(36,99,235,0.2), 0 4px 24px rgba(36,99,235,0.15)" 
                    : "none",
                  borderLeft: selected ? "3px solid #2463EB" : "1px solid rgba(255,255,255,0.07)",
                  paddingLeft: selected ? 12 : 14,
                }}
              >
                <Icon
                  className="nicho-icon shrink-0"
                  size={15}
                  strokeWidth={1.5}
                  color={selected ? "#2463EB" : "#374151"}
                />
                <span
                  className="truncate"
                  style={{
                    fontSize: 13,
                    fontWeight: selected ? 700 : 500,
                    color: selected ? "#FFFFFF" : "#9CA3AF",
                  }}
                >
                  {n.label}
                </span>
                {selected && (
                  <div 
                    className="pulse-dot absolute top-2 right-2 w-[5px] h-[5px] rounded-full"
                    style={{ background: "#2463EB" }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO DE RESULTADOS (acordeão) */}
      <AnimatePresence initial={false}>
        {activeNicho && (
          <motion.section
            key="results-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            {/* BARRA DE CONTEXTO */}
            <div
              className="flex items-center justify-between px-6"
              style={{
                height: 52,
                background: "#0D0D12",
                borderTop: "2px solid #2463EB",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-3">
                <activeNicho.Icon size={16} strokeWidth={1.5} color="#2463EB" />
                <span className="text-[15px] font-bold" style={{ color: "#FFFFFF" }}>
                  {activeNicho.label}
                </span>
                <div 
                  className="px-2 py-0.5 rounded-full border flex items-center justify-center ml-1"
                  style={{
                    background: "rgba(36,99,235,0.1)",
                    borderColor: "rgba(36,99,235,0.2)",
                  }}
                >
                  <span style={{ color: "#2463EB", fontSize: 11, fontWeight: 700 }}>
                    Selecionado
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearNicho}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/10 hover:border-white/20 transition-all group"
                style={{ fontSize: 12, color: "#6B7280", background: "transparent" }}
              >
                <RotateCcw size={12} className="group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">Reiniciar pesquisa</span>
              </button>
            </div>

            {/* MODOS DE BUSCA */}
            <div className="px-6 pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => setSearchMode("automatic")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all"
                style={{
                  background: searchMode === "automatic" ? "rgba(36,99,235,0.1)" : "#0D0D12",
                  borderColor: searchMode === "automatic" ? "#2463EB" : "rgba(255,255,255,0.06)",
                  color: searchMode === "automatic" ? "#FFFFFF" : "#6B7280",
                  fontSize: 13,
                  fontWeight: searchMode === "automatic" ? 700 : 500,
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ background: searchMode === "automatic" ? "#2463EB" : "#374151" }} 
                />
                Prospecção Automática
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("manual")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all"
                style={{
                  background: searchMode === "manual" ? "rgba(36,99,235,0.1)" : "#0D0D12",
                  borderColor: searchMode === "manual" ? "#2463EB" : "rgba(255,255,255,0.06)",
                  color: searchMode === "manual" ? "#FFFFFF" : "#6B7280",
                  fontSize: 13,
                  fontWeight: searchMode === "manual" ? 700 : 500,
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ background: searchMode === "manual" ? "#2463EB" : "#374151" }} 
                />
                Prospecção Manual
              </button>
            </div>

            {/* FILTROS DE LOCALIZAÇÃO */}
            <div className="px-6 py-5" style={{ background: "#05050A" }}>
              <div className="flex items-end gap-3">
                <div style={{ flex: 1 }}>
                  <label
                    className="block uppercase tracking-[0.08em] mb-1.5"
                    style={{ fontSize: 10, color: "#6B7280" }}
                  >
                    Estado
                  </label>
                  <Select value={estado} onValueChange={(v) => { setEstado(v); setCidade(""); }}>
                    <SelectTrigger className="pp-select-trigger">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent
                      className="pp-scroll"
                      style={{ background: "#0D0D12", border: "1px solid rgba(255,255,255,0.08)", color: "#FFFFFF" }}
                    >
                      <SelectItem value="todos">Todos</SelectItem>
                      {estados.map(e => (
                        <SelectItem key={e.sigla} value={e.sigla}>{e.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    className="block uppercase tracking-[0.08em] mb-1.5"
                    style={{ fontSize: 10, color: "#6B7280" }}
                  >
                    Cidade
                  </label>
                  <Select
                    value={cidade}
                    onValueChange={setCidade}
                    disabled={cidadeDisabled || loadingCidades}
                  >
                    <SelectTrigger
                      className="pp-select-trigger"
                      style={{ opacity: cidadeDisabled ? 0.5 : 1 }}
                    >
                      <SelectValue placeholder={cidadeDisabled ? "Selecione um estado" : (loadingCidades ? "Carregando..." : "Selecione a cidade")} />
                    </SelectTrigger>
                    <SelectContent
                      className="pp-scroll"
                      style={{ background: "#0D0D12", border: "1px solid rgba(255,255,255,0.08)", color: "#FFFFFF", maxHeight: 280 }}
                    >
                      <SelectItem value="todas">Todas</SelectItem>
                      {cidades.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={loading}
                  className="btn-buscar flex items-center justify-center gap-2"
                  style={{
                    width: "auto",
                    padding: "0 24px",
                    height: 42,
                    borderRadius: 8,
                    background: "#2463EB",
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontWeight: 700,
                    border: "none",
                    cursor: loading ? "default" : "pointer",
                    opacity: loading ? 0.8 : 1,
                  }}
                >
                  {loading ? (
                    <><Loader2 size={14} className="animate-spin" /> Buscando...</>
                  ) : searchMode === "manual" ? (
                    <><MapPin size={14} /> Abrir no Google</>
                  ) : (
                    <><Search size={14} /> Buscar Leads</>
                  )}
                </button>
              </div>
            </div>

            {/* TABELA DE RESULTADOS (Apenas em modo automático ou durante o loading do manual/fallback) */}
            {(searchMode === "automatic" || (searchMode === "manual" && (loading || manualRedirectUrl))) && (
              <div className="px-6 pb-8">
              <div
                style={{
                  background: "#0D0D12",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {/* Header da tabela */}
                <div
                  className="flex items-center justify-between px-6"
                  style={{
                    height: 52,
                    background: "#0D0D12",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 12, color: "#6B7280" }}>
                      {loading
                        ? (
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2463EB] animate-pulse" />
                            <span>{searchMode === "manual" ? "Preparando redirecionamento para o Google Maps..." : "Escaneando a web em busca de leads..."}</span>
                          </div>
                        )
                        : results.length > 0
                          ? `${results.length} leads encontrados`
                          : searched
                            ? "Nenhum lead encontrado"
                            : "Configure os filtros e clique em Buscar"}
                    </span>
                    {results.length > 0 && (
                      <div 
                        className="px-2 py-0.5 rounded-full border border-[rgba(36,99,235,0.15)] bg-[rgba(36,99,235,0.1)]"
                        style={{ marginLeft: 4 }}
                      >
                        <span style={{ color: "#2463EB", fontSize: 11, fontWeight: 700 }}>
                          {activeFilter}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      disabled={!results.length}
                      className="flex items-center gap-1.5 px-3 transition-colors"
                      style={{
                        height: 32,
                        borderRadius: 7,
                        border: "1px solid rgba(255,255,255,0.08)",
                        fontSize: 12,
                        color: results.length ? "#FFFFFF" : "#374151",
                        cursor: results.length ? "pointer" : "default",
                        background: "transparent",
                      }}
                      onMouseEnter={(e) => { if (results.length) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#FFFFFF"; } }}
                      onMouseLeave={(e) => { if (results.length) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#FFFFFF"; } }}
                    >
                      <Download size={12} /> Exportar CSV
                    </button>
                  </div>
                </div>

                {/* Conteúdo */}
                {loading ? (
                  <div className="relative overflow-hidden">
                    <div className="scanner-line" />
                    <div className="px-5 py-6 space-y-4">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="skel h-4 w-32" />
                        <div className="skel h-4 w-48" />
                      </div>
                      {[0, 1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex gap-4 items-center">
                          <div className="skel h-12 flex-1" />
                          <div className="skel h-12 flex-1 hidden md:block" />
                          <div className="skel h-12 w-32 hidden md:block" />
                          <div className="skel h-10 w-24" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="pp-scroll" style={{ maxHeight: 520, overflowY: "auto" }}>
                    <table className="w-full" style={{ fontSize: 13 }}>
                      <thead>
                        <tr
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                            background: "#05050A",
                          }}
                        >
                          <th className="text-left font-medium px-6 py-2.5" style={{ color: "#374151", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>Negócio</th>
                          <th className="text-left font-medium px-4 py-2.5" style={{ color: "#374151", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>Descrição</th>
                          <th className="text-left font-medium px-4 py-2.5" style={{ color: "#374151", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>Telefone</th>
                          <th className="text-right font-medium px-6 py-2.5" style={{ color: "#374151", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r, i) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.18, ease: "easeOut", delay: i * 0.025 }}
                            className="row-result"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                          >
                            <td className="px-6 py-3.5 align-top" style={{ maxWidth: 240 }}>
                              <div className="flex items-center gap-1.5 font-medium truncate" style={{ color: "#FFFFFF", fontSize: 14 }}>
                                <MapPin size={12} strokeWidth={1.5} color="#2463EB" className="shrink-0" />
                                {r.title}
                              </div>
                              <div className="truncate text-[11px] mt-0.5 ml-[18px]" style={{ color: "#374151" }}>{extractDomain(r.url)}</div>
                            </td>
                            <td className="px-4 py-3.5 align-top" style={{ color: "#6B7280", maxWidth: 360 }}>
                              <div className="line-clamp-1 text-[13px]">{r.description || "—"}</div>
                            </td>
                            <td className="px-4 py-3.5 align-top whitespace-nowrap text-[13px]" style={{ color: r.phone ? "#FFFFFF" : "#374151" }}>
                              {r.phone || "—"}
                            </td>
                            <td className="px-6 py-3.5 align-top">
                              <div className="flex items-center justify-end gap-2.5">
                                {r.phone && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const text = encodeURIComponent(`Olá, sou da AxionFly. Vi que o seu negócio "${r.title}" tem um grande potencial, mas ainda não está aproveitando todo o poder do digital para fechar mais contratos.

Gostaria de apresentar como podemos automatizar sua prospecção e escalar seu faturamento de forma profissional. Podemos conversar hoje?`);
                                      const cleanPhone = r.phone!.replace(/\D/g, "");
                                      const waNumber = cleanPhone.length === 11 ? cleanPhone : (cleanPhone.length === 10 ? `11${cleanPhone}` : cleanPhone);
                                      openExternalLink(`https://wa.me/55${waNumber}?text=${text}`);
                                    }}
                                    title="Fechar Contrato no WhatsApp"
                                    className="flex items-center justify-center bg-[#22c55e]/10 hover:bg-[#22c55e]/20 transition-all group"
                                    style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(34,197,94,0.2)" }}
                                  >
                                    <MessageCircle size={15} className="text-[#22c55e] transition-colors" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const loc = buildLocation();
                                    const q = `${r.title} ${loc}`.trim();
                                    openExternalLink(`https://www.google.com/maps/search/${encodeURIComponent(q)}`);
                                  }}
                                  title="Ver no Google Maps"
                                  className="flex items-center justify-center bg-[#2463EB]/10 hover:bg-[#2463EB]/20 transition-all group"
                                  style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(36,99,235,0.2)" }}
                                >
                                  <MapPin size={15} className="text-[#2463EB] transition-colors" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openExternalLink(r.url)}
                                  title="Abrir Site"
                                  className="flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all group"
                                  style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                  <ExternalLink size={15} className="text-[#6B7280] group-hover:text-white transition-colors" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center text-center"
                    style={{ padding: "56px 24px" }}
                  >
                    <Search size={28} strokeWidth={1.5} color="#1F2937" />
                    <p style={{ fontSize: 13, color: "#374151", marginTop: 12 }}>
                      Configure os filtros e clique em Buscar
                    </p>
                  </div>
                )}
              </div>
            </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProspeccaoView;
