"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface StickerMarker {
  id: string
  location: [number, number]
  sticker: string
}

interface GlobeStickersProps {
  markers?: StickerMarker[]
  className?: string
  speed?: number
}

const defaultMarkers: StickerMarker[] = [
  { id: "paris", location: [48.86, 2.35], sticker: "🥐" },
  { id: "tokyo", location: [35.68, 139.65], sticker: "🗼" },
  { id: "nyc", location: [40.71, -74.01], sticker: "🍎" },
  { id: "rio", location: [-22.91, -43.17], sticker: "🎭" },
  { id: "sydney", location: [-33.87, 151.21], sticker: "🐨" },
  { id: "cairo", location: [30.04, 31.24], sticker: "🐪" },
  { id: "rome", location: [41.9, 12.5], sticker: "🍕" },
  { id: "mexico", location: [19.43, -99.13], sticker: "🌮" },
  { id: "india", location: [28.61, 77.21], sticker: "🐘" },
  { id: "iceland", location: [64.15, -21.94], sticker: "🧊" },
  { id: "london", location: [51.51, -0.13], sticker: "☕" },
  { id: "hawaii", location: [21.31, -157.86], sticker: "🏄" },
  { id: "amsterdam", location: [52.37, 4.9], sticker: "🚲" },
  { id: "beijing", location: [39.9, 116.4], sticker: "🐉" },
  { id: "moscow", location: [55.75, 37.62], sticker: "🪆" },
  { id: "seoul", location: [37.57, 126.98], sticker: "🎮" },
]

export function GlobeStickers({
  markers = defaultMarkers,
  className = "",
  speed = 0.005,
}: GlobeStickersProps) {
  const containerRef = useRef<HTMLDivElement>(null)
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
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0

    function init() {
      const width = container!.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas!, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.3, 0.3, 0.4],
        markerColor: [0.2, 0.7, 0.9],
        glowColor: [0.05, 0.05, 0.1],
        markerElevation: 0,
        markers: markers.map((m) => ({ location: m.location, size: 0.03, id: m.id })),
        arcs: [],
        arcColor: [0.3, 0.85, 0.95],
        arcWidth: 0.5,
        arcHeight: 0.25,
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
      setTimeout(() => canvas && (canvas.style.opacity = "1"), 100)
    }

    // Use rAF to ensure the container has layout dimensions
    const frameId = requestAnimationFrame(() => {
      if (container.offsetWidth > 0) {
        init()
      } else {
        const ro = new ResizeObserver((entries) => {
          if (entries[0]?.contentRect.width > 0) {
            ro.disconnect()
            init()
          }
        })
        ro.observe(container)
      }
    })

    return () => {
      cancelAnimationFrame(frameId)
      if (animationId!) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, speed])

  return (
    <div ref={containerRef} className={`relative w-full aspect-square select-none ${className}`}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="sticker-outline">
            <feMorphology in="SourceAlpha" result="Dilated" operator="dilate" radius="2" />
            <feFlood floodColor="#ffffff" result="OutlineColor" />
            <feComposite in="OutlineColor" in2="Dilated" operator="in" result="Outline" />
            <feMerge>
              <feMergeNode in="Outline" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerLeave={handlePointerUp}
        style={{
          width: "100%", height: "100%", cursor: "grab", opacity: 0,
          transition: "opacity 1s ease", borderRadius: "50%", touchAction: "none",
        }}
      />
      {markers.map((m, i) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            // @ts-expect-error CSS Anchor Positioning
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            fontSize: "2rem",
            lineHeight: 1,
            transform: `rotate(${[-8, 6, -4, 10][i % 4]}deg)`,
            filter: "url(#sticker-outline) drop-shadow(0 2px 3px rgba(0,0,0,0.3))",
            pointerEvents: "none" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            transition: "opacity 0.2s, filter 0.2s",
          }}
        >
          {m.sticker}
        </div>
      ))}
      <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl -z-10" />
    </div>
  )
}