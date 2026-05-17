import { Header } from "@/components/ui/header-3";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Key, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ExtensionPage = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [extensionToken, setExtensionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLicense = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth?redirect=/extensao", { replace: true });
          return;
        }
        const { data, error } = await supabase.rpc('claim_hyperbuild_license');
        if (error) throw error;
        if (data && data.length > 0) {
          setExtensionToken(data[0].license_key);
        }
      } catch (err: any) {
        console.error("Error claiming license:", err);
        toast.error(err.message || "Erro ao obter sua licença.");
      } finally {
        setLoading(false);
      }
    };
    getLicense();
  }, [navigate]);

  const handleCopyToken = () => {
    if (!extensionToken) return;
    navigator.clipboard.writeText(extensionToken);
    setCopied(true);
    toast.success("Token copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Extensão <span className="gradient-text">Lovable Infinito</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Siga os passos abaixo para instalar a extensão e liberar a criação ilimitada de sites.
            </p>
          </div>

          <div className="grid gap-6">
            {/* Step 1: Download */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                  <div>
                    <CardTitle>Baixar Extensão</CardTitle>
                    <CardDescription>Faça o download do arquivo da extensão Hyperbuild Pro.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full gap-2 h-12 text-lg font-bold"
                  onClick={() => {
                    fetch("/hyperbuild-pro.zip")
                      .then((res) => {
                        if (!res.ok) throw new Error(`Falha no download: ${res.status}`);
                        return res.blob();
                      })
                      .then((blob) => {
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(blob);
                        a.download = "HyperBuild-Pro-v6.9.0.zip";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(a.href);
                        toast.success("Download iniciado!");
                      })
                      .catch((err) => toast.error(err.message));
                  }}
                >
                  <Download className="w-5 h-5" />
                  Baixar Extensão (.zip)
                </Button>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Após baixar, extraia o arquivo e carregue na página de extensões do seu navegador (Modo Desenvolvedor).
                </p>
              </CardContent>
            </Card>

            {/* Step 2: Token */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                  <div>
                    <CardTitle>Seu Token de Acesso</CardTitle>
                    <CardDescription>Use este token dentro da extensão para ativar sua parceria.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-secondary/50 rounded-lg border border-border font-mono text-lg justify-between overflow-hidden min-h-[64px]">
                  {loading ? (
                    <div className="w-24 h-4 bg-primary/20 animate-pulse rounded" />
                  ) : extensionToken ? (
                    <>
                      <span className="truncate">{extensionToken}</span>
                      <Button variant="ghost" size="icon" onClick={handleCopyToken} className="shrink-0">
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                      </Button>
                    </>
                  ) : (
                    <span className="text-sm text-destructive font-sans">Sem licenças disponíveis</span>
                  )}
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex gap-3">
                  <Key className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Este token é único e vinculado à sua conta AxionFly. Não compartilhe com terceiros.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExtensionPage;
