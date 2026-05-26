import { ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import logo from "@/assets/axionfly-logo-x.png";

interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
}

export default function LegalLayout({ eyebrow, title, description, updatedAt, sections }: LegalLayoutProps) {
  useEffect(() => {
    document.title = `${title} — AxionFly`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen bg-[#050709] text-foreground overflow-x-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(30,58,138,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent,_#050709_85%)]" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/5 bg-[#050709]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="AxionFly" className="h-7 w-auto" loading="eager" decoding="async" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#94a3b8] hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao site
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="px-5 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-10 sm:pb-14">
          <div className="max-w-4xl mx-auto">
            <nav className="flex items-center gap-1.5 text-xs text-[#64748b] mb-5 flex-wrap">
              <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#94a3b8]">{eyebrow}</span>
            </nav>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] bg-primary/10 text-primary border border-primary/20">
              {eyebrow}
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1]">
              {title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-2xl">
              {description}
            </p>
            <p className="mt-5 text-xs text-[#64748b]">Última atualização: {updatedAt}</p>
          </div>
        </section>

        {/* Body */}
        <section className="px-5 sm:px-6 lg:px-8 pb-20 sm:pb-28">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
            {/* Sidebar TOC */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#64748b] mb-3 px-2">
                  Conteúdo
                </p>
                <nav className="flex flex-col">
                  {sections.map((s, i) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="group flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-[#94a3b8] hover:text-foreground hover:bg-white/5 transition-colors"
                    >
                      <span className="text-[10px] font-mono text-[#475569] group-hover:text-primary transition-colors w-5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="leading-tight">{s.title}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <article className="min-w-0">
              <div className="space-y-8 sm:space-y-10">
                {sections.map((s, i) => (
                  <section
                    key={s.id}
                    id={s.id}
                    className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 sm:p-8 scroll-mt-24"
                  >
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-[11px] font-mono text-primary">{String(i + 1).padStart(2, "0")}</span>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{s.title}</h2>
                    </div>
                    <div className="prose-legal text-[#cbd5e1] text-[15px] leading-relaxed space-y-3">
                      {s.content}
                    </div>
                  </section>
                ))}
              </div>

              {/* Contact card */}
              <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
                <h3 className="text-lg font-bold">Ainda tem dúvidas?</h3>
                <p className="mt-2 text-sm text-[#94a3b8]">
                  Nossa equipe está disponível para ajudar com qualquer dúvida sobre a plataforma e estas informações.
                </p>
                <a
                  href="mailto:contato@axionfly.site"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  Falar com o suporte
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-xs">
                <Link to="/legal" className="px-3 py-1.5 rounded-full border border-white/10 hover:border-primary/40 hover:text-primary text-[#94a3b8] transition-colors">Legal</Link>
                <Link to="/termos" className="px-3 py-1.5 rounded-full border border-white/10 hover:border-primary/40 hover:text-primary text-[#94a3b8] transition-colors">Termos de Uso</Link>
                <Link to="/privacidade" className="px-3 py-1.5 rounded-full border border-white/10 hover:border-primary/40 hover:text-primary text-[#94a3b8] transition-colors">Privacidade</Link>
                <Link to="/cookies" className="px-3 py-1.5 rounded-full border border-white/10 hover:border-primary/40 hover:text-primary text-[#94a3b8] transition-colors">Cookies</Link>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-[#050709]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#64748b]">© 2025 AxionFly. Todos os direitos reservados.</p>
          <Link to="/" className="text-xs text-[#94a3b8] hover:text-foreground transition-colors">
            axionfly.site
          </Link>
        </div>
      </footer>
    </div>
  );
}
