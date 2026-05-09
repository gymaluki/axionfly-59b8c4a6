import { useState, useEffect } from "react";
import { MessageCircle, MapPin, Loader2, ExternalLink, Download, RotateCcw } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Categoria = "alimentacao" | "saude" | "beleza" | "servicos";

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

const ProspeccaoView = () => {
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cidades, setCidades] = useState<string[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [activeFilter, setActiveFilter] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
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

  const hasAnyState = searched || results.length > 0 || activeFilter || cidade || estado;

  return (
    <div
      className="prospeccao-root -m-4 md:-m-8 flex flex-col"
      style={{
        height: "calc(100vh - 64px)",
        background: "#05050A",
        color: "#FFFFFF",
      }}
    >
      <style>{`
        .pp-scroll::-webkit-scrollbar { width: 8px; }
        .pp-scroll::-webkit-scrollbar-track { background: transparent; }
        .pp-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 8px; }
        .pp-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.12); }

        .nicho-mini[data-selected="false"]:hover {
          background: #111118 !important;
          border-color: rgba(36,99,235,0.4) !important;
        }
        .row-result:hover { background: #0D0D12 !important; }

        @keyframes shimmer-sweep {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
        .btn-search:not(:disabled):hover .shimmer-sweep {
          animation: shimmer-sweep 0.6s ease-out forwards;
        }
        @keyframes ring-pulse-soft {
          0%   { transform: scale(0.5); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes skel-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skel {
          background: linear-gradient(90deg, #111118 0%, #1a1a24 50%, #111118 100%);
          background-size: 800px 100%;
          animation: skel-shimmer 1.6s linear infinite;
          border-radius: 6px;
        }
      `}</style>

      {/* ━━━━ HEADER COMPACTO ━━━━ */}
      <div
        className="flex items-center justify-between px-5 shrink-0"
        style={{
          height: 56,
          background: "#05050A",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-white font-bold text-[15px] tracking-tight">Busca de Leads</h1>
          <div className="hidden md:flex items-center gap-1.5">
            {["50k+ Empresas", "20 Nichos", "27 Estados"].map((b) => (
              <span
                key={b}
                style={{
                  background: "#0D0D12",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  padding: "4px 10px",
                  color: "#6B7280",
                  fontSize: 12,
                }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {hasAnyState && (
          <button
            onClick={async () => {
              if (!confirm("Limpar a pesquisa salva e reiniciar?")) return;
              const { data: { user } } = await supabase.auth.getUser();
              if (user) localStorage.removeItem(`prospeccao-view-state-${user.id}`);
              setCidade(""); setEstado(""); setActiveFilter("");
              setResults([]); setSearched(false);
              toast.success("Pesquisa reiniciada!");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: "#0D0D12",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#6B7280",
              fontSize: 12,
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar
          </button>
        )}
      </div>

      {/* ━━━━ DOIS PAINÉIS ━━━━ */}
      <div className="flex flex-1 min-h-0">
        {/* PAINEL ESQUERDO */}
        <aside
          className="flex flex-col shrink-0"
          style={{
            width: 380,
            background: "#0D0D12",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="pp-scroll flex-1 overflow-y-auto">
            {/* Filtros */}
            <div className="p-4 space-y-3">
              <div className="space-y-1.5">
                <label
                  className="uppercase font-bold flex items-center gap-1.5"
                  style={{ color: "#6B7280", fontSize: 11, letterSpacing: "0.1em" }}
                >
                  <span>📍</span> Estado
                </label>
                <Select value={estado} onValueChange={(v) => { setEstado(v); setCidade(""); }}>
                  <SelectTrigger
                    className="rounded-lg text-white text-sm focus:ring-0 focus:ring-offset-0"
                    style={{
                      height: 38,
                      background: "#05050A",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
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

              <div className="space-y-1.5">
                <label
                  className="uppercase font-bold flex items-center gap-1.5"
                  style={{
                    color: cidadeDisabled ? "#374151" : "#6B7280",
                    fontSize: 11, letterSpacing: "0.1em",
                  }}
                >
                  <span style={{ opacity: cidadeDisabled ? 0.4 : 1 }}>🏙️</span> Cidade
                </label>
                <Select value={cidade} onValueChange={setCidade} disabled={cidadeDisabled || loadingCidades}>
                  <SelectTrigger
                    className="rounded-lg text-white text-sm focus:ring-0 focus:ring-offset-0"
                    style={{
                      height: 38,
                      background: "#05050A",
                      border: "1px solid rgba(255,255,255,0.08)",
                      opacity: cidadeDisabled ? 0.45 : 1,
                    }}
                    onFocus={(e) => { if (!cidadeDisabled) e.currentTarget.style.borderColor = "#2463EB"; }}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                  >
                    <SelectValue
                      placeholder={
                        loadingCidades ? "Carregando..." :
                        cidadeDisabled ? "Selecione um estado" : "Selecione a cidade"
                      }
                    />
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

            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

            {/* Nichos */}
            <div className="px-4 py-3 space-y-3">
              <label
                className="block uppercase font-bold"
                style={{ color: "#6B7280", fontSize: 11, letterSpacing: "0.12em" }}
              >
                Selecione o nicho
              </label>
              <div className="grid grid-cols-2 gap-2">
                {nichos.map((n, idx) => {
                  const isSelected = activeFilter === n.label;
                  return (
                    <motion.button
                      key={n.label}
                      type="button"
                      title={n.label}
                      data-selected={isSelected}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.025, duration: 0.2, ease: "easeOut" }}
                      onClick={() => setActiveFilter(n.label)}
                      className="nicho-mini relative flex items-center gap-2.5 text-left transition-all"
                      style={{
                        height: 56,
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: isSelected ? "rgba(36,99,235,0.08)" : "#05050A",
                        border: isSelected
                          ? "1.5px solid #2463EB"
                          : "1px solid rgba(255,255,255,0.06)",
                        transition: "all 180ms ease",
                      }}
                    >
                      {isSelected && (
                        <span
                          className="absolute"
                          style={{
                            top: 6, right: 6, width: 6, height: 6,
                            borderRadius: "50%", background: "#2463EB",
                          }}
                        />
                      )}
                      <span style={{ fontSize: 18, lineHeight: 1 }}>{n.emoji}</span>
                      <div className="flex flex-col min-w-0 leading-tight">
                        <span
                          className="font-bold text-white truncate"
                          style={{ fontSize: 13 }}
                        >
                          {n.label}
                        </span>
                        <span style={{ color: "#6B7280", fontSize: 10, marginTop: 2 }}>
                          {n.leads}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky bottom button */}
          <div
            className="shrink-0"
            style={{
              padding: "12px 16px",
              background: "#0D0D12",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <button
              onClick={handleSearch}
              disabled={loading || !activeFilter}
              className={cn(
                "btn-search relative w-full overflow-hidden flex items-center justify-center gap-2 font-bold transition-all",
                (!activeFilter || loading) && "cursor-not-allowed"
              )}
              style={{
                height: 44,
                borderRadius: 10,
                fontSize: 14,
                background: !activeFilter ? "#1a1a24" : "#2463EB",
                color: !activeFilter ? "#374151" : "#FFFFFF",
                boxShadow: activeFilter && !loading ? "0 4px 16px rgba(36,99,235,0.25)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!activeFilter || loading) return;
                e.currentTarget.style.background = "#2F6EED";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(36,99,235,0.35)";
              }}
              onMouseLeave={(e) => {
                if (!activeFilter || loading) return;
                e.currentTarget.style.background = "#2463EB";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(36,99,235,0.25)";
              }}
            >
              {activeFilter && !loading && (
                <span
                  aria-hidden
                  className="shimmer-sweep pointer-events-none absolute inset-0 -translate-x-full"
                  style={{
                    background: "linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)",
                  }}
                />
              )}
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>Buscar Leads Agora</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* PAINEL DIREITO */}
        <main
          className="flex-1 flex flex-col min-w-0"
          style={{ background: "#05050A" }}
        >
          {/* Header de resultados */}
          <AnimatePresence initial={false}>
            {(results.length > 0 || loading) && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center justify-between gap-3 shrink-0"
                style={{
                  padding: "12px 20px",
                  background: "#0D0D12",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-white font-bold text-sm">
                    {loading ? "Buscando leads..." : `${results.length} leads encontrados`}
                  </span>
                  {activeFilter && (
                    <span
                      className="font-semibold rounded-full"
                      style={{
                        background: "rgba(36,99,235,0.15)",
                        color: "#2F6EED",
                        fontSize: 11,
                        padding: "2px 10px",
                      }}
                    >
                      {activeFilter}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleExportCSV}
                  disabled={!results.length || loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                  style={{
                    background: "#05050A",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#FFFFFF",
                    fontSize: 12,
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  Exportar CSV
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pp-scroll flex-1 overflow-y-auto">
            {loading ? (
              /* Loading skeleton */
              <div>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3"
                    style={{
                      padding: "14px 20px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div className="skel w-8 h-8 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="skel h-3 w-1/3" />
                      <div className="skel h-2.5 w-2/3" />
                    </div>
                    <div className="skel h-6 w-24" />
                    <div className="skel h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              /* Tabela */
              <table className="w-full">
                <thead className="sticky top-0" style={{ background: "#05050A" }}>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Negócio", "Descrição", "Telefone", "Ações"].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          "uppercase font-bold",
                          i === 1 && "hidden lg:table-cell",
                          i === 3 && "text-right"
                        )}
                        style={{
                          textAlign: i === 3 ? "right" : "left",
                          padding: "12px 20px",
                          color: "#6B7280",
                          fontSize: 11,
                          letterSpacing: "0.1em",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <motion.tr
                      key={r.url + i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02, duration: 0.2, ease: "easeOut" }}
                      className="row-result"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        transition: "background 180ms ease",
                      }}
                    >
                      <td style={{ padding: "14px 20px" }}>
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: "#2463EB" }} />
                          <div className="min-w-0">
                            <div className="font-bold text-white truncate" style={{ fontSize: 14 }}>{r.title}</div>
                            <div className="truncate" style={{ color: "#6B7280", fontSize: 12 }}>{extractDomain(r.url)}</div>
                          </div>
                        </div>
                      </td>
                      <td
                        className="hidden lg:table-cell max-w-xs truncate"
                        style={{ padding: "14px 20px", color: "#6B7280", fontSize: 13 }}
                      >
                        {r.description || "—"}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        {r.phone ? (
                          <span className="text-white" style={{ fontSize: 13 }}>{r.phone}</span>
                        ) : (
                          <span style={{ color: "#374151", fontSize: 13 }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openExternalLink(`https://www.google.com/maps/search/${encodeURIComponent(r.title)}`)}
                            className="p-1.5 rounded-md transition-colors"
                            style={{ color: "#2463EB" }}
                            title="Ver no Google Maps"
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(36,99,235,0.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
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
                            className="p-1.5 rounded-md transition-colors"
                            style={{ color: "#10B981" }}
                            title="WhatsApp"
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : searched ? (
              /* Sem resultados */
              <div className="h-full flex flex-col items-center justify-center text-center px-6 py-16">
                <div style={{ fontSize: 40 }}>🔍</div>
                <p className="text-white font-bold mt-3" style={{ fontSize: 15 }}>Nenhum lead encontrado</p>
                <p style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>
                  Tente mudar o nicho ou buscar em outra cidade/estado.
                </p>
              </div>
            ) : (
              /* Estado vazio inicial */
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  {[0, 1].map((i) => (
                    <span
                      key={i}
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: "2px solid #2463EB",
                        opacity: i === 0 ? 0.08 : 0.04,
                        animation: "ring-pulse-soft 2.6s cubic-bezier(0.4,0,0.6,1) infinite",
                        animationDelay: `${i * 0.9}s`,
                      }}
                    />
                  ))}
                  <div style={{ fontSize: 40, lineHeight: 1 }}>🎯</div>
                </div>
                <p className="text-white font-bold mt-2" style={{ fontSize: 15 }}>
                  Selecione um nicho e região
                </p>
                <p style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>
                  Os leads aparecerão aqui
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProspeccaoView;
