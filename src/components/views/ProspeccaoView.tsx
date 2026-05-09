import { useState, useEffect } from "react";
import {
  Search, MessageCircle, MapPin, Loader2, Phone, Zap, RotateCcw,
  Radar, Map, Building2, Check,
  Scissors, Pizza, Beef, Sparkles, Stethoscope, HeartPulse, Dumbbell, PawPrint,
  UtensilsCrossed, Wrench, Brush, Wand2, Home, Scale, Calculator, Globe2,
  Croissant, Pill, Glasses, Flower2, CarFront, Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const quickFilters = [
  { label: "Barbearias", icon: Scissors, leads: "2.4k" },
  { label: "Pizzarias", icon: Pizza, leads: "1.8k" },
  { label: "Hamburguerias", icon: Beef, leads: "1.2k" },
  { label: "Manicures", icon: Sparkles, leads: "3.1k" },
  { label: "Dentistas", icon: Stethoscope, leads: "4.5k" },
  { label: "Clínicas", icon: HeartPulse, leads: "2.7k" },
  { label: "Academias", icon: Dumbbell, leads: "1.9k" },
  { label: "Pet Shops", icon: PawPrint, leads: "1.4k" },
  { label: "Restaurantes", icon: UtensilsCrossed, leads: "5.2k" },
  { label: "Mecânicas", icon: Wrench, leads: "2.1k" },
  { label: "Salões de Beleza", icon: Brush, leads: "3.8k" },
  { label: "Estética", icon: Wand2, leads: "2.9k" },
  { label: "Imobiliárias", icon: Home, leads: "1.6k" },
  { label: "Advogados", icon: Scale, leads: "3.3k" },
  { label: "Contadores", icon: Calculator, leads: "1.1k" },
  { label: "Escolas de Idiomas", icon: Globe2, leads: "0.9k" },
  { label: "Padarias", icon: Croissant, leads: "2.6k" },
  { label: "Farmácias", icon: Pill, leads: "2.0k" },
  { label: "Óticas", icon: Glasses, leads: "0.8k" },
  { label: "Floricultura", icon: Flower2, leads: "0.6k" },
  { label: "Lava Jato", icon: CarFront, leads: "1.3k" },
  { label: "Fotógrafos", icon: Camera, leads: "1.0k" },
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
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

const staggerItem = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  }),
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
    const loadState = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const storageKey = `prospeccao-view-state-${user.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const state = JSON.parse(saved);
          setCidade(state.cidade || "");
          setEstado(state.estado || "");
          setActiveFilter(state.activeFilter || "");
          setResults(state.results || []);
          setSearched(state.searched || false);
        } catch (e) { console.error(e); }
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    const saveState = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const storageKey = `prospeccao-view-state-${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify({ cidade, estado, activeFilter, results, searched }));
    };
    saveState();
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFilter) { toast.error("Selecione um nicho antes de buscar"); return; }
    doSearch(activeFilter);
  };

  const extractDomain = (url: string) => {
    try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 0) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    }),
  };

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-8">
      {/* HERO */}
      <motion.div
        custom={0}
        variants={fadeUp}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0d1230] via-[#0a0a18] to-[#0a0a0f] p-6 md:p-10"
      >
        {/* Background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(79,110,247,0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#4f6ef7]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-[#7b5cff]/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-5">
            {/* Animated radar icon */}
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="relative shrink-0"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4f6ef7] to-[#7b5cff] flex items-center justify-center shadow-[0_0_40px_rgba(79,110,247,0.5)]">
                <Radar className="w-8 h-8 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-2xl border-2 border-[#4f6ef7]"
              />
              <motion.div
                animate={{ scale: [1, 1.9, 1.9], opacity: [0.4, 0, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                className="absolute inset-0 rounded-2xl border-2 border-[#4f6ef7]"
              />
            </motion.div>

            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-black tracking-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#60a5fa] via-[#4f6ef7] to-[#a78bfa]">
                  Encontre seus próximos clientes
                </span>
              </motion.h1>
              <p className="text-[#9ca3af] text-sm md:text-base mt-2 font-medium">
                Busque empresas reais por nicho e região — pronto pra prospectar
              </p>
            </div>
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
              className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </Button>
          )}
        </div>
      </motion.div>

      {/* FILTROS DE LOCALIZAÇÃO — Glassmorphism */}
      <motion.form
        custom={1}
        variants={fadeUp}
        onSubmit={handleSearch}
        className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.3)] space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Estado */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-[0.1em] flex items-center gap-2">
              <Map className="w-3.5 h-3.5 text-[#4f6ef7]" /> Estado
            </label>
            <Select value={estado} onValueChange={(v) => { setEstado(v); setCidade(""); }}>
              <SelectTrigger className="h-12 bg-white/[0.04] border-white/10 hover:border-[#4f6ef7]/50 focus:border-[#4f6ef7] focus:ring-4 focus:ring-[#4f6ef7]/20 transition-all duration-300 rounded-xl">
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

          {/* Cidade — slide-down quando estado escolhido */}
          <AnimatePresence mode="wait">
            {estado && estado !== "todos" ? (
              <motion.div
                key="cidade-field"
                initial={{ opacity: 0, y: -12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -12, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-2"
              >
                <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-[0.1em] flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#4f6ef7]" /> Cidade
                </label>
                <Select value={cidade} onValueChange={setCidade} disabled={loadingCidades}>
                  <SelectTrigger className="h-12 bg-white/[0.04] border-white/10 hover:border-[#4f6ef7]/50 focus:border-[#4f6ef7] focus:ring-4 focus:ring-[#4f6ef7]/20 transition-all duration-300 rounded-xl">
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
                <label className="text-[11px] font-bold text-[#9ca3af]/40 uppercase tracking-[0.1em] flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" /> Cidade
                </label>
                <div className="h-12 rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center px-3 text-sm text-[#6b7280]">
                  Selecione um estado primeiro
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.form>

      {/* SELEÇÃO DE NICHO — Grid de cards */}
      <motion.div custom={2} variants={fadeUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-[0.1em]">
            Selecione o nicho
          </label>
          {activeFilter && (
            <span className="text-xs text-[#4f6ef7] font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> {activeFilter}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {quickFilters.map(({ label, icon: Icon, leads }, idx) => {
            const isSelected = activeFilter === label;
            return (
              <motion.button
                key={label}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter(label)}
                className={cn(
                  "group relative text-left p-4 rounded-xl border transition-all duration-300",
                  isSelected
                    ? "border-[#4f6ef7] bg-[#4f6ef7]/15 shadow-[0_0_24px_rgba(79,110,247,0.35)]"
                    : "border-white/10 bg-white/[0.03] hover:border-[#4f6ef7]/60 hover:bg-white/[0.05] hover:shadow-[0_0_20px_rgba(79,110,247,0.25)]"
                )}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#4f6ef7] flex items-center justify-center shadow-[0_0_12px_rgba(79,110,247,0.7)]"
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </motion.div>
                )}
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-colors",
                  isSelected ? "bg-[#4f6ef7]/30 text-[#a3b8ff]" : "bg-white/5 text-[#9ca3af] group-hover:text-[#4f6ef7]"
                )}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="font-bold text-sm text-white leading-tight">{label}</div>
                <div className="text-[11px] text-[#6b7280] mt-1 font-medium">{leads} leads</div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* BOTÃO BUSCAR LEADS — full width, shimmer */}
      <motion.div custom={3} variants={fadeUp}>
        <button
          onClick={handleSearch as any}
          disabled={loading}
          className={cn(
            "shimmer-button relative w-full h-14 rounded-2xl font-bold text-base tracking-wide",
            "bg-gradient-to-r from-[#4f6ef7] via-[#5b7af9] to-[#7b5cff]",
            "text-white shadow-[0_0_30px_rgba(79,110,247,0.45)]",
            "hover:shadow-[0_0_40px_rgba(79,110,247,0.65)] hover:scale-[1.01] active:scale-[0.99]",
            "transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed",
            "flex items-center justify-center gap-3 overflow-hidden"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Buscando leads...</span>
            </>
          ) : (
            <>
              <motion.span
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap className="w-5 h-5 fill-white" />
              </motion.span>
              <span>Buscar Leads Agora</span>
            </>
          )}
        </button>
      </motion.div>

      {/* RESULTADOS */}
      <motion.div custom={4} variants={fadeUp}>
        {results.length > 0 ? (
          <div className="bg-[#0f0f1f]/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.1em]">Negócio</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.1em] hidden lg:table-cell">Descrição</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.1em]">Telefone</th>
                  <th className="text-right px-6 py-4 text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.1em]">Ações</th>
                </tr>
              </thead>
              <AnimatePresence mode="wait">
                <motion.tbody key={key}>
                  {results.map((r, i) => (
                    <motion.tr
                      key={r.url + i}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={staggerItem}
                      className="border-b border-white/5 hover:bg-[#4f6ef7]/5 transition-all duration-200 group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-[#4f6ef7]/10 text-[#4f6ef7] shrink-0">
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
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-white bg-green-500/5 px-3 py-1.5 rounded-lg border border-green-500/20">
                            <Phone className="w-3.5 h-3.5 text-green-500" />
                            {r.phone}
                          </span>
                        ) : (
                          <span className="text-xs text-[#475569] font-medium">—</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm" variant="outline"
                            onClick={() => openExternalLink(`https://www.google.com/maps/search/${encodeURIComponent(r.title)}`)}
                            className="gap-2 font-bold border-white/10 hover:bg-white/5"
                          >
                            <MapPin className="w-3.5 h-3.5" /> Maps
                          </Button>
                          <Button
                            size="sm" variant="neon"
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
                            className="gap-2 font-black uppercase text-[10px] tracking-widest shadow-[0_0_15px_rgba(79,110,247,0.3)]"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" /> WhatsApp
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </AnimatePresence>
            </table>
          </div>
        ) : searched && !loading ? (
          <div className="bg-[#0f0f1f]/80 border border-white/10 rounded-2xl flex flex-col items-center justify-center py-20 text-[#64748b] gap-4">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <Search className="w-10 h-10 opacity-20" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-white">Nenhum lead encontrado</p>
              <p className="text-sm">Tente mudar o nicho ou buscar em outra cidade/estado.</p>
            </div>
          </div>
        ) : (
          /* Estado vazio — radar pulsando + skeleton ghost cards */
          <div className="space-y-6">
            <div className="relative bg-gradient-to-b from-[#0f0f1f]/80 to-[#0a0a18]/80 border border-white/10 rounded-2xl py-16 px-6 overflow-hidden">
              {/* Radar */}
              <div className="relative flex flex-col items-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [0.4, 1.4], opacity: [0.7, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full border-2 border-[#4f6ef7]"
                    />
                  ))}
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#4f6ef7] to-[#7b5cff] flex items-center justify-center shadow-[0_0_40px_rgba(79,110,247,0.6)]"
                  >
                    <Radar className="w-7 h-7 text-white" />
                  </motion.div>
                </div>
                <div className="text-center space-y-2 max-w-md">
                  <p className="text-lg font-black text-white tracking-tight">
                    Pronto pra encontrar seus próximos clientes
                  </p>
                  <p className="text-sm text-[#9ca3af] font-medium leading-relaxed">
                    Selecione um nicho e a região acima, depois clique em <span className="text-[#4f6ef7] font-bold">Buscar Leads</span> pra começar.
                  </p>
                </div>
              </div>
            </div>

            {/* Ghost skeleton cards */}
            <div className="space-y-3 opacity-30">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-4 shimmer"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                    <div className="h-2.5 bg-white/5 rounded w-2/3" />
                  </div>
                  <div className="w-24 h-8 bg-white/5 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProspeccaoView;
