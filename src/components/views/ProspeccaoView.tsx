import { useState, useEffect } from "react";
import {
  Loader2, ExternalLink, Download, X, MessageCircle, MapPin,
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
  };

  return (
    <div
      className="prospeccao-root -m-4 md:-m-8 min-h-[calc(100vh-64px)]"
      style={{ background: "#05050A", color: "#FFFFFF" }}
    >
      <style>{`
        .pp-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .pp-scroll::-webkit-scrollbar-track { background: transparent; }
        .pp-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 8px; }
        .pp-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.12); }

        .nicho-card { transition: all 160ms ease; }
        .nicho-card:hover:not([data-selected="true"]) {
          background: #111118 !important;
          border-color: rgba(36,99,235,0.35) !important;
        }
        .nicho-card:hover:not([data-selected="true"]) .nicho-icon { color: #2463EB !important; }

        .row-result { transition: background 160ms ease; }
        .row-result:hover { background: #111118 !important; }

        .btn-primary { transition: all 180ms ease; }
        .btn-primary:not(:disabled):hover {
          background: #2F6EED !important;
          box-shadow: 0 0 20px rgba(36,99,235,0.25);
        }

        .pp-select-trigger {
          background: #0D0D12 !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          color: #FFFFFF !important;
          height: 40px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
        }
        .pp-select-trigger:focus, .pp-select-trigger[data-state="open"] {
          border-color: #2463EB !important;
          outline: none !important;
          box-shadow: none !important;
        }

        @keyframes skel-shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skel {
          background: linear-gradient(90deg, #0D0D12 0%, #16161e 50%, #0D0D12 100%);
          background-size: 800px 100%;
          animation: skel-shimmer 1.6s linear infinite;
          border-radius: 6px;
        }
      `}</style>

      {/* HEADER */}
      <div
        className="px-6 pt-6 pb-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h1 className="text-[22px] font-bold leading-tight" style={{ color: "#FFFFFF" }}>
          Prospecção de Clientes
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "#6B7280" }}>
          Selecione um nicho para começar
        </p>
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
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: "easeOut", delay: idx * 0.02 }}
                className="nicho-card relative flex items-center text-left"
                style={{
                  height: 48,
                  padding: "0 16px",
                  gap: 10,
                  borderRadius: 10,
                  background: selected ? "rgba(36,99,235,0.08)" : "#0D0D12",
                  border: selected
                    ? "1px solid #2463EB"
                    : "1px solid rgba(255,255,255,0.06)",
                  borderLeft: selected ? "3px solid #2463EB" : "1px solid rgba(255,255,255,0.06)",
                  paddingLeft: selected ? 14 : 16,
                }}
              >
                <Icon
                  className="nicho-icon shrink-0"
                  size={16}
                  strokeWidth={1.5}
                  color={selected ? "#2463EB" : "#6B7280"}
                />
                <span
                  className="truncate"
                  style={{
                    fontSize: 13,
                    fontWeight: selected ? 700 : 500,
                    color: "#FFFFFF",
                  }}
                >
                  {n.label}
                </span>
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
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            {/* BARRA DE CONTEXTO */}
            <div
              className="flex items-center justify-between px-6"
              style={{
                height: 44,
                background: "#0D0D12",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <activeNicho.Icon size={16} strokeWidth={1.5} color="#2463EB" />
                <span className="text-[14px] font-bold" style={{ color: "#FFFFFF" }}>
                  {activeNicho.label}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearNicho}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all group"
                style={{ fontSize: 12, color: "#6B7280", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <RotateCcw size={12} className="group-hover:rotate-[-45deg] transition-transform" />
                Nova Pesquisa
              </button>
            </div>

            {/* FILTROS DE LOCALIZAÇÃO */}
            <div className="px-6 py-5" style={{ background: "#05050A" }}>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label
                    className="block uppercase tracking-widest mb-1.5"
                    style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.1em" }}
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
                <div className="flex-1">
                  <label
                    className="block uppercase tracking-widest mb-1.5"
                    style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.1em" }}
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
                  className="btn-primary flex items-center justify-center gap-2"
                  style={{
                    width: 140,
                    height: 40,
                    borderRadius: 8,
                    background: "#2463EB",
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontWeight: 700,
                    border: "none",
                    cursor: loading ? "default" : "pointer",
                    opacity: loading ? 0.8 : 1,
                  }}
                >
                  {loading ? (
                    <><Loader2 size={14} className="animate-spin" /> Buscando</>
                  ) : (
                    "Buscar Leads"
                  )}
                </button>
              </div>
            </div>

            {/* TABELA DE RESULTADOS */}
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
                  className="flex items-center justify-between px-5"
                  style={{
                    height: 48,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#6B7280" }}>
                    {loading
                      ? "Buscando leads..."
                      : results.length > 0
                        ? `${results.length} leads encontrados`
                        : searched
                          ? "Nenhum lead encontrado"
                          : "Configure os filtros e clique em Buscar"}
                  </span>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    disabled={!results.length}
                    className="flex items-center gap-1.5 px-3 hover:bg-white/[0.03] transition-colors"
                    style={{
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.08)",
                      fontSize: 12,
                      color: results.length ? "#FFFFFF" : "#374151",
                      cursor: results.length ? "pointer" : "default",
                      background: "transparent",
                    }}
                  >
                    <Download size={13} /> Exportar CSV
                  </button>
                </div>

                {/* Conteúdo */}
                {loading ? (
                  <div className="px-5 py-4 space-y-3">
                    {[0, 1, 2, 3, 4].map(i => (
                      <div key={i} className="skel" style={{ height: 56 }} />
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <div className="pp-scroll" style={{ maxHeight: 520, overflowY: "auto" }}>
                    <table className="w-full" style={{ fontSize: 13 }}>
                      <thead>
                        <tr
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                            background: "#0D0D12",
                          }}
                        >
                          <th className="text-left font-medium px-5 py-3" style={{ color: "#6B7280", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>Negócio</th>
                          <th className="text-left font-medium px-3 py-3" style={{ color: "#6B7280", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>Descrição</th>
                          <th className="text-left font-medium px-3 py-3" style={{ color: "#6B7280", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>Telefone</th>
                          <th className="text-right font-medium px-5 py-3" style={{ color: "#6B7280", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r, i) => (
                          <tr
                            key={i}
                            className="row-result"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                          >
                            <td className="px-5 py-3 align-top" style={{ maxWidth: 240 }}>
                              <div className="font-semibold truncate" style={{ color: "#FFFFFF" }}>{r.title}</div>
                              <div className="truncate text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{extractDomain(r.url)}</div>
                            </td>
                            <td className="px-3 py-3 align-top" style={{ color: "#9CA3AF", maxWidth: 360 }}>
                              <div className="line-clamp-2">{r.description || "—"}</div>
                            </td>
                            <td className="px-3 py-3 align-top whitespace-nowrap" style={{ color: r.phone ? "#FFFFFF" : "#374151" }}>
                              {r.phone || "—"}
                            </td>
                            <td className="px-5 py-3 align-top">
                              <div className="flex items-center justify-end gap-1.5">
                                {r.phone && (
                                  <button
                                    type="button"
                                    onClick={() => openExternalLink(`https://wa.me/55${r.phone!.replace(/\D/g, "")}`)}
                                    title="WhatsApp"
                                    className="flex items-center justify-center hover:bg-white/[0.05] transition-colors"
                                    style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)" }}
                                  >
                                    <MessageCircle size={13} color="#6B7280" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => openExternalLink(`https://www.google.com/maps/search/${encodeURIComponent(r.title)}`)}
                                  title="Maps"
                                  className="flex items-center justify-center hover:bg-white/[0.05] transition-colors"
                                  style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                  <MapPin size={13} color="#6B7280" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openExternalLink(r.url)}
                                  title="Abrir site"
                                  className="flex items-center justify-center hover:bg-white/[0.05] transition-colors"
                                  style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                  <ExternalLink size={13} color="#6B7280" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center text-center"
                    style={{ padding: "48px 24px" }}
                  >
                    <div
                      className="flex items-center justify-center mb-3"
                      style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: "#111118",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <activeNicho.Icon size={18} strokeWidth={1.5} color="#6B7280" />
                    </div>
                    <p style={{ fontSize: 13, color: "#FFFFFF", fontWeight: 500 }}>
                      {searched ? "Nenhum lead encontrado" : "Pronto para buscar"}
                    </p>
                    <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                      {searched
                        ? "Tente ajustar os filtros de localização."
                        : "Defina os filtros acima e clique em Buscar Leads."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProspeccaoView;
