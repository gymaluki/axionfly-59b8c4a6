"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import createGlobe from "cobe"

interface CdnMarker {
  id: string
  location: [number, number]
  region: string
}

interface CdnArc {
  id: string
  from: [number, number]
  to: [number, number]
}

interface GlobeCdnProps {
  markers?: CdnMarker[]
  arcs?: CdnArc[]
  className?: string
  speed?: number
}

const defaultMarkers: CdnMarker[] = [
  { id: "cdn-iad", location: [38.95, -77.45], region: "Barbearia" },
  { id: "cdn-sfo", location: [37.62, -122.38], region: "Pizzaria" },
  { id: "cdn-cdg", location: [49.01, 2.55], region: "Manicure" },
  { id: "cdn-hnd", location: [35.55, 139.78], region: "Restaurante" },
  { id: "cdn-syd", location: [-33.95, 151.18], region: "Hamburgueria" },
  { id: "cdn-gru", location: [-23.43, -46.47], region: "Academia" },
  { id: "cdn-sin", location: [1.36, 103.99], region: "Clínica" },
  { id: "cdn-arn", location: [59.65, 17.93], region: "Pet Shop" },
  { id: "cdn-dub", location: [53.43, -6.25], region: "Salão" },
  { id: "cdn-bom", location: [19.09, 72.87], region: "Padaria" },
]

const defaultArcs: CdnArc[] = [
  { id: "cdn-arc-1", from: [38.95, -77.45], to: [49.01, 2.55] },
  { id: "cdn-arc-2", from: [37.62, -122.38], to: [35.55, 139.78] },
  { id: "cdn-arc-3", from: [49.01, 2.55], to: [1.36, 103.99] },
  { id: "cdn-arc-4", from: [38.95, -77.45], to: [-23.43, -46.47] },
  { id: "cdn-arc-5", from: [35.55, 139.78], to: [-33.95, 151.18] },
  { id: "cdn-arc-6", from: [49.01, 2.55], to: [19.09, 72.87] },
]

export function GlobeCdn({
  markers = defaultMarkers,
  arcs = defaultArcs,
  className = "",
  speed = 0.003,
}: GlobeCdnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const [traffic, setTraffic] = useState(() =>
    defaultArcs.map((a, i) => ({ id: a.id, value: [420, 380, 290, 185, 156, 134][i] || 100 }))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTraffic((data) =>
        data.map((t) => ({
          ...t,
          value: Math.max(50, t.value + Math.floor(Math.random() * 21) - 10),
        }))
      )
    }, 250)
    return () => clearInterval(interval)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 2,
        mapSamples: 20000,
        mapBrightness: 8,
        baseColor: [0.15, 0.1, 0.35],
        markerColor: [0.25, 0.52, 0.96],
        glowColor: [0.1, 0.15, 0.3],
        markerElevation: 0.02,
        markers: markers.map((m) => ({ location: m.location, size: 0.012 })),
        opacity: 0.85,
      })

      function animate() {
        if (!isPausedRef.current) phi += speed
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        })
        animationId = requestAnimationFrame(animate)
      }
      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, arcs, speed])

  const pyramidFaceStyle = (nth: number): React.CSSProperties => {
    const transforms = [
      "rotateY(0deg) translateZ(4px) rotateX(19.5deg)",
      "rotateY(120deg) translateZ(4px) rotateX(19.5deg)",
      "rotateY(240deg) translateZ(4px) rotateX(19.5deg)",
      "rotateX(-90deg) rotateZ(60deg) translateY(4px)",
    ]
    const colors = [
      "hsl(217 91% 60%)",
      "hsl(217 91% 45%)",
      "hsl(217 91% 35%)",
      "hsl(217 91% 50%)",
    ]
    return {
      position: "absolute",
      left: -0.5,
      top: 0,
      width: 0,
      height: 0,
      borderLeft: "6.5px solid transparent",
      borderRight: "6.5px solid transparent",
      borderBottom: `13px solid ${colors[nth]}`,
      transformOrigin: "center bottom",
      transform: transforms[nth],
    }
  }

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes pyramid-spin {
          0% { transform: rotateX(20deg) rotateY(0deg); }
          100% { transform: rotateX(20deg) rotateY(360deg); }
        }
      `}</style>
      {/* Blue ring glow */}
      <div
        className="absolute inset-[-4%] rounded-full pointer-events-none z-10"
        style={{
          border: "1.5px solid hsl(217 91% 60% / 0.35)",
          boxShadow:
            "0 0 60px 12px hsl(217 91% 60% / 0.12), inset 0 0 60px 12px hsl(217 91% 60% / 0.06)",
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
      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            // @ts-expect-error CSS Anchor Positioning
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: 6,
            pointerEvents: "none" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.3s, filter 0.3s",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              position: "relative",
              transformStyle: "preserve-3d" as const,
              animation: "pyramid-spin 4s linear infinite",
            }}
          >
            {[0, 1, 2, 3].map((n) => (
              <div key={n} style={pyramidFaceStyle(n)} />
            ))}
          </div>
          <span
            className="font-mono text-primary-foreground bg-primary/90 shadow-lg"
            style={{
              fontSize: "0.55rem",
              padding: "2px 6px",
              borderRadius: 3,
              letterSpacing: "0.05em",
              whiteSpace: "nowrap" as const,
            }}
          >
            {m.region}
          </span>
        </div>
      ))}
      {traffic.map((t) => (
        <div
          key={t.id}
          style={{
            position: "absolute",
            // @ts-expect-error CSS Anchor Positioning
            positionAnchor: `--cobe-arc-${t.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            fontFamily: "monospace",
            fontSize: "0.5rem",
            padding: "3px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap" as const,
            pointerEvents: "none" as const,
            opacity: `var(--cobe-visible-arc-${t.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-arc-${t.id}, 0)) * 8px))`,
            transition: "opacity 0.3s, filter 0.3s",
          }}
          className="text-foreground bg-card border border-border shadow-lg"
        >
          {t.value}k req/s
        </div>
      ))}
    </div>
  )
}
