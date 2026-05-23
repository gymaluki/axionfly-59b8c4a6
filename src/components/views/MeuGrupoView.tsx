import { motion } from "framer-motion";
import { Users, MessageCircle, Mail, Phone, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "14997792007";
const WHATSAPP_DISPLAY = "(14) 99779-2007";
const EMAIL = "evair.lol@live.com";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Sou membro AxionFly e quero entrar no grupo exclusivo."
);

const MeuGrupoView = () => {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast({ title: "Copiado!", description: value });
    setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-[#0a0f1f] to-[#05050a] p-8 md:p-12">
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/20 blur-[80px]"
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Acesso Exclusivo
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Seu Grupo
          </h2>
          <p className="text-sm md:text-base text-[#94a3b8] max-w-2xl leading-relaxed">
            Fale diretamente com o time responsável pelo seu direcionamento. Entre em contato pelo
            WhatsApp ou e-mail abaixo para ser adicionado ao grupo exclusivo e receber o suporte
            personalizado.
          </p>
        </div>
      </div>

      {/* Cards de contato */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* WhatsApp */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0f1f] to-[#05050a] p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center border border-[#25D366]/30">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#25D366]">
                Mais rápido
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white mb-1">WhatsApp Direto</h3>
              <p className="text-xs text-[#94a3b8] mb-3">Resposta em minutos no horário comercial</p>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-4 h-4 text-[#25D366]" />
                <span className="text-base font-bold text-white tracking-wide">
                  {WHATSAPP_DISPLAY}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                asChild
                className="flex-1 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold text-xs uppercase tracking-widest"
              >
                <a
                  href={`https://wa.me/55${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Abrir conversa
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copy(WHATSAPP_DISPLAY, "whats")}
                className="border-white/10 hover:bg-white/5"
                aria-label="Copiar número"
              >
                {copiedField === "whats" ? (
                  <Check className="w-4 h-4 text-[#25D366]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0f1f] to-[#05050a] p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">
                Contato formal
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white mb-1">E-mail Direto</h3>
              <p className="text-xs text-[#94a3b8] mb-3">Para envio de materiais e documentos</p>
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-base font-bold text-white break-all">{EMAIL}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                asChild
                variant="neon"
                className="flex-1 font-bold text-xs uppercase tracking-widest"
              >
                <a href={`mailto:${EMAIL}?subject=Quero%20entrar%20no%20grupo%20AxionFly`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar e-mail
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copy(EMAIL, "email")}
                className="border-white/10 hover:bg-white/5"
                aria-label="Copiar e-mail"
              >
                {copiedField === "email" ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Instruções */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">
          Como funciona
        </h4>
        <ol className="space-y-2 text-sm text-[#94a3b8] leading-relaxed list-decimal list-inside">
          <li>Entre em contato pelo WhatsApp ou e-mail acima.</li>
          <li>Informe que é membro AxionFly e deseja entrar no grupo exclusivo.</li>
          <li>Você receberá o link de acesso e o direcionamento personalizado.</li>
        </ol>
      </div>
    </motion.div>
  );
};

export default MeuGrupoView;
