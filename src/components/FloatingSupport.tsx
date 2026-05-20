import { useState } from "react";
import { MessageCircle, Instagram, X } from "lucide-react";

const WHATSAPP_NUMBER = "5511962475414";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Vim do site da AxionFly e preciso de suporte."
);
const INSTAGRAM_URL = "https://www.instagram.com/axionfly_/";

const FloatingSupport = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-4 h-4" />
            Falar no WhatsApp
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:scale-105 transition-transform"
          >
            <Instagram className="w-4 h-4" />
            Seguir no Instagram
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Suporte AxionFly"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 transition-transform"
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
        )}
        {open ? (
          <X className="w-6 h-6 relative" />
        ) : (
          <MessageCircle className="w-7 h-7 relative" />
        )}
      </button>
    </div>
  );
};

export default FloatingSupport;
