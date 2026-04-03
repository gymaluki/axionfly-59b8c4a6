import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, BookOpen, Code2, Check, Sparkles } from "lucide-react";

const DashboardMockup = () => (
  <div className="relative mx-auto max-w-2xl">
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl">
      {/* Browser bar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-secondary rounded-md px-4 py-1 text-xs text-muted-foreground">app.seusite.com/dashboard</div>
        </div>
      </div>
      {/* Mock content */}
      <div className="p-6 space-y-4">
        <div className="flex gap-4">
          <div className="w-1/4 space-y-3">
            <div className="h-3 w-full rounded bg-primary/20" />
            <div className="h-3 w-3/4 rounded bg-primary/10" />
            <div className="h-3 w-full rounded bg-primary/10" />
            <div className="h-3 w-2/3 rounded bg-primary/10" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-border/50" />
              <div className="flex-1 h-20 rounded-lg bg-gradient-to-br from-accent/20 to-primary/10 border border-border/50" />
              <div className="flex-1 h-20 rounded-lg bg-gradient-to-br from-primary/10 to-accent/20 border border-border/50" />
            </div>
            <div className="h-32 rounded-lg bg-secondary/50 border border-border/50" />
          </div>
        </div>
      </div>
    </div>
    {/* Glow behind */}
    <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-r from-primary/20 via-transparent to-accent/20 blur-2xl" />
  </div>
);

const features = [
  {
    icon: MapPin,
    title: "Prospecção Maps",
    desc: "Encontre clientes ideais usando dados do Google Maps. Busque por nicho e região em segundos.",
  },
  {
    icon: BookOpen,
    title: "Gerador de E-books",
    desc: "Crie e-books profissionais com IA. Gere conteúdo completo pronto para vender ou distribuir.",
  },
  {
    icon: Code2,
    title: "Fábrica de Sites",
    desc: "Gere prompts profissionais para criar sites completos no Lovable com um clique.",
  },
];

const pricingFeatures = [
  "Prospecção Maps ilimitada",
  "Gerador de E-books com IA",
  "Fábrica de Sites (Prompts)",
  "Suporte prioritário",
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <span className="text-xl font-bold gradient-text">ScaleAI</span>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Entrar
            </Button>
            <Button variant="neon" size="sm" onClick={() => navigate("/auth")}>
              Começar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-28 text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          Automatize & Escale com IA
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
          Escale seu negócio digital com{" "}
          <span className="gradient-text">IA & Automação</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Prospecte clientes, gere e-books e crie sites profissionais — tudo em uma plataforma.
          Ferramentas que trabalham por você 24/7.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="neon" size="lg" onClick={() => navigate("/auth")}>
            Começar Agora
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg" onClick={() => {
            document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
          }}>
            Ver Planos
          </Button>
        </div>
        <div className="pt-8 hidden md:block">
          <DashboardMockup />
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Tudo que você precisa em <span className="gradient-text">um só lugar</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Três ferramentas poderosas para acelerar seu negócio digital.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass rounded-2xl p-6 space-y-4 hover:neon-border transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Planos <span className="gradient-text">simples</span>
          </h2>
          <p className="text-muted-foreground">Escolha o plano ideal e comece hoje.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Mensal */}
          <div className="glass rounded-2xl p-8 space-y-6 flex flex-col">
            <div>
              <h3 className="text-xl font-bold text-foreground">Mensal</h3>
              <p className="text-muted-foreground text-sm mt-1">Acesso completo, cancele quando quiser.</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-foreground">R$ 147</span>
              <span className="text-muted-foreground">/ mês</span>
            </div>
            <ul className="space-y-3 flex-1">
              {pricingFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <a href="">Assinar Agora</a>
            </Button>
          </div>

          {/* Vitalício */}
          <div className="relative glass rounded-2xl p-8 space-y-6 flex flex-col neon-border">
            <div className="absolute -top-3 right-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              Melhor Valor
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Vitalício</h3>
              <p className="text-muted-foreground text-sm mt-1">Pague uma vez, use para sempre.</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black gradient-text">R$ 247</span>
              <span className="text-muted-foreground">/ único</span>
            </div>
            <ul className="space-y-3 flex-1">
              {pricingFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  {f}
                </li>
              ))}
              <li className="flex items-center gap-2 text-sm text-foreground font-medium">
                <Check className="w-4 h-4 text-accent shrink-0" />
                Acesso vitalício a atualizações
              </li>
            </ul>
            <Button variant="neon" size="lg" className="w-full" asChild>
              <a href="">Assinar Agora</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        © 2026 ScaleAI. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Index;
