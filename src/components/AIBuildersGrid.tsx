import { motion } from "framer-motion";
import { ExternalLink, Sparkles, Crown } from "lucide-react";

interface Builder {
  name: string;
  url: string;
  description: string;
  domain: string;
  bg: string;
  recommended?: boolean;
}

const logoUrl = (domain: string) => `https://logo.clearbit.com/${domain}`;
const fallbackFavicon = (domain: string) => `https://icons.duckduckgo.com/ip3/${domain}.ico`;

const builders: Builder[] = [
  { name: "Lovable", url: "https://lovable.dev", description: "Apps full-stack com IA — nossa recomendação", domain: "lovable.dev", bg: "from-pink-500/30 to-purple-500/30", recommended: true },
];

export const AIBuildersGrid = () => {
  return (
    <section className="mt-16 pt-12 border-t border-border">
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">Outras ferramentas de IA</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Plataformas de IA para criar sites
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Conheça as principais ferramentas do mercado. Clique em qualquer uma para abrir e começar a criar.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {builders.map((builder, i) => (
          <motion.a
            key={builder.name}
            href={builder.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`group relative overflow-hidden rounded-2xl border bg-card p-5 transition-colors ${
              builder.recommended
                ? "border-primary/60 ring-2 ring-primary/40 shadow-[0_0_30px_-10px_hsl(var(--primary)/0.6)] hover:border-primary"
                : "border-border hover:border-primary/40"
            }`}
          >
            {builder.recommended && (
              <div className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-lg">
                <Crown className="w-3 h-3" />
                MAIS ESCOLHIDO
              </div>
            )}
            <div className={`absolute inset-0 bg-gradient-to-br ${builder.bg} ${builder.recommended ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center overflow-hidden p-1.5">
                  <img
                    src={logoUrl(builder.domain)}
                    alt={`Logo ${builder.name}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = "1";
                        img.src = fallbackFavicon(builder.domain);
                      } else {
                        img.style.display = "none";
                        const parent = img.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-sm font-bold text-foreground">${builder.name.charAt(0)}</span>`;
                        }
                      }
                    }}
                  />
                </div>
                <ExternalLink className={`w-4 h-4 transition-colors ${builder.recommended ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1 flex items-center gap-1.5">
                {builder.name}
                {builder.recommended && <Crown className="w-3 h-3 text-primary fill-primary" />}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{builder.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default AIBuildersGrid;
