import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";

interface Builder {
  name: string;
  url: string;
  description: string;
  domain: string;
  bg: string;
}

const logoUrl = (domain: string) => `https://logo.clearbit.com/${domain}`;
const fallbackFavicon = (domain: string) => `https://icons.duckduckgo.com/ip3/${domain}.ico`;

const builders: Builder[] = [
  { name: "Lovable", url: "https://lovable.dev", description: "Apps full-stack com IA", domain: "lovable.dev", bg: "from-pink-500/20 to-purple-500/20" },
  { name: "Bolt.new", url: "https://bolt.new", description: "Builder full-stack instantâneo", domain: "bolt.new", bg: "from-blue-500/20 to-cyan-500/20" },
  { name: "v0 by Vercel", url: "https://v0.dev", description: "UI components com IA", domain: "v0.dev", bg: "from-zinc-500/20 to-slate-500/20" },
  { name: "Replit Agent", url: "https://replit.com", description: "Codifica e roda no navegador", domain: "replit.com", bg: "from-orange-500/20 to-red-500/20" },
  { name: "Cursor", url: "https://cursor.com", description: "IDE com IA integrada", domain: "cursor.com", bg: "from-neutral-500/20 to-zinc-500/20" },
  { name: "Wix ADI", url: "https://www.wix.com/studio/ai-website-builder", description: "Sites prontos com IA", domain: "wix.com", bg: "from-yellow-500/20 to-amber-500/20" },
  { name: "Framer AI", url: "https://www.framer.com/ai", description: "Sites visuais animados", domain: "framer.com", bg: "from-blue-600/20 to-indigo-500/20" },
  { name: "Webflow AI", url: "https://webflow.com/ai", description: "No-code visual avançado", domain: "webflow.com", bg: "from-purple-500/20 to-violet-500/20" },
  { name: "Durable", url: "https://durable.co", description: "Site em 30 segundos", domain: "durable.co", bg: "from-emerald-500/20 to-green-500/20" },
  { name: "Hostinger AI", url: "https://www.hostinger.com.br/criador-de-sites", description: "Builder + hospedagem", domain: "hostinger.com", bg: "from-violet-500/20 to-fuchsia-500/20" },
  { name: "10Web", url: "https://10web.io", description: "WordPress com IA", domain: "10web.io", bg: "from-sky-500/20 to-blue-500/20" },
  { name: "Mixo", url: "https://mixo.io", description: "Landing pages instantâneas", domain: "mixo.io", bg: "from-rose-500/20 to-pink-500/20" },
  { name: "Hocoos", url: "https://hocoos.com", description: "Site em 5 minutos", domain: "hocoos.com", bg: "from-teal-500/20 to-cyan-500/20" },
  { name: "B12", url: "https://b12.io", description: "Sites profissionais com IA", domain: "b12.io", bg: "from-indigo-500/20 to-blue-500/20" },
  { name: "Jimdo Dolphin", url: "https://www.jimdo.com", description: "Builder guiado por IA", domain: "jimdo.com", bg: "from-lime-500/20 to-green-500/20" },
  { name: "Unicorn Platform", url: "https://unicornplatform.com", description: "Landing pages para SaaS", domain: "unicornplatform.com", bg: "from-fuchsia-500/20 to-pink-500/20" },
  { name: "Typedream", url: "https://typedream.com", description: "Notion-like website builder", domain: "typedream.com", bg: "from-amber-500/20 to-orange-500/20" },
  { name: "Dorik AI", url: "https://dorik.com", description: "Sites com IA sem código", domain: "dorik.com", bg: "from-cyan-500/20 to-teal-500/20" },
  { name: "Zyro AI", url: "https://zyro.com", description: "Construtor com IA", domain: "zyro.com", bg: "from-red-500/20 to-rose-500/20" },
  { name: "Builder.ai", url: "https://www.builder.ai", description: "Apps customizados com IA", domain: "builder.ai", bg: "from-purple-600/20 to-indigo-600/20" },
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
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${builder.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden p-1.5">
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
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{builder.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{builder.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default AIBuildersGrid;
