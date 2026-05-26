"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link as LinkIcon, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  /** auto-cycle through nodes every N ms (no manual interaction needed) */
  autoCycleMs?: number;
}

export default function RadialOrbitalTimeline({
  timelineData,
  autoCycleMs = 3500,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // continuous slow rotation
  useEffect(() => {
    const t = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.25) % 360);
    }, 50);
    return () => clearInterval(t);
  }, []);

  // auto-cycle active node
  useEffect(() => {
    if (timelineData.length === 0) return;
    let i = 0;
    const focus = (idx: number) => {
      const item = timelineData[idx];
      setActiveNodeId(item.id);
      setExpandedItems({ [item.id]: true });
      const rel: Record<number, boolean> = {};
      item.relatedIds.forEach((r) => (rel[r] = true));
      setPulseEffect(rel);
    };
    focus(0);
    const t = setInterval(() => {
      i = (i + 1) % timelineData.length;
      focus(i);
    }, autoCycleMs);
    return () => clearInterval(t);
  }, [timelineData, autoCycleMs]);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const cur = timelineData.find((i) => i.id === activeNodeId);
    return cur ? cur.relatedIds.includes(itemId) : false;
  };

  return (
    <div
      className="w-full h-[640px] md:h-[680px] flex items-center justify-center overflow-hidden relative"
      ref={containerRef}
    >
      <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          {/* Center hub */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary/70 to-primary/40 animate-pulse flex items-center justify-center z-10 shadow-[0_0_40px_hsl(var(--primary)/0.7)]">
            <div className="absolute w-20 h-20 rounded-full border border-primary/30 animate-ping opacity-70" />
            <div className="absolute w-24 h-24 rounded-full border border-primary/20" />
            <div className="w-8 h-8 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Orbit ring */}
          <div className="absolute w-[400px] h-[400px] rounded-full border border-primary/15" />

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute transition-all duration-700"
                style={nodeStyle}
              >
                {/* Pulse rings on related */}
                <div
                  className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse duration-1000" : ""}`}
                  style={{
                    background: `radial-gradient(circle, hsl(var(--primary) / 0.25) 0%, transparent 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                />

                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${isExpanded ? "bg-primary text-primary-foreground" : isRelated ? "bg-primary/40 text-foreground" : "bg-card text-foreground"}
                    border-2
                    ${isExpanded ? "border-primary shadow-[0_0_25px_hsl(var(--primary)/0.7)]" : isRelated ? "border-primary/60 animate-pulse" : "border-primary/30"}
                    transition-all duration-300 transform
                    ${isExpanded ? "scale-150" : ""}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div
                  className={`
                    absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap
                    text-[11px] font-black uppercase tracking-wider
                    transition-all duration-300
                    ${isExpanded ? "text-foreground scale-110" : "text-muted-foreground"}
                  `}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute top-24 left-1/2 -translate-x-1/2 w-72 bg-background/95 backdrop-blur-lg border-primary/40 shadow-[0_8px_32px_hsl(var(--primary)/0.25)] overflow-visible">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-primary/60" />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-primary/40 text-primary">
                          {item.category}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{item.date}</span>
                      </div>
                      <CardTitle className="text-base mt-2 font-black text-foreground">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground leading-relaxed">
                      <p>{item.content}</p>
                      <div className="mt-4 pt-3 border-t border-primary/10">
                        <div className="flex justify-between items-center text-[10px] mb-1.5">
                          <span className="flex items-center font-bold text-foreground/80">
                            <Zap size={10} className="mr-1 text-primary" />
                            Cobertura
                          </span>
                          <span className="font-mono text-primary">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
                            style={{ width: `${item.energy}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
