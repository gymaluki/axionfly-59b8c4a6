"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

interface CdnMarker {
  id: string;
  location: [number, number];
  region: string;
}

interface CdnArc {
  id: string;
  from: [number, number];
  to: [number, number];
}

interface GlobeCdnProps {
  markers?: CdnMarker[];
  arcs?: CdnArc[];
  className?: string;
  speed?: number;
}

const defaultMarkers: CdnMarker[] = [
  { id: "cdn-iad", location: [38.95, -77.45], region: "iad1" },
  { id: "cdn-sfo", location: [37.62, -122.38], region: "sfo1" },
  { id: "cdn-cdg", location: [49.01, 2.55], region: "cdg1" },
  { id: "cdn-hnd", location: [35.55, 139.78], region: "hnd1" },
  { id: "cdn-syd", location: [-33.95, 151.18], region: "syd1" },
  { id: "cdn-gru", location: [-23.43, -46.47], region: "gru1" },
  { id: "cdn-sin", location: [1.36, 103.99], region: "sin1" },
  { id: "cdn-arn", location: [59.65, 17.93], region: "arn1" },
  { id: "cdn-dub", location: [53.43, -6.25], region: "dub1" },
  { id: "cdn-bom", location: [19.09, 72.87], region: "bom1" },
];

const defaultArcs: CdnArc[] = [
  { id: "cdn-arc-1", from: [38.95, -77.45], to: [49.01, 2.55] },
  { id: "cdn-arc-2", from: [37.62, -122.38], to: [35.55, 139.78] },
  { id: "cdn-arc-3", from: [49.01, 2.55], to: [1.36, 103.99] },
  { id: "cdn-arc-4", from: [38.95, -77.45], to: [-23.43, -46.47] },
  { id: "cdn-arc-5", from: [35.55, 139.78], to: [-33.95, 151.18] },
  { id: "cdn-arc-6", from: [49.01, 2.55], to: [19.09, 72.87] },
];

const fallbackDots = [
  { top: "22%", left: "34%" },
  { top: "28%", left: "68%" },
  { top: "43%", left: "55%" },
  { top: "57%", left: "28%" },
  { top: "64%", left: "72%" },
  { top: "72%", left: "46%" },
];

export function GlobeCdn({
  markers = defaultMarkers,
  arcs = defaultArcs,
  className,
  speed = 0.003,
}: GlobeCdnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

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

    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grab";
    }

    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current === null) return;

      dragOffset.current = {
        phi: (e.clientX - pointerInteracting.current.x) / 300,
        theta: (e.clientY - pointerInteracting.current.y) / 1000,
      };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
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
          theta: 0.18,
          dark: 1,
          diffuse: 1.4,
          mapSamples: 12000,
          mapBrightness: 3,
          baseColor: [0.16, 0.18, 0.28],
          markerColor: [0.24, 0.62, 1],
          glowColor: [0.08, 0.12, 0.22],
          markerElevation: 0.04,
          markers: markers.map((marker) => ({
            location: marker.location,
            size: 0.1,
          })),
          arcs: arcs.map((arc) => ({
            from: arc.from,
            to: arc.to,
          })),
          arcColor: [0.24, 0.62, 1],
          arcWidth: 0.7,
          arcHeight: 0.18,
          opacity: 0.9,
        });

        const animate = () => {
          if (!globe) return;

          if (!isPausedRef.current) {
            phi += speed;
          }

          globe.update({
            phi: phi + phiOffsetRef.current + dragOffset.current.phi,
            theta: 0.18 + thetaOffsetRef.current + dragOffset.current.theta,
          });

          animationId = window.requestAnimationFrame(animate);
        };

        canvas.style.opacity = "1";
        setStatus("ready");
        animate();
      } catch {
        canvas.style.opacity = "0";
        setStatus("fallback");
      }
    };

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width) {
          resizeObserver.disconnect();
          init();
        }
      });

      resizeObserver.observe(canvas);

      return () => {
        resizeObserver.disconnect();
        if (animationId) window.cancelAnimationFrame(animationId);
        globe?.destroy();
      };
    }

    return () => {
      if (animationId) window.cancelAnimationFrame(animationId);
      globe?.destroy();
    };
  }, [arcs, markers, speed]);

  const statusLabel =
    status === "ready"
      ? "Rede global ativa"
      : status === "fallback"
        ? "Visualização simplificada ativa"
        : "Carregando globo...";

  return (
    <div
      className={cn(
        "relative aspect-square min-h-[320px] w-full select-none overflow-hidden rounded-full border border-border/40 bg-background/60 shadow-[0_0_70px_hsl(var(--primary)/0.12)]",
        className,
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.18), transparent 42%), radial-gradient(circle at 50% 50%, hsl(var(--foreground) / 0.08), transparent 72%)",
      }}
    >
      <div className="absolute inset-[7%] rounded-full border border-primary/20" />
      <div className="absolute inset-[18%] rounded-full border border-primary/10" />
      <div className="absolute left-1/2 top-[8%] h-[84%] w-px -translate-x-1/2 bg-border/30" />
      <div className="absolute left-[8%] top-1/2 h-px w-[84%] -translate-y-1/2 bg-border/30" />
      <div className="absolute inset-[12%] rounded-full border border-border/20" />

      {fallbackDots.map((dot, index) => (
        <span
          key={`${dot.left}-${dot.top}-${index}`}
          className="absolute h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_22px_hsl(var(--primary)/0.9)]"
          style={{ left: dot.left, top: dot.top }}
        />
      ))}

      <div className="absolute inset-0 opacity-100 transition-opacity duration-700">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          className="absolute inset-0 h-full w-full rounded-full transition-opacity duration-1000"
          style={{
            cursor: "grab",
            opacity: status === "ready" ? 1 : 0,
            touchAction: "none",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <span className="rounded-full border border-primary/20 bg-background/80 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-foreground backdrop-blur-sm">
          {statusLabel}
        </span>
      </div>
    </div>
  );
}
