import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";

interface Builder {
  name: string;
  url: string;
  description: string;
  logo: string;
  bg: string;
}

const builders: Builder[] = [
  { name: "Lovable", url: "https://lovable.dev", description: "Apps full-stack com IA", logo: "https://lovable.dev/favicon.ico", bg: "from-pink-500/20 to-purple-500/20" },
  { name: "Bolt.new", url: "https://bolt.new", description: "Builder full-stack instantâneo", logo: "https://bolt.new/favicon.ico", bg: "from-blue-500/20 to-cyan-500/20" },
  { name: "v0 by Vercel", url: "https://v0.dev", description: "UI components com IA", logo: "https://v0.dev/favicon.ico", bg: "from-zinc-500/20 to-slate-500/20" },
  { name: "Replit Agent", url: "https://replit.com", description: "Codifica e roda no navegador", logo: "https://replit.com/public/icons/favicon-32.png", bg: "from-orange-500/20 to-red-500/20" },
  { name: "Cursor", url: "https://cursor.com", description: "IDE com IA integrada", logo: "https://cursor.com/favicon.ico", bg: "from-neutral-500/20 to-zinc-500/20" },
  { name: "Wix ADI", url: "https://www.wix.com/studio/ai-website-builder", description: "Sites prontos com IA", logo: "https://www.wix.com/favicon.ico", bg: "from-yellow-500/20 to-amber-500/20" },
  { name: "Framer AI", url: "https://www.framer.com/ai", description: "Sites visuais animados", logo: "https://framerusercontent.com/images/atXqxn0fE3FeMMRwBnDPgxuTtg.png", bg: "from-blue-600/20 to-indigo-500/20" },
  { name: "Webflow AI", url: "https://webflow.com/ai", description: "No-code visual avançado", logo: "https://webflow.com/favicon.ico", bg: "from-purple-500/20 to-violet-500/20" },
  { name: "Durable", url: "https://durable.co", description: "Site em 30 segundos", logo: "https://durable.co/favicon.ico", bg: "from-emerald-500/20 to-green-500/20" },
  { name: "Hostinger AI", url: "https://www.hostinger.com.br/criador-de-sites", description: "Builder + hospedagem", logo: "https://www.hostinger.com/favicon.ico", bg: "from-violet-500/20 to-fuchsia-500/20" },
  { name: "10Web", url: "https://10web.io", description: "WordPress com IA", logo: "https://10web.io/favicon.ico", bg: "from-sky-500/20 to-blue-500/20" },
  { name: "Mixo", url: "https://mixo.io", description: "Landing pages instantâneas", logo: "https://mixo.io/favicon.ico", bg: "from-rose-500/20 to-pink-500/20" },
  { name: "Hocoos", url: "https://hocoos.com", description: "Site em 5 minutos", logo: "https://hocoos.com/favicon.ico", bg: "from-teal-500/20 to-cyan-500/20" },
  { name: "B12", url: "https://b12.io", description: "Sites profissionais com IA", logo: "https://b12.io/favicon.ico", bg: "from-indigo-500/20 to-blue-500/20" },
  { name: "Jimdo Dolphin", url: "https://www.jimdo.com", description: "Builder guiado por IA", logo: "https://www.jimdo.com/favicon.ico", bg: "from-lime-500/20 to-green-500/20" },
  { name: "Unicorn Platform", url: "https://unicornplatform.com", description: "Landing pages para SaaS", logo: "https://unicornplatform.com/favicon.ico", bg: "from-fuchsia-500/20 to-pink-500/20" },
  { name: "Typedream", url: "https://typedream.com", description: "Notion-like website builder", logo: "https://typedream.com/favicon.ico", bg: "from-amber-500/20 to-orange-500/20" },
  { name: "Dorik AI", url: "https://dorik.com", description: "Sites com IA sem código", logo: "https://dorik.com/favicon.ico", bg: "from-cyan-500/20 to-teal-500/20" },
  { name: "Zyro AI", url: "https://zyro.com", description: "Construtor com IA", logo: "https://zyro.com/favicon.ico", bg: "from-red-500/20 to-rose-500/20" },
  { name: "Builder.ai", url: "https://www.builder.ai", description: "Apps customizados com IA", logo: "https://www.builder.ai/favicon.ico", bg: "from-purple-600/20 to-indigo-600/20" },
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
                <div className="w-10 h-10 rounded-xl bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center overflow-hidden">
                  <img
                    src={builder.logo}
                    alt={`Logo ${builder.name}`}
                    className="w-6 h-6 object-contain"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
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
