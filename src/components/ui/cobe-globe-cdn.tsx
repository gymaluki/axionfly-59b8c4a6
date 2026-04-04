"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

interface GlobeCdnProps {
  className?: string;
  speed?: number;
}

const businessMarkers = [
  { location: [-23.55, -46.63] as [number, number], label: "Barbearia SP", size: 0.08 },
  { location: [-22.91, -43.17] as [number, number], label: "Pizzaria RJ", size: 0.07 },
  { location: [-19.92, -43.94] as [number, number], label: "Clínica BH", size: 0.06 },
  { location: [-12.97, -38.51] as [number, number], label: "Restaurante Salvador", size: 0.06 },
  { location: [-25.43, -49.27] as [number, number], label: "Pet Shop Curitiba", size: 0.05 },
  { location: [-3.72, -38.52] as [number, number], label: "Academia Fortaleza", size: 0.05 },
  { location: [-15.78, -47.93] as [number, number], label: "Salão Brasília", size: 0.06 },
  { location: [-30.03, -51.23] as [number, number], label: "Hamburgueria POA", size: 0.05 },
  { location: [40.71, -74.01] as [number, number], label: "Barber NYC", size: 0.04 },
  { location: [51.51, -0.13] as [number, number], label: "Restaurant London", size: 0.04 },
];

export function GlobeCdn({ className, speed = 0.005 }: GlobeCdnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const [globeReady, setGlobeReady] = useState(false);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!pointerInteracting.current) return;
      dragOffset.current = {
        phi: (e.clientX - pointerInteracting.current.x) / 300,
        theta: (e.clientY - pointerInteracting.current.y) / 1000,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId = 0;
    let phi = 0;

    const init = () => {
      const width = canvas.offsetWidth;
      if (!width || globe) return;

      try {
        globe = createGlobe(canvas, {
          devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          width,
          height: width,
          phi: 0,
          theta: 0.25,
          dark: 1,
          diffuse: 1.2,
          mapSamples: 16000,
          mapBrightness: 4,
          baseColor: [0.12, 0.14, 0.22],
          markerColor: [0.1, 0.6, 1],
          glowColor: [0.06, 0.1, 0.2],
          markerElevation: 0.05,
          markers: businessMarkers.map((m) => ({
            location: m.location,
            size: m.size,
          })),
          opacity: 0.85,
        });

        const animate = () => {
          if (!globe) return;
          if (!isPausedRef.current) phi += speed;
          globe.update({
            phi: phi + phiOffsetRef.current + dragOffset.current.phi,
            theta: 0.25 + thetaOffsetRef.current + dragOffset.current.theta,
          });
          animationId = window.requestAnimationFrame(animate);
        };

        setGlobeReady(true);
        animate();
      } catch {
        setGlobeReady(false);
      }
    };

    const timeout = setTimeout(() => {
      if (canvas.offsetWidth > 0) {
        init();
      } else {
        const ro = new ResizeObserver((entries) => {
          if (entries[0]?.contentRect.width) {
            ro.disconnect();
            init();
          }
        });
        ro.observe(canvas);
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (animationId) cancelAnimationFrame(animationId);
      globe?.destroy();
    };
  }, [speed]);

  return (
    <div className={cn("relative aspect-square w-full select-none", className)}>
      {/* CSS fallback globe - always visible behind canvas */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, hsl(217 91% 20% / 0.6), hsl(217 91% 8% / 0.9) 55%, transparent 72%)",
            boxShadow: "inset 0 0 60px hsl(217 91% 60% / 0.08), 0 0 80px hsl(217 91% 50% / 0.15)",
          }}
        />
        <div
          className="absolute inset-[2%] rounded-full border border-primary/10"
          style={{
            background: "radial-gradient(circle at 40% 30%, hsl(217 91% 25% / 0.3), transparent 60%)",
          }}
        />
        {/* Grid lines to simulate globe wireframe */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-20">
          <ellipse cx="100" cy="100" rx="96" ry="96" fill="none" stroke="hsl(217 91% 60%)" strokeWidth="0.5" />
          <ellipse cx="100" cy="100" rx="70" ry="96" fill="none" stroke="hsl(217 91% 60%)" strokeWidth="0.3" />
          <ellipse cx="100" cy="100" rx="40" ry="96" fill="none" stroke="hsl(217 91% 60%)" strokeWidth="0.3" />
          <ellipse cx="100" cy="100" rx="96" ry="40" fill="none" stroke="hsl(217 91% 60%)" strokeWidth="0.3" transform="rotate(0 100 100)" />
          <line x1="4" y1="100" x2="196" y2="100" stroke="hsl(217 91% 60%)" strokeWidth="0.3" />
          <line x1="100" y1="4" x2="100" y2="196" stroke="hsl(217 91% 60%)" strokeWidth="0.3" />
        </svg>
      </div>

      {/* Business marker dots on fallback */}
      {!globeReady && (
        <div className="absolute inset-0">
          {[
            { top: "35%", left: "38%", label: "Barbearia SP" },
            { top: "30%", left: "42%", label: "Pizzaria RJ" },
            { top: "28%", left: "35%", label: "Clínica BH" },
            { top: "22%", left: "40%", label: "Restaurante SSA" },
            { top: "40%", left: "36%", label: "Pet Shop CWB" },
            { top: "18%", left: "38%", label: "Academia FOR" },
            { top: "25%", left: "37%", label: "Salão BSB" },
            { top: "45%", left: "34%", label: "Hamburgueria POA" },
          ].map((dot, i) => (
            <div
              key={i}
              className="absolute group"
              style={{ top: dot.top, left: dot.left }}
            >
              <span className="block h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.8)] animate-pulse" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-background/90 px-2 py-0.5 text-[10px] font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity border border-border/50 backdrop-blur-sm">
                {dot.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* WebGL canvas (renders real globe when GPU available) */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className={cn(
          "absolute inset-0 h-full w-full rounded-full transition-opacity duration-1000",
          globeReady ? "opacity-100" : "opacity-0",
        )}
        style={{ cursor: "grab", touchAction: "none" }}
      />

      {/* Label */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
        <span className="rounded-full border border-primary/20 bg-background/80 px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] text-primary/90 backdrop-blur-sm uppercase">
          {globeReady ? "🌍 Globo interativo" : "🌍 Comércios mapeados"}
        </span>
      </div>
    </div>
  );
}
