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
        "grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto",
        className,
      )}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative p-7 md:p-8 rounded-2xl overflow-hidden transition-all duration-300",
            "border border-white/[0.06] bg-[#0a0a0f]",
            "hover:border-primary/40 hover:bg-[#0d0d14] hover:-translate-y-0.5",
            "hover:shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.35)]",
            item.colSpan === 2 ? "md:col-span-2" : "md:col-span-1",
            item.hasPersistentHover &&
              "border-primary/40 shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.35)]",
          )}
        >
          <div className="relative flex flex-col space-y-5 min-h-[180px]">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/25 group-hover:bg-primary/15 group-hover:border-primary/40 transition-all duration-300">
                {item.icon}
              </div>
              {item.status && (
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full text-primary bg-primary/10 border border-primary/25">
                  {item.status}
                </span>
              )}
            </div>

            <div className="space-y-2.5 pt-2">
              <h3 className="font-black text-foreground tracking-tight text-xl md:text-[22px] leading-snug">
                {item.title}
                {item.meta && (
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    {item.meta}
                  </span>
                )}
              </h3>
              <p className="text-[14px] text-[#94a3b8] leading-[1.65] font-normal">
                {item.description}
              </p>
            </div>

            {item.bullets && item.bullets.length > 0 && (
              <ul className="space-y-2 pt-1">
                {item.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 text-[13px] text-slate-300"
                  >
                    <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
                    </div>
                    <span className="leading-[1.5]">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export { BentoGrid };
