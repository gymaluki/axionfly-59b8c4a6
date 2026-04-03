import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShutterTextProps {
  words?: string[];
  className?: string;
  interval?: number;
}

export default function ShutterText({
  words = ["BARBEARIAS", "PIZZARIAS", "MANICURES", "DENTISTAS", "ACADEMIAS", "CLÍNICAS"],
  className = "",
  interval = 2500,
}: ShutterTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  const text = words[currentIndex];
  const characters = text.split("");

  return (
    <div className={cn("relative inline-flex items-center overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {characters.map((char, i) => (
            <div key={`${currentIndex}-${i}`} className="relative overflow-hidden">
              <motion.span
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: i * 0.03 + 0.1, duration: 0.5 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black gradient-text leading-none tracking-tighter"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>

              {/* Top slice */}
              <motion.span
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "100%", opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: "easeInOut" }}
                className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl font-black text-primary leading-none tracking-tighter z-10 pointer-events-none"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
              >
                {char}
              </motion.span>

              {/* Bottom slice */}
              <motion.span
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "100%", opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, delay: i * 0.03 + 0.15, ease: "easeInOut" }}
                className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl font-black text-accent leading-none tracking-tighter z-10 pointer-events-none"
                style={{ clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)" }}
              >
                {char}
              </motion.span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
