"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import carouselDashboard from "@/assets/carousel-dashboard.webp";
import carouselVenda from "@/assets/carousel-venda.webp";
import hyperbuildExt from "@/assets/hyperbuild-extension.png";

export function ParallaxScroll() {
  const parallaxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = parallaxRef.current;
    if (!root) return;

    // Respect reduced motion + skip on small screens to avoid jank/conflicts
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (prefersReduced || isMobile) return;

    gsap.registerPlugin(ScrollTrigger);

    // Normalize scroll so ScrollTrigger plays nice with native + other libs
    ScrollTrigger.normalizeScroll(true);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const triggerElement = root.querySelector("[data-parallax-layers]") as HTMLElement | null;
    if (!triggerElement) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      const layers = [
        { layer: "1", yPercent: 40 },
        { layer: "2", yPercent: 30 },
        { layer: "3", yPercent: 20 },
        { layer: "4", yPercent: 5 },
      ];

      layers.forEach((l, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${l.layer}"]`),
          { yPercent: l.yPercent, ease: "none" },
          idx === 0 ? undefined : "<"
        );
      });
    }, root);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(root);

    return () => {
      window.removeEventListener("load", onLoad);
      ro.disconnect();
      ctx.revert();
      ScrollTrigger.normalizeScroll(false);
    };
  }, []);

  return (
    <section ref={parallaxRef} className="relative w-full">
      <div
        data-parallax-layers
        className="relative h-[140vh] w-full overflow-hidden bg-gradient-to-b from-background via-[#040814] to-background"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div
            data-parallax-layer="1"
            className="absolute inset-0 will-change-transform"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(37,99,235,0.25) 0%, transparent 60%)",
            }}
          />

          <div
            data-parallax-layer="2"
            className="absolute inset-0 flex items-center justify-center will-change-transform"
          >
            <img
              src={carouselDashboard}
              alt=""
              className="w-[80vw] max-w-5xl rounded-2xl opacity-30 shadow-[0_30px_90px_-20px_rgba(37,99,235,0.6)]"
              draggable={false}
              loading="lazy"
            />
          </div>

          <div
            data-parallax-layer="3"
            className="absolute inset-0 will-change-transform"
          >
            <img
              src={carouselVenda}
              alt=""
              className="absolute left-[5%] top-[20%] w-[22vw] max-w-[280px] rounded-xl opacity-80 shadow-2xl"
              draggable={false}
              loading="lazy"
            />
            <img
              src={hyperbuildExt}
              alt=""
              className="absolute right-[5%] top-[30%] w-[22vw] max-w-[280px] rounded-xl opacity-80 shadow-2xl"
              draggable={false}
              loading="lazy"
            />
          </div>

          <div
            data-parallax-layer="4"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center will-change-transform"
          >
            <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Ecossistema AxionFly
            </span>
            <h2 className="text-balance text-4xl font-black leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
              Tudo o que você precisa{" "}
              <span className="gradient-text">para escalar de verdade</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-xl">
              Prospecção, criação de sites com IA, extensão Lovable e suporte premium —
              numa experiência única, rolando na sua frente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ParallaxScroll;
