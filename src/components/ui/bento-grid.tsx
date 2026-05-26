"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  bullets?: string[];
  colSpan?: number;
  hasPersistentHover?: boolean;
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className,
      )}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative p-6 rounded-2xl overflow-hidden transition-all duration-300",
            "border border-primary/15 bg-card/40 backdrop-blur-sm",
            "hover:shadow-[0_4px_30px_hsl(var(--primary)/0.18)] hover:-translate-y-0.5 hover:border-primary/40",
            "will-change-transform",
            item.colSpan === 2 ? "md:col-span-2" : "md:col-span-1",
            item.hasPersistentHover &&
              "shadow-[0_4px_30px_hsl(var(--primary)/0.18)] border-primary/40",
          )}
        >
          {/* hover dot pattern */}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-300 pointer-events-none",
              item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            )}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.18) 1px, transparent 0)",
                backgroundSize: "10px 10px",
              }}
            />
          </div>

          <div className="relative flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/30 group-hover:bg-primary/20 transition-all duration-300">
                {item.icon}
              </div>
              {item.status && (
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full backdrop-blur-sm text-primary bg-primary/10 border border-primary/30">
                  {item.status}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-foreground tracking-tight text-lg md:text-xl leading-snug">
                {item.title}
                {item.meta && (
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    {item.meta}
                  </span>
                )}
              </h3>
              <p className="text-sm text-[#94a3b8] leading-[1.6] font-normal">
                {item.description}
              </p>
            </div>

            {item.bullets && item.bullets.length > 0 && (
              <ul className="space-y-2 pt-1">
                {item.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
                    </div>
                    <span className="leading-[1.5]">{b}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center flex-wrap gap-1.5 text-xs text-muted-foreground">
                {item.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-primary/5 border border-primary/15 text-[10px] font-semibold uppercase tracking-wider text-primary/80 backdrop-blur-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              {item.cta && (
                <span className="text-xs text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  {item.cta}
                </span>
              )}
            </div>
          </div>

          {/* corner accent */}
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 -z-10 rounded-2xl p-px bg-gradient-to-br from-primary/25 via-transparent to-transparent transition-opacity duration-300",
              item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            )}
          />
        </div>
      ))}
    </div>
  );
}

export { BentoGrid };
