import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <span className="text-xl font-bold gradient-text">Meu App</span>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Entrar
            </Button>
            <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
              Começar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center space-y-8">
        <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary border border-primary/20">
          ✨ Em construção
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
          Hoje incrível está{" "}
          <span className="gradient-text">chegando</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Estamos construindo algo especial. Crie sua conta e seja o primeiro a saber quando lançarmos.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="hero" size="lg" onClick={() => navigate("/auth")}>
            Criar conta
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/auth")}>
            Entrar
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Rápido", desc: "Performance otimizada para a melhor experiência." },
            { icon: Shield, title: "Seguro", desc: "Seus dados protegidos com criptografia." },
            { icon: Sparkles, title: "Moderno", desc: "Interface limpa e intuitiva." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-6 space-y-3 hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        © 2026 Meu App. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Index;
