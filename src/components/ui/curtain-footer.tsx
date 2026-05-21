"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CurtainFooterProps {
  children: ReactNode;
}

/**
 * "Curtain reveal" footer wrapper.
 * - Renders an in-flow spacer matching the footer's height (so the page can
 *   scroll past it).
 * - Renders the actual footer fixed at the bottom of the viewport, behind
 *   the page content, so as the user reaches the end of the page the
 *   content scrolls away revealing the footer underneath.
 *
 * Requires: body background transparent (handled in index.css) and the
 * page content wrapper to have a solid background (already the case in
 * Index.tsx with bg-[#05050a]).
 */
export function CurtainFooter({ children }: CurtainFooterProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const measure = () => setHeight(el.offsetHeight);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  useEffect(() => {
    if (!footerRef.current || !spacerRef.current) return;
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(footerRef.current, { clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { scale: 0.94, opacity: 0.55, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: spacerRef.current!,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [height]);

  return (
    <>
      <div ref={spacerRef} aria-hidden style={{ height }} />
      <div
        ref={footerRef}
        className="fixed bottom-0 left-0 right-0 will-change-transform"
        style={{ zIndex: -1 }}
      >
        {children}
      </div>
    </>
  );
}

export default CurtainFooter;
