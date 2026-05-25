import { useState } from "react";
import { Instagram, X } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/axionfly_/";
const INSTAGRAM_BUTTON_CLASS = "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]";

const FloatingSupport = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-full ${INSTAGRAM_BUTTON_CLASS} px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:scale-105 transition-transform`}
          >
            <Instagram className="w-4 h-4" />
            Seguir no Instagram
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Suporte AxionFly"
        className={`relative flex h-14 w-14 items-center justify-center rounded-full ${INSTAGRAM_BUTTON_CLASS} text-white shadow-xl hover:scale-110 transition-transform`}
      >
        {!open && (
          <span className={`absolute inset-0 rounded-full ${INSTAGRAM_BUTTON_CLASS} animate-ping opacity-40`} />
        )}
        {open ? (
          <X className="w-6 h-6 relative" />
        ) : (
          <Instagram className="w-7 h-7 relative" />
        )}
      </button>
    </div>
  );
};

export default FloatingSupport;
