import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Sparkles } from "lucide-react";

const STORAGE_KEY = "axionfly_extension_v690_notice_dismissed";

const ExtensionUpdateNotice = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const t = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const handleDownload = () => {
    dismiss();
    navigate("/extensao");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(); }}>
      <DialogContent className="max-w-md border-primary/30">
        <DialogHeader>
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-2">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl font-black">
            Nova versão da Extensão disponível!
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Lançamos a <span className="text-primary font-bold">HyperBuild Pro v6.9.0</span> com melhorias e correções importantes.
            Se você ainda não instalou esta versão, baixe agora para continuar usando a Lovable com créditos infinitos sem interrupções.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-col gap-2 pt-2">
          <Button onClick={handleDownload} variant="neon" size="lg" className="w-full gap-2">
            <Download className="w-4 h-4" />
            Baixar v6.9.0 agora
          </Button>
          <Button onClick={dismiss} variant="ghost" size="sm" className="w-full">
            Já instalei / lembrar depois
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionUpdateNotice;
