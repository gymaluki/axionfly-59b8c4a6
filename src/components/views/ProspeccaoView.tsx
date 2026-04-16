import { useState, useEffect } from "react";
import { Search, MessageCircle, MapPin, Loader2, Phone } from "lucide-react";
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
import { toast } from "sonner";

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
  const [searchMode, setSearchMode] = useState<"sem_site" | "site_ruim" | "sem_redes" | "geral">("sem_site");
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
    
    let queryFilter = "";
    switch (searchMode) {
      case "sem_site":
        queryFilter = `sem site OR "não possui site" OR "sem website"`;
        break;
      case "site_ruim":
        queryFilter = `site desatualizado OR "site antigo" OR "site ruim" OR "precisa de site novo"`;
        break;
      case "sem_redes":
        queryFilter = `sem instagram OR "sem redes sociais" OR "não tem instagram" OR "sem facebook"`;
        break;
      case "geral":
        queryFilter = "";
        break;
    }
    
    const query = `${nicho} em ${location} ${queryFilter} Google Maps contato telefone`.trim();

    setLoading(true);
    setSearched(true);
    setResults([]);

    try {
      const response = await firecrawlApi.search(query, {
        limit: 15,
        lang: "pt-br",
        country: "br",
        scrapeOptions: { formats: ["markdown"] },
      });

      if (response.success && response.data) {
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
      } else {
        toast.error(response.error || "Erro na busca");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao buscar leads. Verifique a conexão com o Firecrawl.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (label: string) => {
    setActiveFilter(label);
    // Apenas seleciona o nicho, não busca automaticamente
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filter = activeFilter || "negócios";
    if (!estado || estado === "todos") {
      // Busca em todo o Brasil
      doSearch(filter);
    } else {
      doSearch(filter);
    }
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
        <p className="text-muted-foreground text-sm mt-1">Encontre empresas sem site ou com sites ruins por nicho, cidade e estado — ideais para prospectar</p>
      </div>

      {/* Filtros de localização */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Estado</label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="bg-secondary/50 border-border h-10">
                <SelectValue placeholder="Todos os estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os estados</SelectItem>
                {estados.map(e => (
                  <SelectItem key={e.sigla} value={e.sigla}>{e.sigla} — {e.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Cidade</label>
            <Select value={cidade} onValueChange={setCidade} disabled={!estado || estado === "todos" || loadingCidades}>
              <SelectTrigger className="bg-secondary/50 border-border h-10">
                <SelectValue placeholder={loadingCidades ? "Carregando cidades..." : !estado || estado === "todos" ? "Selecione um estado primeiro" : "Selecione a cidade"} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="todas">Todas as cidades</SelectItem>
                {cidades.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="neon" disabled={loading || !activeFilter} className="w-full h-10">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Buscar Leads
            </Button>
          </div>
        </div>
      </form>

      {/* Nichos */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">Selecione o nicho</label>
        <div className="flex flex-wrap gap-2">
          {quickFilters.map(({ label, emoji }) => (
            <motion.button
              key={label}
              onClick={() => handleFilterClick(label)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                activeFilter === label
                  ? "bg-primary text-primary-foreground glow-purple"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              <span>{emoji}</span> {label}
            </motion.button>
          ))}
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
                          onClick={() => {
                            const phoneNum = r.phone ? r.phone.replace(/\D/g, "") : "";
                            const fullNum = phoneNum.startsWith("55") ? phoneNum : `55${phoneNum}`;
                            const msg = encodeURIComponent(`Olá! Vi seu negócio online e gostaria de apresentar uma proposta. Podemos conversar?`);
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
