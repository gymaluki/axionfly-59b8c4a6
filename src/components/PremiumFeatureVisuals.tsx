import { useEffect, useRef } from "react";

/* Shared particle canvas — connected dots */
function ParticleNet({ id }: { id: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const pts = Array.from({ length: 30 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      ctx.strokeStyle = "rgba(36,99,235,0.12)";
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = "rgba(36,99,235,0.5)";
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas id={id} ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

const sharedStyles = `
  .pfv-card {
    position: relative;
    overflow: hidden;
    border-radius: 1rem;
    border: 1px solid #1a2a4a;
    background: #050508;
    aspect-ratio: 16/10;
  }
  .pfv-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(36,99,235,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(36,99,235,0.06) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }
  .pfv-orb {
    position: absolute; left: 50%; top: 50%;
    width: 60%; height: 60%; transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(36,99,235,0.10), transparent 70%);
    pointer-events: none;
  }
  .pfv-float-a { animation: pfv-float 5s ease-in-out infinite; }
  .pfv-float-b { animation: pfv-float-b 4s ease-in-out infinite; }
  .pfv-float-c { animation: pfv-float-b 5s ease-in-out infinite 0.6s; }
  .pfv-float-d { animation: pfv-float-b 3.5s ease-in-out infinite 1.2s; }
  @keyframes pfv-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes pfv-float-b {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-7px); }
  }
  @keyframes pfv-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes pfv-pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
  }

  /* ==== Card 1 (sites) ==== */
  .pfv-sites-badge {
    position: absolute; top: 14px; left: 50%; transform: translateX(-50%);
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px; border-radius: 999px;
    border: 1px solid #2463EB; background: rgba(36,99,235,0.08);
    font-size: 10px; font-weight: 800; letter-spacing: 0.15em; color: #2463EB;
    z-index: 5;
  }
  .pfv-sites-badge .dot {
    width: 6px; height: 6px; border-radius: 999px; background: #2463EB;
    animation: pfv-pulse-dot 1.4s ease-in-out infinite;
  }
  .pfv-browser {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 78%; max-width: 560px;
    border-radius: 10px; border: 1px solid #1a2a4a; background: #050508;
    overflow: hidden; box-shadow: 0 20px 60px rgba(36,99,235,0.15);
  }
  .pfv-topbar {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px; background: #050508; border-bottom: 1px solid #0f1d38;
  }
  .pfv-dot { width: 8px; height: 8px; border-radius: 999px; background: #2463EB; }
  .pfv-url {
    flex: 1; margin-left: 6px; font-family: ui-monospace, Menlo, monospace;
    font-size: 10px; color: #2463EB; padding: 4px 10px;
    background: #07080e; border: 1px solid #0f1d38; border-radius: 6px;
  }
  .pfv-url::after {
    content: "▍"; color: #2463EB; margin-left: 2px;
    animation: pfv-blink 1s step-end infinite;
  }
  .pfv-body { display: grid; grid-template-columns: 40px 1fr 130px; gap: 10px; padding: 12px; }
  .pfv-side { display: flex; flex-direction: column; gap: 8px; }
  .pfv-side-block {
    width: 28px; height: 28px; border-radius: 6px;
    background: #07080e; border: 1px solid #1a2a4a;
  }
  .pfv-side-block.active { border-color: #2463EB; background: rgba(36,99,235,0.12); }
  .pfv-main { display: flex; flex-direction: column; gap: 10px; }
  .pfv-hero {
    position: relative; overflow: hidden;
    height: 70px; border-radius: 6px;
    background: #060a14; border: 1px solid #0f1d38;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800; letter-spacing: 0.2em; color: #2463EB;
  }
  .pfv-hero::before {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(36,99,235,0.35), transparent);
    transform: translateX(-100%);
    animation: pfv-scan 3s ease-in-out infinite;
  }
  @keyframes pfv-scan {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .pfv-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .pfv-col {
    height: 50px; border-radius: 6px;
    background: #060a14; border: 1px solid #0f1d38;
    padding: 8px; display: flex; flex-direction: column; gap: 5px; justify-content: center;
  }
  .pfv-bar { height: 4px; border-radius: 999px; background: #2463EB; transform-origin: left; transform: scaleX(0); }
  .pfv-c1 .pfv-bar { animation: pfv-grow 2.4s ease-in-out infinite; }
  .pfv-c2 .pfv-bar { animation: pfv-grow 2.4s ease-in-out infinite 0.2s; }
  .pfv-c3 .pfv-bar { animation: pfv-grow 2.4s ease-in-out infinite 0.4s; }
  .pfv-c1 .pfv-bar:nth-child(1) { opacity: 0.6; width: 80%; }
  .pfv-c1 .pfv-bar:nth-child(2) { opacity: 0.4; width: 55%; }
  .pfv-c2 .pfv-bar:nth-child(1) { opacity: 0.6; width: 70%; }
  .pfv-c2 .pfv-bar:nth-child(2) { opacity: 0.3; width: 90%; }
  .pfv-c3 .pfv-bar:nth-child(1) { opacity: 0.4; width: 60%; }
  .pfv-c3 .pfv-bar:nth-child(2) { opacity: 0.3; width: 75%; }
  @keyframes pfv-grow {
    0%, 100% { transform: scaleX(0.2); }
    50% { transform: scaleX(1); }
  }
  .pfv-right {
    display: flex; flex-direction: column; gap: 8px;
    background: #060a14; border: 1px solid #0f1d38; border-radius: 6px; padding: 8px;
  }
  .pfv-label { font-size: 8px; font-weight: 800; letter-spacing: 0.2em; color: rgba(36,99,235,0.7); }
  .pfv-niche {
    font-size: 9px; padding: 5px 8px; border-radius: 4px;
    background: #050508; border: 1px solid #0f1d38; color: rgba(36,99,235,0.6);
  }
  .pfv-niche.active { border-color: #2463EB; color: #2463EB; background: rgba(36,99,235,0.08); }
  .pfv-swatches { display: flex; gap: 6px; }
  .pfv-sw { width: 14px; height: 14px; border-radius: 4px; }
  .pfv-sw.s1 { background: #2463EB; }
  .pfv-sw.s2 { background: rgba(36,99,235,0.5); }
  .pfv-sw.s3 { background: rgba(36,99,235,0.25); }

  .pfv-chip {
    position: absolute; z-index: 4;
    padding: 6px 10px; border-radius: 8px;
    background: #050508; border: 1px solid #1a2a4a;
    font-size: 9px; font-weight: 700; color: rgba(36,99,235,0.85);
    letter-spacing: 0.06em;
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  }
  .pfv-chip .lbl { display: block; font-size: 7px; font-weight: 800; color: rgba(36,99,235,0.5); letter-spacing: 0.18em; margin-bottom: 2px; }
  .pfv-chip .val { color: #ffffff; font-weight: 800; }
  .pfv-chip-tl { top: 18%; left: 3%; }
  .pfv-chip-tr { top: 14%; right: 3%; }
  .pfv-chip-bl { bottom: 14%; left: 4%; }
  .pfv-chip-br { bottom: 12%; right: 3%; }

  /* ==== Card 2 (extension) ==== */
  .pfv-ext-stage {
    position: absolute; inset: 0;
    display: grid; grid-template-columns: 1fr 1fr; align-items: center;
    padding: 30px;
  }
  .pfv-ext-left { position: relative; height: 100%; display: flex; align-items: center; justify-content: center; }
  .pfv-inf-circle {
    position: relative;
    width: 100px; height: 100px; border-radius: 999px;
    border: 2px solid #2463EB; background: #07080e;
    display: flex; align-items: center; justify-content: center;
    color: #2463EB; font-size: 44px; font-weight: 800;
    z-index: 3;
    animation: pfv-glow 3s ease-in-out infinite;
  }
  @keyframes pfv-glow {
    0%, 100% { box-shadow: 0 0 0 rgba(36,99,235,0.2); }
    50% { box-shadow: 0 0 30px rgba(36,99,235,0.5); }
  }
  .pfv-ring {
    position: absolute; left: 50%; top: 50%;
    border-radius: 999px; border: 1px dashed rgba(36,99,235,0.18);
    pointer-events: none;
  }
  .pfv-ring .rd {
    position: absolute; width: 7px; height: 7px; border-radius: 999px;
    background: #2463EB; box-shadow: 0 0 10px #2463EB;
  }
  .pfv-ring1 {
    width: 110px; height: 110px; margin: -55px 0 0 -55px;
    animation: pfv-spin 7s linear infinite;
  }
  .pfv-ring2 {
    width: 160px; height: 160px; margin: -80px 0 0 -80px;
    animation: pfv-spin-r 11s linear infinite;
  }
  @keyframes pfv-spin { to { transform: rotate(360deg); } }
  @keyframes pfv-spin-r { to { transform: rotate(-360deg); } }
  .pfv-ring .rd-t { top: -3.5px; left: 50%; margin-left: -3.5px; }
  .pfv-ring .rd-b { bottom: -3.5px; left: 50%; margin-left: -3.5px; }

  .pfv-pulse {
    position: absolute; left: 50%; top: 50%;
    width: 100px; height: 100px; margin: -50px 0 0 -50px;
    border: 1px solid rgba(36,99,235,0.5); border-radius: 999px;
    transform: scale(1); opacity: 0;
    animation: pfv-pulse-ring 3s ease-out infinite;
  }
  .pfv-pulse.p2 { animation-delay: 1s; }
  .pfv-pulse.p3 { animation-delay: 2s; }
  @keyframes pfv-pulse-ring {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  .pfv-ext-chips {
    position: absolute; left: 50%; bottom: 12%; transform: translateX(-50%);
    display: flex; gap: 6px; z-index: 4;
  }
  .pfv-ext-chips .pc {
    padding: 4px 10px; border-radius: 999px; font-size: 9px; font-weight: 700;
    background: #07080e; border: 1px solid #1a2a4a; color: rgba(36,99,235,0.7);
  }
  .pfv-ext-chips .pc.on { border-color: #2463EB; color: #2463EB; background: rgba(36,99,235,0.1); }

  .pfv-stat {
    position: relative; overflow: hidden;
    background: #07080e; border: 1px solid #1a2a4a; border-radius: 8px;
    padding: 10px 12px; margin-bottom: 8px;
  }
  .pfv-stat::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(36,99,235,0.08), transparent);
    transform: translateX(-100%);
    animation: pfv-shimmer 3.5s ease-in-out infinite;
  }
  @keyframes pfv-shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .pfv-stat .row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .pfv-stat .lab { font-size: 8px; font-weight: 800; letter-spacing: 0.2em; color: rgba(36,99,235,0.7); }
  .pfv-stat .bdg { font-size: 7px; font-weight: 800; letter-spacing: 0.15em; padding: 2px 6px; border-radius: 999px; border: 1px solid #2463EB; color: #2463EB; }
  .pfv-stat .val { font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .pfv-stat .val small { color: rgba(36,99,235,0.7); font-weight: 600; font-size: 9px; margin-left: 4px; }
  .pfv-stat .pb { height: 3px; border-radius: 999px; background: rgba(36,99,235,0.15); overflow: hidden; position: relative; }
  .pfv-stat .pb i { display: block; height: 100%; background: #2463EB; }
  .pfv-stat .pb i.fill { width: 100%; animation: pfv-pulse-dot 2s ease-in-out infinite; }
  .pfv-stat .pb i.grow { width: 0; animation: pfv-grow-w 3s ease-in-out infinite; }
  @keyframes pfv-grow-w {
    0%, 100% { width: 0; }
    50% { width: 78%; }
  }

  /* ==== Card 3 (contract) ==== */
  .pfv-doc {
    position: absolute; top: 50%; left: 32px; transform: translateY(-50%);
    width: 46%; max-width: 320px;
    background: #07080e; border: 1px solid #1a2a4a; border-radius: 12px;
    padding: 18px; z-index: 3;
  }
  .pfv-doc-head {
    display: flex; justify-content: space-between; align-items: center;
    padding-bottom: 12px; border-bottom: 1px solid #1a2a4a; margin-bottom: 14px;
  }
  .pfv-doc-head .t { font-size: 11px; font-weight: 800; letter-spacing: 0.2em; color: #fff; }
  .pfv-doc-head .b { font-size: 8px; font-weight: 800; letter-spacing: 0.15em; padding: 3px 8px; border-radius: 999px; border: 1px solid #2463EB; color: #2463EB; }
  .pfv-field { margin-bottom: 12px; position: relative; overflow: hidden; }
  .pfv-field .l { font-size: 8px; font-weight: 800; letter-spacing: 0.18em; color: rgba(36,99,235,0.6); margin-bottom: 4px; }
  .pfv-field .v {
    font-family: ui-monospace, Menlo, monospace;
    font-size: 11px; color: #fff; height: 14px; overflow: hidden; white-space: nowrap;
  }
  .pfv-field .v span {
    display: inline-block; overflow: hidden; vertical-align: bottom;
    white-space: nowrap; width: 0;
    animation: pfv-type 4s steps(30, end) infinite;
  }
  .pfv-f1 .v span { animation-delay: 0s; }
  .pfv-f2 .v span { animation-delay: 0.8s; }
  .pfv-f3 .v span { animation-delay: 1.4s; }
  @keyframes pfv-type {
    0% { width: 0; }
    40%, 90% { width: 100%; }
    100% { width: 0; }
  }
  .pfv-field::after {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(90deg, transparent, rgba(36,99,235,0.18), transparent);
    transform: translateX(-100%);
    animation: pfv-scan 4s ease-in-out infinite;
  }
  .pfv-f2::after { animation-delay: 0.6s; }
  .pfv-f3::after { animation-delay: 1.2s; }
  .pfv-sig {
    margin-top: 12px; padding-top: 12px; border-top: 1px solid #1a2a4a;
    display: flex; justify-content: space-between; align-items: center;
  }
  .pfv-sig .name {
    font-family: 'Times New Roman', serif; font-style: italic; font-size: 18px; color: #fff;
    opacity: 0; transform: translateX(-8px);
    animation: pfv-sign 5s ease-in-out infinite 2.4s;
  }
  @keyframes pfv-sign {
    0%, 30% { opacity: 0; transform: translateX(-8px); }
    50%, 100% { opacity: 0.9; transform: translateX(0); }
  }
  .pfv-stamp {
    width: 50px; height: 50px; border-radius: 999px;
    border: 2px solid #2463EB; color: #2463EB;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 22px;
    transform: scale(0.4) rotate(-30deg); opacity: 0;
    animation: pfv-stamp 5s ease-in-out infinite 3s;
  }
  @keyframes pfv-stamp {
    0%, 40% { transform: scale(0.4) rotate(-30deg); opacity: 0; }
    60%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  .pfv-side-col {
    position: absolute; top: 50%; right: 24px; transform: translateY(-50%);
    width: 38%; max-width: 240px; z-index: 3;
    display: flex; flex-direction: column; gap: 8px;
  }
  .pfv-step {
    display: flex; align-items: center; gap: 10px;
    background: #07080e; border: 1px solid #1a2a4a; border-radius: 8px;
    padding: 8px 10px;
  }
  .pfv-step .ico {
    width: 22px; height: 22px; border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800;
  }
  .pfv-step.done .ico { background: #2463EB; color: #fff; }
  .pfv-step.active .ico { border: 1px solid #2463EB; color: #2463EB; }
  .pfv-step.active .ico::after {
    content: ""; width: 6px; height: 6px; border-radius: 999px; background: #2463EB;
    animation: pfv-pulse-dot 1.4s ease-in-out infinite;
  }
  .pfv-step .meta { display: flex; flex-direction: column; }
  .pfv-step .et { font-size: 7px; font-weight: 800; letter-spacing: 0.2em; color: rgba(36,99,235,0.6); }
  .pfv-step .tx { font-size: 10px; font-weight: 700; color: #fff; }
  .pfv-prog {
    background: #07080e; border: 1px solid #1a2a4a; border-radius: 8px; padding: 10px;
  }
  .pfv-prog .row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .pfv-prog .l { font-size: 8px; font-weight: 800; letter-spacing: 0.2em; color: rgba(36,99,235,0.6); }
  .pfv-prog .p { font-size: 10px; font-weight: 800; color: #2463EB; }
  .pfv-prog .bar { height: 3px; background: rgba(36,99,235,0.15); border-radius: 999px; overflow: hidden; }
  .pfv-prog .bar i { display: block; height: 100%; background: #2463EB; width: 0; animation: pfv-fill 5s ease-in-out infinite; }
  @keyframes pfv-fill {
    0% { width: 0; }
    90%, 100% { width: 100%; }
  }
  .pfv-send {
    display: flex; align-items: center; gap: 8px;
    background: #07080e; border: 1px solid #1a2a4a; border-radius: 8px;
    padding: 8px 10px;
  }
  .pfv-send .d { width: 6px; height: 6px; border-radius: 999px; background: #2463EB; animation: pfv-blink 1.2s step-end infinite; }
  .pfv-send .tx { font-size: 10px; font-weight: 700; color: #fff; }
`;

export function SitesBuilderVisual() {
  return (
    <div className="pfv-card">
      <style>{sharedStyles}</style>
      <div className="pfv-grid" />
      <div className="pfv-orb" />
      <ParticleNet id="canvas-sites" />

      <div className="pfv-sites-badge">
        <span className="dot" /> IA GERANDO
      </div>

      <div className="pfv-chip pfv-chip-tr pfv-float-b">
        <span className="lbl">SITES GERADOS</span>
        <span className="val">542 hoje</span>
      </div>
      <div className="pfv-chip pfv-chip-tl pfv-float-c">
        <span className="lbl">IA STATUS</span>
        <span className="val">● ATIVA</span>
      </div>
      <div className="pfv-chip pfv-chip-br pfv-float-d">
        <span className="lbl">NICHO ATIVO</span>
        <span className="val">Barbearia ✓</span>
      </div>

      <div className="pfv-browser pfv-float-a">
        <div className="pfv-topbar">
          <span className="pfv-dot" style={{ opacity: 0.8 }} />
          <span className="pfv-dot" style={{ opacity: 0.4 }} />
          <span className="pfv-dot" style={{ opacity: 0.2 }} />
          <span className="pfv-url">axionfly.site/criar</span>
        </div>
        <div className="pfv-body">
          <div className="pfv-side">
            <div className="pfv-side-block active" />
            <div className="pfv-side-block" />
            <div className="pfv-side-block" />
            <div className="pfv-side-block" />
          </div>
          <div className="pfv-main">
            <div className="pfv-hero">GERANDO SITE COM IA...</div>
            <div className="pfv-cols">
              <div className="pfv-col pfv-c1"><div className="pfv-bar" /><div className="pfv-bar" /></div>
              <div className="pfv-col pfv-c2"><div className="pfv-bar" /><div className="pfv-bar" /></div>
              <div className="pfv-col pfv-c3"><div className="pfv-bar" /><div className="pfv-bar" /></div>
            </div>
          </div>
          <div className="pfv-right">
            <div className="pfv-label">NICHO</div>
            <div className="pfv-niche active">Barbearia ✓</div>
            <div className="pfv-niche">Restaurante</div>
            <div className="pfv-niche">Academia</div>
            <div className="pfv-label" style={{ marginTop: 4 }}>CORES</div>
            <div className="pfv-swatches">
              <span className="pfv-sw s1" />
              <span className="pfv-sw s2" />
              <span className="pfv-sw s3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExtensionInfiniteVisual() {
  return (
    <div className="pfv-card">
      <style>{sharedStyles}</style>
      <div className="pfv-grid" />
      <div className="pfv-orb" />
      <ParticleNet id="canvas-lovable" />

      <div className="pfv-ext-stage">
        <div className="pfv-ext-left">
          <div className="pfv-pulse" />
          <div className="pfv-pulse p2" />
          <div className="pfv-pulse p3" />
          <div className="pfv-ring pfv-ring1">
            <span className="rd rd-t" />
            <span className="rd rd-b" />
          </div>
          <div className="pfv-ring pfv-ring2">
            <span className="rd rd-t" />
            <span className="rd rd-b" />
          </div>
          <div className="pfv-inf-circle">∞</div>

          <div className="pfv-ext-chips">
            <span className="pc on">∞ Sem limite</span>
            <span className="pc">Hyperbuild Pro</span>
            <span className="pc">Escala total</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="pfv-stat pfv-float-b">
            <div className="row"><span className="lab">CRÉDITOS ATIVOS</span><span className="bdg">ILIMITADO</span></div>
            <div className="val">∞ <small>disponível agora</small></div>
            <div className="pb"><i className="fill" /></div>
          </div>
          <div className="pfv-stat pfv-float-c">
            <div className="row"><span className="lab">SITES CRIADOS</span><span className="bdg">+8% ↑</span></div>
            <div className="val">542 <small>este mês</small></div>
            <div className="pb"><i className="grow" /></div>
          </div>
          <div className="pfv-stat pfv-float-d">
            <div className="row"><span className="lab">PARCERIA</span><span className="bdg">ATIVO</span></div>
            <div className="val">Hyperbuild Pro</div>
            <div className="pb"><i className="fill" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContractGeneratorVisual() {
  return (
    <div className="pfv-card">
      <style>{sharedStyles}</style>
      <div className="pfv-grid" />
      <div className="pfv-orb" />
      <ParticleNet id="canvas-contrato" />

      <div className="pfv-doc pfv-float-a">
        <div className="pfv-doc-head">
          <span className="t">CONTRATO</span>
          <span className="b">AUTOMÁTICO</span>
        </div>
        <div className="pfv-field pfv-f1">
          <div className="l">CLIENTE</div>
          <div className="v"><span>João Silva — Barbearia</span></div>
        </div>
        <div className="pfv-field pfv-f2">
          <div className="l">SERVIÇO</div>
          <div className="v"><span>Site Profissional + SEO</span></div>
        </div>
        <div className="pfv-field pfv-f3">
          <div className="l">VALOR</div>
          <div className="v"><span>R$ 1.200,00</span></div>
        </div>
        <div className="pfv-sig">
          <span className="name">João Silva</span>
          <div className="pfv-stamp">✓</div>
        </div>
      </div>

      <div className="pfv-side-col">
        <div className="pfv-step done pfv-float-b">
          <div className="ico">✓</div>
          <div className="meta"><span className="et">ETAPA 1</span><span className="tx">Dados preenchidos</span></div>
        </div>
        <div className="pfv-step done pfv-float-c">
          <div className="ico">✓</div>
          <div className="meta"><span className="et">ETAPA 2</span><span className="tx">Contrato gerado</span></div>
        </div>
        <div className="pfv-step active pfv-float-d">
          <div className="ico" />
          <div className="meta"><span className="et">ETAPA 3</span><span className="tx">Enviando pelo WPP</span></div>
        </div>
        <div className="pfv-prog">
          <div className="row"><span className="l">PROGRESSO</span><span className="p">100%</span></div>
          <div className="bar"><i /></div>
        </div>
        <div className="pfv-send">
          <span className="d" /><span className="tx">Enviando pelo WhatsApp</span>
        </div>
      </div>
    </div>
  );
}
