import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ShutterTextProps {
  words?: string[];
  className?: string;
  interval?: number;
}

export default function ShutterText({
  words = ["BARBEARIAS", "PIZZARIAS", "HAMBURGUERIAS", "RESTAURANTES", "PADARIAS", "SORVETERIAS", "MERCADOS", "LOJAS"],
  className = "",
  interval = 2500,
}: ShutterTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % words.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [interval, words.length]);

  const currentWord = words[currentIndex];

  return (
    <div className={cn("relative flex min-h-[1.15em] items-center justify-center", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -18, filter: "blur(10px)" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="block text-center text-4xl font-black leading-none gradient-text md:text-6xl lg:text-7xl"
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
