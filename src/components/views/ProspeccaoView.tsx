import { useState } from "react";
import { Search, MessageCircle, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const quickFilters = [
  { label: "Barbearias", emoji: "💈" },
  { label: "Pizzarias", emoji: "🍕" },
  { label: "Manicures", emoji: "💅" },
  { label: "Dentistas", emoji: "🦷" },
  { label: "Academias", emoji: "🏋️" },
];

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
    transition: { delay: i * 0.08, duration: 0.4, ease: [0, 0, 0.2, 1] as [number, number, number, number] },
  }),
};

const GoogleMapsLogo = () => (
  <svg viewBox="0 0 92.3 132.3" className="w-5 h-5 shrink-0">
    <path fill="#1a73e8" d="M60.2 2.2C55.8.8 51 0 46.1 0 32 0 19.3 6.4 10.8 16.5l21.8 18.3L60.2 2.2z" />
    <path fill="#ea4335" d="M10.8 16.5C4.1 24.5 0 34.9 0 46.1c0 8.7 1.7 15.7 4.6 22l28-33.3-21.8-18.3z" />
    <path fill="#4285f4" d="M46.2 28.5c9.8 0 17.7 7.9 17.7 17.7 0 4.3-1.6 8.3-4.2 11.4 0 0 13.9-16.6 27.5-32.7-5.6-10.8-15.3-19-27-22.7L32.6 34.8c3.3-3.8 8.1-6.3 13.6-6.3z" />
    <path fill="#fbbc04" d="M46.2 63.8c-9.8 0-17.7-7.9-17.7-17.7 0-4.3 1.5-8.3 4.1-11.3l-28 33.3c4.8 10.6 12.8 19.2 21 29.9l34.1-40.5c-3.3 3.9-8.1 6.3-13.5 6.3z" />
    <path fill="#34a853" d="M59.1 109.2c15.4-24.1 33.3-35 33.3-63 0-7.7-1.9-14.9-5.2-21.3L25.6 98c2.6 3.4 5.3 7.3 7.9 11.3 9.4 14.5 6.8 23.1 12.8 23.1s3.4-8.7 12.8-23.2z" />
  </svg>
);

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
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Prospecção de Clientes</h2>
          <p className="text-muted-foreground text-sm mt-1">Encontre leads qualificados via Google Maps</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
          <GoogleMapsLogo />
          <span className="text-xs text-muted-foreground font-medium">Powered by Google Maps</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar região... Ex: São Paulo, Centro" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary/50 border-border h-11" />
      </div>

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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-medium text-foreground">{r.name}</span>
                    </div>
                  </td>
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
