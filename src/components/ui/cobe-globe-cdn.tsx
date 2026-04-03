"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

interface BusinessMarker {
  id: string;
  location: [number, number];
  label: string;
  emoji: string;
}

interface GlobeCdnProps {
  markers?: BusinessMarker[];
  className?: string;
  speed?: number;
}

const defaultMarkers: BusinessMarker[] = [
  { id: "m1", location: [38.95, -77.45], label: "Barbearia Premium", emoji: "💈" },
  { id: "m2", location: [37.62, -122.38], label: "Pizzaria Napoli", emoji: "🍕" },
  { id: "m3", location: [49.01, 2.55], label: "Manicure Studio", emoji: "💅" },
  { id: "m4", location: [35.55, 139.78], label: "Restaurante Zen", emoji: "🍽️" },
  { id: "m5", location: [-33.95, 151.18], label: "Hamburgueria Top", emoji: "🍔" },
  { id: "m6", location: [-23.43, -46.47], label: "Academia Fit", emoji: "🏋️" },
  { id: "m7", location: [1.36, 103.99], label: "Clínica Dental", emoji: "🦷" },
  { id: "m8", location: [59.65, 17.93], label: "Pet Shop Happy", emoji: "🐾" },
  { id: "m9", location: [53.43, -6.25], label: "Salão Beauty", emoji: "✨" },
  { id: "m10", location: [19.09, 72.87], label: "Padaria Artesanal", emoji: "🥖" },
];

export function GlobeCdn({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobeCdnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
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
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId: number;
    let phi = 0;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.12, 0.08, 0.22],
        markerColor: [0.53, 0.33, 0.93],
        glowColor: [0.25, 0.1, 0.45],
        markers: markers.map((m) => ({ location: m.location, size: 0.06 })),
        opacity: 0.85,
      });

      function animate() {
        if (!isPausedRef.current) phi += speed;
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = requestAnimationFrame(animate);
      }
      animate();
      setTimeout(() => canvas && (canvas.style.opacity = "1"));
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, [markers, speed]);

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      {/* Purple ring glow */}
      <div
        className="absolute inset-[-4%] rounded-full pointer-events-none z-10"
        style={{
          border: "1.5px solid hsl(271 81% 56% / 0.4)",
          boxShadow:
            "0 0 40px 8px hsl(271 81% 56% / 0.15), inset 0 0 40px 8px hsl(271 81% 56% / 0.08)",
        }}
      />
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      {/* Floating labels around globe */}
      {markers.slice(0, 6).map((m, i) => {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const rx = 52;
        const ry = 48;
        const left = 50 + rx * Math.cos(angle);
        const top = 50 + ry * Math.sin(angle);
        return (
          <div
            key={m.id}
            className="absolute pointer-events-none z-20 animate-pulse"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              transform: "translate(-50%, -50%)",
              animationDelay: `${i * 0.5}s`,
              animationDuration: "3s",
            }}
          >
            <div className="flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-primary/30 rounded-full px-2.5 py-1 shadow-lg whitespace-nowrap">
              <span className="text-xs">{m.emoji}</span>
              <span className="text-[10px] font-medium text-foreground">{m.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
