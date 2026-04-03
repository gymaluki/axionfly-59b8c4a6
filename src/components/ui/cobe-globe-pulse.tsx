"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"
import createGlobe from "cobe"

interface PulseMarker {
  id: string
  location: [number, number]
  delay: number
}

interface GlobePulseProps {
  markers?: PulseMarker[]
  className?: string
  speed?: number
}

const defaultMarkers: PulseMarker[] = [
  { id: "pulse-1", location: [51.51, -0.13], delay: 0 },
  { id: "pulse-2", location: [40.71, -74.01], delay: 0.5 },
  { id: "pulse-3", location: [35.68, 139.65], delay: 1 },
  { id: "pulse-4", location: [-33.87, 151.21], delay: 1.5 },
]

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  const normalizedS = s / 100
  const normalizedL = l / 100
  const c = (1 - Math.abs(2 * normalizedL - 1)) * normalizedS
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = normalizedL - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  return [r + m, g + m, b + m]
}

const readHslToken = (
  styles: CSSStyleDeclaration,
  variableName: string,
  fallback: [number, number, number],
) => {
  const raw = styles.getPropertyValue(variableName).trim()
  const [h, s, l] = raw.split(/\s+/)

  if (!h || !s || !l) return fallback

  const hue = Number(h)
  const saturation = Number(s.replace("%", ""))
  const lightness = Number(l.replace("%", ""))

  if ([hue, saturation, lightness].some((value) => Number.isNaN(value))) return fallback

  return hslToRgb(hue, saturation, lightness)
}

export function GlobePulse({
  markers = defaultMarkers,
  className = "",
  speed = 0.012,
}: GlobePulseProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  const colors = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        base: [0.12, 0.16, 0.22] as [number, number, number],
        marker: [0.22, 0.74, 0.94] as [number, number, number],
        glow: [0.04, 0.08, 0.14] as [number, number, number],
        arc: [0.36, 0.74, 0.98] as [number, number, number],
      }
    }

    const styles = window.getComputedStyle(document.documentElement)

    return {
      base: readHslToken(styles, "--secondary", [0.12, 0.16, 0.22]),
      marker: readHslToken(styles, "--accent", [0.22, 0.74, 0.94]),
      glow: readHslToken(styles, "--background", [0.04, 0.08, 0.14]),
      arc: readHslToken(styles, "--primary", [0.36, 0.74, 0.98]),
    }
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
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
          phi: (e.clientX - pointerInteracting.current.x) / 260,
          theta: (e.clientY - pointerInteracting.current.y) / 900,
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
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) return

    let globe: ReturnType<typeof createGlobe> | null = null
    let currentWidth = 0
    let phi = 0

    const initGlobe = () => {
      const nextWidth = Math.round(container.offsetWidth)
      if (!nextWidth) return

      currentWidth = nextWidth
      globe?.destroy()

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: currentWidth,
        height: currentWidth,
        phi: 0,
        theta: 0.25,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 18000,
        mapBrightness: 3,
        baseColor: colors.base,
        markerColor: colors.marker,
        glowColor: colors.glow,
        markerElevation: 0.12,
        markers: markers.map((marker) => ({
          location: marker.location,
          size: 0.08,
        })),
        arcs: markers.map((marker, index) => ({
          from: marker.location,
          to: markers[(index + 1) % markers.length]?.location ?? marker.location,
        })),
        arcColor: colors.arc,
        arcWidth: 0.35,
        arcHeight: 0.16,
        opacity: 0.95,
        onRender: (state) => {
          if (!isPausedRef.current) phi += speed

          state.width = currentWidth
          state.height = currentWidth
          state.phi = phi + phiOffsetRef.current + dragOffset.current.phi
          state.theta = 0.25 + thetaOffsetRef.current + dragOffset.current.theta
        },
      })

      canvas.style.opacity = "1"
    }

    const frame = window.requestAnimationFrame(initGlobe)
    const resizeObserver = new ResizeObserver(() => {
      if (Math.round(container.offsetWidth) !== currentWidth) initGlobe()
    })

    resizeObserver.observe(container)

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      globe?.destroy()
    }
  }, [colors, markers, speed])

  return (
    <div ref={containerRef} className={`relative w-full aspect-square select-none ${className}`}>
      <div className="absolute inset-[8%] rounded-full border border-primary/20 opacity-70 animate-pulse" />
      <div className="absolute inset-[14%] rounded-full border border-accent/20 opacity-60 animate-pulse [animation-delay:400ms]" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-3xl" />

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerUp}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 320ms ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />

      <div className="pointer-events-none absolute inset-[18%] rounded-full border border-border/60" />
      <div className="pointer-events-none absolute inset-[32%] rounded-full bg-primary/5 blur-2xl" />
    </div>
  )
}