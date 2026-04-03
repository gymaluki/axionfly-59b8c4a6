import { useState } from "react";
import { Search, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const quickFilters = ["Barbearias", "Pizzarias", "Manicures", "Dentistas", "Academias"];

const mockResults = [
  { name: "Barbearia Premium", address: "Rua Augusta, 1200 - São Paulo", rating: 4.8 },
  { name: "Studio Hair & Co", address: "Av. Paulista, 900 - São Paulo", rating: 4.6 },
  { name: "Barber Kings", address: "Rua Oscar Freire, 340 - São Paulo", rating: 4.9 },
  { name: "Corte & Arte", address: "Rua Consolação, 2100 - São Paulo", rating: 4.3 },
  { name: "Dom Barber", address: "Av. Rebouças, 500 - São Paulo", rating: 4.7 },
];

const staggerItem = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

const ProspeccaoView = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Barbearias");
  const [key, setKey] = useState(0);

  const handleFilterClick = (f: string) => {
    setActiveFilter(f);
    setKey((k) => k + 1);
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
        <p className="text-muted-foreground text-sm mt-1">Encontre leads qualificados via Google Maps</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar região... Ex: São Paulo, Centro" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary/50 border-border h-11" />
      </div>

      <div className="flex flex-wrap gap-2">
        {quickFilters.map((f) => (
          <motion.button
            key={f}
            onClick={() => handleFilterClick(f)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === f
                ? "bg-primary text-primary-foreground glow-purple"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            {f}
          </motion.button>
        ))}
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Negócio</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Endereço</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avaliação</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ação</th>
            </tr>
          </thead>
          <AnimatePresence mode="wait">
            <motion.tbody key={key}>
              {mockResults.map((r, i) => (
                <motion.tr
                  key={r.name}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={staggerItem}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{r.address}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-sm text-accent font-medium">
                      <Star className="w-3.5 h-3.5 fill-accent" /> {r.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="hero" className="gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>
    </motion.div>
  );
};

export default ProspeccaoView;
