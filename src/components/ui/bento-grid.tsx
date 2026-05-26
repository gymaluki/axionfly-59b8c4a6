"use client";

import { cn } from "@/lib/utils";

export interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  colSpan?: number; // 1..6 (grid de 6 colunas no desktop)
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

const colSpanMap: Record<number, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
};

function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 gap-5 max-w-7xl mx-auto",
        className,
      )}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative p-8 md:p-10 rounded-2xl overflow-hidden transition-all duration-300",
            "border border-primary/15 min-h-[220px]",
            "bg-[radial-gradient(120%_120%_at_0%_0%,hsl(var(--primary)/0.22)_0%,#0a0f1f_45%,#05070d_100%)]",
            "hover:border-primary/50 hover:-translate-y-0.5",
            "hover:shadow-[0_10px_50px_-12px_hsl(var(--primary)/0.55)]",
            colSpanMap[item.colSpan ?? 2] || "md:col-span-2",
          )}
        >
          <div className="relative flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/25 group-hover:bg-primary/15 group-hover:border-primary/40 transition-all duration-300 mb-10">
              {item.icon}
            </div>

            <div className="space-y-3 mt-auto">
              <h3 className="font-black text-foreground tracking-tight text-xl md:text-[22px] leading-snug">
                {item.title}
              </h3>
              <p className="text-[14px] text-[#94a3b8] leading-[1.65] font-normal max-w-xl">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { BentoGrid };
