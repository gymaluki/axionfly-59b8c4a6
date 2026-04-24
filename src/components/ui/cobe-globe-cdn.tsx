"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface PulseMarker {
  id: string
  location: [number, number]
  delay: number
  label?: string
}

interface GlobeCdnProps {
  markers?: PulseMarker[]
  className?: string
  speed?: number
}

const defaultMarkers: PulseMarker[] = [
  { id: "pulse-1", location: [51.51, -0.13], delay: 0, label: "Barbearia" },
  { id: "pulse-2", location: [40.71, -74.01], delay: 0.5, label: "Pizzaria" },
  { id: "pulse-3", location: [35.68, 139.65], delay: 1, label: "Padaria" },
  { id: "pulse-4", location: [-33.87, 151.21], delay: 1.5, label: "Mercado" },
  { id: "pulse-5", location: [-23.55, -46.63], delay: 0.8, label: "Lanchonete" },
  { id: "pulse-6", location: [48.85, 2.35], delay: 1.2, label: "Sorveteria" },
  { id: "pulse-7", location: [19.43, -99.13], delay: 0.3, label: "Restaurante" },
  { id: "pulse-8", location: [55.75, 37.62], delay: 1.8, label: "Loja de Roupas" },
  { id: "pulse-9", location: [37.77, -122.42], delay: 0.6, label: "Hamburgueria" },
  { id: "pulse-10", location: [-22.91, -43.17], delay: 1.1, label: "Açaiteria" },
  { id: "pulse-11", location: [34.05, -118.24], delay: 1.4, label: "Cafeteria" },
  { id: "pulse-12", location: [28.61, 77.21], delay: 0.2, label: "Conveniência" },
  { id: "pulse-13", location: [1.35, 103.82], delay: 0.9, label: "Doceria" },
  { id: "pulse-14", location: [-15.79, -47.88], delay: 1.6, label: "Marmitaria" },
  { id: "pulse-15", location: [41.39, 2.17], delay: 0.4, label: "Salão de Beleza" },
  { id: "pulse-16", location: [52.52, 13.41], delay: 1.3, label: "Floricultura" },
  { id: "pulse-17", location: [25.27, 55.30], delay: 0.7, label: "Distribuidora" },
  { id: "pulse-18", location: [43.65, -79.38], delay: 1.0, label: "Pastelaria" },
  { id: "pulse-19", location: [-12.97, -38.51], delay: 0.15, label: "Açougue" },
  { id: "pulse-20", location: [59.33, 18.07], delay: 1.7, label: "Hortifruti" },
]

export function GlobeCdn({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobeCdnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

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

      try {
        globe = createGlobe(canvas, {
          devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          width, height: width,
          phi: 0, theta: 0.2, dark: 1, diffuse: 1.5,
          mapSamples: 16000, mapBrightness: 10,
          baseColor: [0.5, 0.5, 0.5],
          markerColor: [0.2, 0.8, 0.9],
          glowColor: [0.05, 0.05, 0.05],
          markerElevation: 0,
          markers: markers.map((m) => ({ location: m.location, size: 0.025, id: m.id })),
          arcs: [], arcColor: [0.3, 0.85, 0.95],
          arcWidth: 0.5, arcHeight: 0.25, opacity: 0.7,
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
      } catch (e) {
        console.warn("Globe WebGL failed:", e)
      }
      canvas.style.opacity = "1"
    }

    // Try init immediately, with resize fallback, and a timeout fallback
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

    const fallback = setTimeout(() => {
      canvas.style.opacity = "1"
      init()
    }, 800)

    return () => {
      clearTimeout(fallback)
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, speed])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes pulse-expand {
          0% { transform: scaleX(0.3) scaleY(0.3); opacity: 0.8; }
          100% { transform: scaleX(1.5) scaleY(1.5); opacity: 0; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%", height: "100%", cursor: "grab", opacity: 0,
          transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "none",
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            // @ts-expect-error CSS Anchor Positioning
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(center)",
            left: "anchor(center)",
            translate: "-50% 50%",
            width: 40, height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.4s, filter 0.4s",
          }}
        >
          <span style={{
            position: "absolute", inset: 0,
            border: "2px solid #33ccdd", borderRadius: "50%", opacity: 0,
            animation: `pulse-expand 2s ease-out infinite ${m.delay}s`,
          }} />
          <span style={{
            position: "absolute", inset: 0,
            border: "2px solid #33ccdd", borderRadius: "50%", opacity: 0,
            animation: `pulse-expand 2s ease-out infinite ${m.delay + 0.5}s`,
          }} />
          <span style={{
            width: 10, height: 10, background: "#33ccdd", borderRadius: "50%",
            boxShadow: "0 0 0 3px #111, 0 0 0 5px #33ccdd",
          }} />
          {m.label && (
            <span style={{
              position: "absolute",
              bottom: "calc(100% + 6px)",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
              fontSize: 10,
              fontWeight: 600,
              color: "#33ccdd",
              textShadow: "0 0 6px rgba(51,204,221,0.5), 0 1px 3px rgba(0,0,0,0.8)",
              letterSpacing: "0.02em",
            }}>
              {m.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
