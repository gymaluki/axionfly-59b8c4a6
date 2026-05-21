"use client";

import { useRef } from "react";
import React from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface Picture {
  src: string;
  scale?: MotionValue<number>;
}

interface ImmersiveScrollGalleryProps {
  images?: { src: string }[];
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

import carouselDashboard from "@/assets/carousel-dashboard.webp";
import carouselAcessar from "@/assets/carousel-acessar.webp";
import carouselSuporte from "@/assets/carousel-suporte.webp";
import carouselVenda from "@/assets/carousel-venda.webp";
import carouselVendaSemGastar from "@/assets/carousel-venda-sem-gastar.webp";
import hyperbuildExt from "@/assets/hyperbuild-extension.png";
import googleMaps from "@/assets/google-maps-logo.webp";

const DEFAULT_IMAGES = [
  { src: carouselDashboard },
  { src: carouselAcessar },
  { src: carouselVenda },
  { src: carouselVendaSemGastar },
  { src: carouselSuporte },
  { src: hyperbuildExt },
  { src: googleMaps },
];

const IMAGE_STYLES = [
  "w-[25vw] h-[25vh]",
  "w-[35vw] h-[30vh] -top-[30vh] left-[5vw]",
  "w-[20vw] h-[45vh] -top-[10vh] -left-[25vw]",
  "w-[25vw] h-[25vh] left-[27.5vw]",
  "w-[20vw] h-[25vh] top-[27vh] left-[5vw]",
  "w-[30vw] h-[25vh] top-[27.5vh] -left-[22.5vw]",
  "w-[15vw] h-[15vh] top-[22.5vh] left-[25vw]",
];

const ImmersiveScrollGallery: React.FC<ImmersiveScrollGalleryProps> = ({
  images = DEFAULT_IMAGES,
  className = "",
  title,
  subtitle,
}) => {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const ctaOpacity = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.55, 0.85], [60, 0]);

  const pictures: Picture[] = images.map((img, i) => ({
    src: img.src,
    scale: scales[i % 7],
  }));

  return (
    <div ref={container} className={`relative h-[300vh] ${className}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#05050a]">
        {/* Hero text fades out as you scroll */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 z-[5] flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          {title ?? (
            <h2 className="text-4xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
              Tudo em <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">um só lugar</span>
            </h2>
          )}
          {subtitle ?? (
            <p className="mt-6 max-w-2xl text-[#94a3b8] text-base md:text-xl font-medium">
              Role a página e descubra o ecossistema completo da AxionFly.
            </p>
          )}
          <div className="mt-10 flex flex-col items-center gap-2 text-[#64748b] text-xs uppercase tracking-[0.3em]">
            <span>Continue rolando</span>
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="text-blue-400 text-lg"
            >
              ↓
            </motion.span>
          </div>
        </motion.div>

        {/* Zooming images */}
        {pictures.map(({ src, scale }, index) => (
          <motion.div
            key={index}
            style={{ scale }}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
          >
            <div className={`relative ${IMAGE_STYLES[index % IMAGE_STYLES.length]}`}>
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover rounded-xl shadow-[0_20px_60px_-15px_rgba(59,130,246,0.4)]"
                loading="lazy"
                draggable={false}
              />
            </div>
          </motion.div>
        ))}

        {/* Final CTA appears after zoom */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute inset-0 z-[10] flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <div className="bg-[#05050a]/70 backdrop-blur-md border border-blue-500/20 rounded-3xl px-8 py-10 max-w-2xl shadow-[0_0_80px_rgba(59,130,246,0.25)]">
            <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Pronto pra <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">faturar alto?</span>
            </h3>
            <p className="mt-4 text-[#94a3b8] text-base md:text-lg">
              Junte-se aos profissionais que já estão vendendo sites todos os dias com a AxionFly.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImmersiveScrollGallery;
