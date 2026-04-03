"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface InteractiveMarker {
  id: string
  location: [number, number]
  name: string
  users: number
}

interface GlobeInteractiveProps {
  markers?: InteractiveMarker[]
  className?: string
  speed?: number
}

const defaultMarkers: InteractiveMarker[] = [
  { id: "hq", location: [37.78, -122.44], name: "Barbearia", users: 1420 },
  { id: "eu", location: [52.52, 13.41], name: "Manicure", users: 892 },
  { id: "asia", location: [35.68, 139.65], name: "Restaurante", users: 2103 },
  { id: "latam", location: [-23.55, -46.63], name: "Academia", users: 567 },
  { id: "mena", location: [25.2, 55.27], name: "Clínica", users: 734 },
  { id: "oceania", location: [-33.87, 151.21], name: "Hamburgueria", users: 445 },
]

// Convert lat/lon to 2D position on the canvas given current globe rotation
function latLonToXY(
  lat: number,
  lon: number,
  phi: number,
  theta: number,
  size: number
): { x: number; y: number; visible: boolean } {
  const latRad = (lat * Math.PI) / 180
  const lonRad = (lon * Math.PI) / 180

  // 3D point on unit sphere
  const x0 = Math.cos(latRad) * Math.sin(lonRad)
  const y0 = -Math.sin(latRad)
  const z0 = Math.cos(latRad) * Math.cos(lonRad)

  // Rotate around Y axis by phi
  const x1 = x0 * Math.cos(phi) + z0 * Math.sin(phi)
  const y1 = y0
  const z1 = -x0 * Math.sin(phi) + z0 * Math.cos(phi)

  // Rotate around X axis by theta
  const x2 = x1
  const y2 = y1 * Math.cos(theta) - z1 * Math.sin(theta)
  const z2 = y1 * Math.sin(theta) + z1 * Math.cos(theta)

  const r = size / 2
  return {
    x: r + x2 * r,
    y: r + y2 * r,
    visible: z2 > 0.15,
  }
}

export function GlobeCdn({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobeInteractiveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const labelsRef = useRef<HTMLDivElement[]>([])
  const currentPhiRef = useRef(0)

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

    function updateLabels(currentPhi: number, currentTheta: number) {
      const size = canvas.offsetWidth
      markers.forEach((m, i) => {
        const label = labelsRef.current[i]
        if (!label) return
        const pos = latLonToXY(m.location[0], m.location[1], currentPhi, currentTheta, size)
        if (pos.visible) {
          label.style.opacity = "1"
          label.style.filter = "none"
          label.style.left = `${pos.x}px`
          label.style.top = `${pos.y - 20}px`
        } else {
          label.style.opacity = "0"
          label.style.filter = "blur(4px)"
        }
      })
    }

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
        markerElevation: 0,
        markers: markers.map((m) => ({ location: m.location, size: 0.025 })),
        opacity: 0.85,
        
      })

      canvas.style.opacity = "1"

      function animate() {
        if (!isPausedRef.current) phi += speed
        const currentPhi = phi + phiOffsetRef.current + dragOffset.current.phi
        const currentTheta = 0.2 + thetaOffsetRef.current + dragOffset.current.theta
        currentPhiRef.current = currentPhi
        globe!.update({ phi: currentPhi, theta: currentTheta })
        updateLabels(currentPhi, currentTheta)
        animationId = requestAnimationFrame(animate)
      }
      animate()
    }

    // Try init immediately, otherwise wait for resize
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

    // Fallback: retry after a short delay
    const fallbackTimer = setTimeout(() => {
      if (!globe && canvas.offsetWidth > 0) init()
    }, 500)

    return () => {
      clearTimeout(fallbackTimer)
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, speed])

  return (
    <div ref={containerRef} className={`relative aspect-square select-none ${className}`}>
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
      {markers.map((m, i) => (
        <div
          key={m.id}
          ref={(el) => {
            if (el) labelsRef.current[i] = el
          }}
          style={{
            position: "absolute",
            transform: "translate(-50%, -100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0.3rem 0.5rem",
            background: "hsl(220 20% 8% / 0.9)",
            borderRadius: 3,
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3), 0 0 12px hsl(217 91% 60% / 0.15)",
            border: "1px solid hsl(217 91% 60% / 0.3)",
            opacity: 0,
            transition: "opacity 0.3s, filter 0.3s",
            whiteSpace: "nowrap",
          }}
        >
          <span
            className="text-primary-foreground"
            style={{
              fontFamily: "monospace",
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {m.name}
          </span>
          <span
            className="text-muted-foreground"
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "0.5rem",
              marginTop: "0.1rem",
            }}
          >
            {m.users.toLocaleString()} users
          </span>
        </div>
      ))}
    </div>
  )
}
