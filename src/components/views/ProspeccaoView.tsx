import { useState, useEffect } from "react";
import { Search, MessageCircle, MapPin, Loader2, Phone, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const quickFilters = [
  { label: "Barbearias", emoji: "💈" },
  { label: "Pizzarias", emoji: "🍕" },
  { label: "Hamburguerias", emoji: "🍔" },
  { label: "Manicures", emoji: "💅" },
  { label: "Dentistas", emoji: "🦷" },
  { label: "Clínicas", emoji: "🏥" },
  { label: "Academias", emoji: "🏋️" },
  { label: "Pet Shops", emoji: "🐾" },
  { label: "Restaurantes", emoji: "🍽️" },
  { label: "Mecânicas", emoji: "🔧" },
  { label: "Salões de Beleza", emoji: "💇" },
  { label: "Estética", emoji: "✨" },
  { label: "Imobiliárias", emoji: "🏠" },
  { label: "Advogados", emoji: "⚖️" },
  { label: "Contadores", emoji: "📊" },
  { label: "Escolas de Idiomas", emoji: "🌍" },
  { label: "Padarias", emoji: "🥖" },
  { label: "Farmácias", emoji: "💊" },
  { label: "Óticas", emoji: "👓" },
  { label: "Floricultura", emoji: "🌸" },
  { label: "Lava Jato", emoji: "🚗" },
  { label: "Fotógrafos", emoji: "📸" },
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
  // Matches Brazilian phone formats: (XX) XXXXX-XXXX, (XX) XXXX-XXXX, XX XXXXXXXXX, +55...
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
  if (newWindow) {
    newWindow.opener = null;
  }
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

  // Buscar cidades do IBGE quando o estado muda
  useEffect(() => {
    if (!estado || estado === "todos") {
      setCidades([]);
      setCidade("");
      return;
    }

    const fetchCidades = async () => {
      setLoadingCidades(true);
      setCidade("");
      try {
        const res = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?orderBy=nome`
        );
        const data = await res.json();
        setCidades(data.map((m: any) => m.nome));
      } catch {
        setCidades([]);
      } finally {
        setLoadingCidades(false);
      }
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
    // Query mais limpa — sem termos que poluem resultados
    const query = `${nicho} em ${location}`.trim();

    setLoading(true);
    setSearched(true);
    setResults([]);

    try {
      const response = await firecrawlApi.search(query, {
        limit: 15,
        lang: "pt-br",
        country: "br",
      });

      if (response.success && Array.isArray(response.data)) {
        const mapped: SearchResult[] = (response.data as any[]).map((item: any) => {
          const allText = `${item.description || ""} ${item.markdown || ""}`;
          const phone = extractPhone(allText);
          return {
            url: item.url || "",
            title: item.title || "Sem título",
            description: item.description || "",
            phone,
          };
        });
        setResults(mapped);
        setKey((k) => k + 1);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("search_history").insert({
            user_id: user.id,
            query,
            nicho,
            location,
            results_count: mapped.length,
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

  const handleFilterClick = (label: string) => {
    setActiveFilter(label);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFilter) {
      toast.error("Selecione um nicho antes de buscar");
      return;
    }
    doSearch(activeFilter);
  };

  const extractDomain = (url: string) => {
    try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">Prospecção de Clientes</h2>
        <p className="text-muted-foreground text-sm mt-1">Encontre empresas por nicho, cidade e estado — ideais para prospectar</p>
      </div>

      {/* Filtros de localização */}
      <div className="bg-[#0d0d14]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#cbd5e1] uppercase tracking-wider">Estado</label>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger className="bg-[#0d0d14] border-white/10 h-12 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all">
                  <SelectValue placeholder="Todos os estados" />
                </SelectTrigger>
                <SelectContent className="bg-[#0d0d14] border-white/10 text-white">
                  <SelectItem value="todos">Todos os estados</SelectItem>
                  {estados.map(e => (
                    <SelectItem key={e.sigla} value={e.sigla}>{e.sigla} — {e.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#cbd5e1] uppercase tracking-wider">Cidade</label>
              <Select value={cidade} onValueChange={setCidade} disabled={!estado || estado === "todos" || loadingCidades}>
                <SelectTrigger className="bg-[#0d0d14] border-white/10 h-12 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all">
                  <SelectValue placeholder={loadingCidades ? "Carregando..." : !estado || estado === "todos" ? "Selecione o estado" : "Selecione a cidade"} />
                </SelectTrigger>
                <SelectContent className="bg-[#0d0d14] border-white/10 text-white max-h-60">
                  <SelectItem value="todas">Todas as cidades</SelectItem>
                  {cidades.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button type="submit" variant="neon" disabled={loading} className="w-full h-12 text-base font-black uppercase tracking-widest shimmer-button shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2" />}
                Buscar Leads
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Nichos */}
      <div className="space-y-4">
        <label className="text-[13px] font-bold text-[#cbd5e1] uppercase tracking-wider block">Selecione o nicho</label>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map(({ label, emoji }) => {
            const isSelected = activeFilter === label;
            return (
              <motion.button
                key={label}
                onClick={() => handleFilterClick(label)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.2 }}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2",
                  isSelected
                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                    : "bg-[#0d0d14] border-white/5 text-[#94a3b8] hover:border-white/20 hover:text-white"
                )}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{emoji}</span> {label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Resultados */}
      <div className="glass rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"
            >
              <Search className="w-5 h-5 text-primary" />
            </motion.div>
            <p className="text-muted-foreground text-sm">Buscando leads...</p>
          </div>
        ) : results.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Negócio</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Descrição</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Telefone</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
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
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                        <div>
                          <span className="font-medium text-foreground block">{r.title}</span>
                          <span className="text-xs text-muted-foreground">{extractDomain(r.url)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell max-w-xs truncate">
                      {r.description || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {r.phone ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                          <Phone className="w-3.5 h-3.5 text-green-500" />
                          {r.phone}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const query = encodeURIComponent(r.title);
                            openExternalLink(`https://www.google.com/maps/search/${query}`);
                          }}
                          className="gap-1.5"
                        >
                          <MapPin className="w-3.5 h-3.5" /> Maps
                        </Button>
                        <Button
                          size="sm"
                          variant="hero"
                          onClick={async () => {
                            const phoneNum = r.phone ? r.phone.replace(/\D/g, "") : "";
                            const fullNum = phoneNum.startsWith("55") ? phoneNum : `55${phoneNum}`;
                            const msg = encodeURIComponent(`Olá! Vi seu negócio online e gostaria de apresentar uma proposta. Podemos conversar?`);

                            // Registra lead contatado
                            const { data: { user } } = await supabase.auth.getUser();
                            if (user) {
                              await supabase.from("contacted_leads").insert({
                                user_id: user.id,
                                lead_name: r.title,
                                phone: r.phone,
                                website: extractDomain(r.url),
                                source_url: r.url,
                                status: "contatado",
                              });
                            }

                            openExternalLink(`https://wa.me/${phoneNum ? fullNum : ""}?text=${msg}`);
                          }}
                          className="gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </AnimatePresence>
          </table>
        ) : searched ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <Search className="w-10 h-10 opacity-30" />
            <p className="text-sm">Nenhum resultado encontrado. Tente outro nicho ou região.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <Search className="w-10 h-10 opacity-30" />
            <p className="text-sm">Selecione um nicho e uma região para buscar leads</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProspeccaoView;
