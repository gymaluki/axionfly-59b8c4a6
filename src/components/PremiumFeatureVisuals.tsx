import { useEffect, useState } from "react";
import hyperbuildExtension from "@/assets/hyperbuild-extension.png";

const sharedStyles = `
  .pfv {
    --bg: #050508;
    --surface: #0d0d1a;
    --surface-2: #0a0a16;
    --border: rgba(36,99,235,0.22);
    --border-strong: rgba(36,99,235,0.45);
    --primary: #2463EB;
    --text: #ffffff;
    --muted: #8b92a5;
    --green: #1a9e6e;
    position: relative;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    aspect-ratio: 4/3;
    border-radius: 12px;
    border: 1px solid var(--border);
    background:
      radial-gradient(80% 60% at 50% 0%, rgba(36,99,235,0.10), transparent 70%),
      var(--bg);
    overflow: visible;
    color: var(--text);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  .pfv * { box-sizing: border-box; }
  .pfv-grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(36,99,235,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(36,99,235,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    border-radius: 12px;
    pointer-events: none;
    mask-image: radial-gradient(80% 80% at 50% 50%, #000, transparent);
  }

  /* Browser window */
  .pfv-browser {
    position: absolute; top: 18px; left: 18px; right: 18px; bottom: 56px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(36,99,235,0.06);
  }
  .pfv-chrome {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px;
    background: #07070f;
    border-bottom: 1px solid var(--border);
  }
  .pfv-dots { display: flex; gap: 5px; }
  .pfv-dots i { width: 9px; height: 9px; border-radius: 999px; display: block; }
  .pfv-dots i:nth-child(1) { background: #ef4444; }
  .pfv-dots i:nth-child(2) { background: #facc15; }
  .pfv-dots i:nth-child(3) { background: #22c55e; }
  .pfv-url {
    flex: 1; font-family: ui-monospace, Menlo, monospace;
    font-size: 10px; color: #9bb5ff;
    padding: 4px 10px;
    background: #050508;
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .pfv-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 3px 9px; border-radius: 999px;
    font-size: 9px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
    border: 1px solid var(--border-strong); color: var(--primary);
    background: rgba(36,99,235,0.10);
  }
  .pfv-pill.green { color: #22d394; border-color: rgba(34,211,148,0.5); background: rgba(26,158,110,0.10); }
  .pfv-pill .d { width: 6px; height: 6px; border-radius: 999px; background: currentColor; animation: pfv-pulse-dot 1.4s ease-in-out infinite; }
  @keyframes pfv-pulse-dot { 0%,100% { opacity: 1; transform: scale(1);} 50% { opacity: .35; transform: scale(.8);} }
  @keyframes pfv-blink { 0%,100% { opacity:1 } 50% { opacity:0 } }

  /* Floating stat card outside browser */
  .pfv-floating {
    position: absolute;
    background: linear-gradient(180deg, #0e1224, #0a0d1c);
    border: 1px solid var(--border-strong);
    border-radius: 10px;
    padding: 6px 10px;
    box-shadow: 0 14px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(36,99,235,0.08);
    z-index: 5;
  }
  .pfv-floating .lab {
    display: block; font-size: 9px; font-weight: 800; letter-spacing: 0.12em;
    text-transform: uppercase; color: #9aa4bd; margin-bottom: 2px;
  }
  .pfv-floating .val { font-size: 14px; font-weight: 800; color: #fff; }
  .pfv-floating .val em { color: var(--primary); font-style: normal; }
  .pfv-floating.green { border-color: rgba(34,211,148,0.45); }
  .pfv-floating.green .val em { color: #22d394; }
  .pfv-float-anim { animation: pfv-float 4.5s ease-in-out infinite; }
  @keyframes pfv-float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-6px);} }

  /* ===== CARD 1 — Sites Builder ===== */
  .pfv-sb-body { display: grid; grid-template-columns: 110px 1fr; gap: 10px; padding: 10px; height: calc(100% - 38px); }
  .pfv-sb-niches {
    display: flex; flex-direction: column; gap: 5px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px;
  }
  .pfv-sb-niches .h { font-size: 8px; font-weight: 800; letter-spacing: 0.14em; color: #6f7895; text-transform: uppercase; margin-bottom: 4px; }
  .pfv-sb-niche {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 10px; font-weight: 600; color: #b9c2d8;
    padding: 5px 7px; border-radius: 6px;
    border: 1px solid transparent;
    background: rgba(255,255,255,0.015);
  }
  .pfv-sb-niche.active {
    color: #fff; background: rgba(36,99,235,0.14);
    border-color: var(--border-strong);
  }
  .pfv-sb-niche .ck {
    width: 14px; height: 14px; border-radius: 4px;
    background: var(--primary); color: #fff;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 800;
  }
  .pfv-sb-preview {
    position: relative; overflow: hidden;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px;
    display: flex; flex-direction: column; gap: 7px;
  }
  .pfv-sk { background: #11162a; border-radius: 5px; position: relative; overflow: hidden; }
  .pfv-sk::before {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(36,99,235,0.18), transparent);
    transform: translateX(-100%);
    animation: pfv-shimmer 2.2s ease-in-out infinite;
  }
  @keyframes pfv-shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(120%)} }
  .pfv-sb-preview .nav { display: flex; gap: 6px; align-items: center; }
  .pfv-sb-preview .logo { width: 22px; height: 8px; border-radius: 3px; background: var(--primary); }
  .pfv-sb-preview .nav .sk { flex: 1; height: 5px; }
  .pfv-sb-preview .hero { height: 50px; background: linear-gradient(135deg, rgba(36,99,235,0.35), rgba(36,99,235,0.1)); border-radius: 6px; padding: 8px; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
  .pfv-sb-preview .hero .t { width: 70%; height: 7px; border-radius: 3px; background: rgba(255,255,255,0.85); }
  .pfv-sb-preview .hero .s { width: 50%; height: 4px; border-radius: 3px; background: rgba(255,255,255,0.45); }
  .pfv-sb-preview .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; }
  .pfv-sb-preview .grid .sk { height: 22px; }
  .pfv-sb-preview .footer { height: 8px; }
  .pfv-sb-stage { animation: pfv-cycle1 6s ease-in-out infinite; }
  @keyframes pfv-cycle1 {
    0%, 15% { opacity: 0.35; filter: blur(2px); }
    35%, 85% { opacity: 1; filter: blur(0); }
    100% { opacity: 0.35; filter: blur(2px); }
  }

  /* ===== CARD 2 — Plano Infinito ===== */
  .pfv-pl-body { padding: 12px; height: calc(100% - 38px); display: flex; flex-direction: column; gap: 8px; }
  .pfv-pl-card {
    flex: 1;
    background: linear-gradient(180deg, rgba(36,99,235,0.10), transparent 60%), var(--surface-2);
    border: 1px solid var(--border-strong);
    border-radius: 10px;
    padding: 12px;
    display: flex; flex-direction: column; gap: 9px;
  }
  .pfv-pl-head { display: flex; align-items: center; justify-content: space-between; }
  .pfv-pl-head .name { font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #fff; }
  .pfv-row { display: flex; justify-content: space-between; align-items: baseline; }
  .pfv-row .l { font-size: 9px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #8089a3; }
  .pfv-row .v { font-size: 18px; font-weight: 800; color: #fff; }
  .pfv-row .v em { color: var(--primary); font-style: normal; }
  .pfv-row .v.sm { font-size: 14px; }
  .pfv-badge-up { font-size: 9px; font-weight: 800; color: #22d394; padding: 2px 6px; border-radius: 999px; background: rgba(26,158,110,0.15); border: 1px solid rgba(34,211,148,0.4); margin-left: 6px; }
  .pfv-progress { display: flex; flex-direction: column; gap: 5px; }
  .pfv-progress .h { display: flex; justify-content: space-between; }
  .pfv-progress .h .l { font-size: 9px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #8089a3; }
  .pfv-progress .h .p { font-size: 10px; font-weight: 800; color: var(--primary); }
  .pfv-progress .bar { height: 5px; border-radius: 999px; background: rgba(36,99,235,0.15); overflow: hidden; }
  .pfv-progress .bar i { display: block; height: 100%; background: linear-gradient(90deg, var(--primary), #6e9bff); width: 0; animation: pfv-fill 4s ease-in-out infinite; border-radius: 999px; }
  @keyframes pfv-fill { 0% { width: 0; } 80%, 100% { width: 100%; } }
  .pfv-divider { height: 1px; background: var(--border); margin: 2px 0; }

  /* ===== CARD 3 — Contract ===== */
  .pfv-ct-body { display: grid; grid-template-columns: 1fr 130px; gap: 10px; padding: 10px; height: calc(100% - 38px); }
  .pfv-ct-doc {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px;
    display: flex; flex-direction: column; gap: 8px;
    overflow: hidden;
  }
  .pfv-ct-doc .h {
    display: flex; justify-content: space-between; align-items: center;
    padding-bottom: 6px; border-bottom: 1px solid var(--border);
  }
  .pfv-ct-doc .h .t { font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: #fff; text-transform: uppercase; }
  .pfv-field { display: flex; flex-direction: column; gap: 2px; }
  .pfv-field .l { font-size: 8px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #6f7895; }
  .pfv-field .v {
    font-family: ui-monospace, Menlo, monospace;
    font-size: 10px; color: #fff;
    min-height: 13px; white-space: nowrap; overflow: hidden;
  }
  .pfv-field .v::after { content: "▍"; color: var(--primary); margin-left: 1px; animation: pfv-blink 0.9s step-end infinite; }
  .pfv-ct-body-text {
    margin-top: 2px; padding-top: 6px; border-top: 1px dashed var(--border);
    display: flex; flex-direction: column; gap: 4px;
  }
  .pfv-ct-body-text .ln { height: 4px; border-radius: 3px; background: rgba(36,99,235,0.15); width: 0; animation: pfv-grow-w 5s ease-in-out infinite; }
  .pfv-ct-body-text .ln:nth-child(1) { animation-delay: 1.2s; }
  .pfv-ct-body-text .ln:nth-child(2) { animation-delay: 1.6s; max-width: 90%; }
  .pfv-ct-body-text .ln:nth-child(3) { animation-delay: 2.0s; max-width: 60%; }
  @keyframes pfv-grow-w { 0%, 10% { width: 0; } 60%, 100% { width: 100%; } }

  .pfv-ct-side { display: flex; flex-direction: column; gap: 7px; }
  .pfv-step {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 8px; padding: 7px 8px;
  }
  .pfv-step .ico {
    width: 20px; height: 20px; border-radius: 999px; flex-shrink: 0;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800;
    border: 1px solid var(--border);
    color: #6f7895;
  }
  .pfv-step.done .ico { background: var(--primary); color: #fff; border-color: var(--primary); }
  .pfv-step.active .ico { color: var(--primary); border-color: var(--primary); position: relative; }
  .pfv-step.active .ico::before {
    content: ""; position: absolute; inset: 2px; border-radius: 999px;
    border: 2px solid transparent; border-top-color: var(--primary);
    animation: pfv-spin 0.9s linear infinite;
  }
  .pfv-step.send .ico { color: #22d394; border-color: rgba(34,211,148,0.5); }
  .pfv-step.send .ico::after {
    content: ""; position: absolute; width: 6px; height: 6px; border-radius: 999px; background: #22d394;
    animation: pfv-pulse-dot 1.2s ease-in-out infinite;
  }
  .pfv-step.send .ico { position: relative; }
  @keyframes pfv-spin { to { transform: rotate(360deg); } }
  .pfv-step .meta { display: flex; flex-direction: column; min-width: 0; }
  .pfv-step .et { font-size: 7px; font-weight: 800; letter-spacing: 0.16em; color: #6f7895; text-transform: uppercase; }
  .pfv-step .tx { font-size: 9px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pfv-progbar {
    margin-top: auto;
    background: var(--surface-2); border: 1px solid var(--border);
    border-radius: 8px; padding: 8px;
  }
  .pfv-progbar .h { display: flex; justify-content: space-between; margin-bottom: 5px; }
  .pfv-progbar .l { font-size: 7px; font-weight: 800; letter-spacing: 0.16em; color: #6f7895; text-transform: uppercase; }
  .pfv-progbar .p { font-size: 9px; font-weight: 800; color: #22d394; }
  .pfv-progbar .bar { height: 4px; border-radius: 999px; background: rgba(34,211,148,0.15); overflow: hidden; }
  .pfv-progbar .bar i { display: block; height: 100%; background: linear-gradient(90deg, #1a9e6e, #22d394); width: 0; animation: pfv-fill 5s ease-in-out infinite; }

  @media (prefers-reduced-motion: reduce) {
    .pfv *, .pfv *::before, .pfv *::after { animation: none !important; }
  }
`;

/* Typing hook with loop */
function useTyping(text: string, speed = 45, startDelay = 0, loopDelay = 3500) {
  const [val, setVal] = useState("");
  useEffect(() => {
    let i = 0;
    let mounted = true;
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    const run = () => {
      if (!mounted) return;
      setVal("");
      i = 0;
      interval = setInterval(() => {
        if (!mounted) return;
        i++;
        setVal(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          timeout = setTimeout(run, loopDelay);
        }
      }, speed);
    };
    timeout = setTimeout(run, startDelay);
    return () => {
      mounted = false;
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay, loopDelay]);
  return val;
}

/* ============= CARD 1: Sites Builder ============= */
export function SitesBuilderVisual() {
  const niches = ["Barbearia", "Restaurante", "Salão", "Clínica", "Advocacia"];
  return (
    <div className="pfv">
      <style>{sharedStyles}</style>
      <div className="pfv-grid-bg" />

      <div className="pfv-browser">
        <div className="pfv-chrome">
          <div className="pfv-dots"><i /><i /><i /></div>
          <div className="pfv-url">axionfly.site/criar</div>
          <span className="pfv-pill"><span className="d" />IA Gerando</span>
        </div>

        <div className="pfv-sb-body">
          <div className="pfv-sb-niches">
            <div className="h">Nicho</div>
            {niches.map((n, idx) => (
              <div key={n} className={`pfv-sb-niche ${idx === 0 ? "active" : ""}`}>
                <span>{n}</span>
                {idx === 0 && <span className="ck">✓</span>}
              </div>
            ))}
          </div>

          <div className="pfv-sb-preview pfv-sb-stage">
            <div className="nav">
              <span className="logo" />
              <span className="sk pfv-sk" />
              <span className="sk pfv-sk" style={{ flex: "0 0 18px" }} />
              <span className="sk pfv-sk" style={{ flex: "0 0 18px" }} />
            </div>
            <div className="hero">
              <span className="t" />
              <span className="s" />
            </div>
            <div className="grid">
              <span className="pfv-sk" />
              <span className="pfv-sk" />
              <span className="pfv-sk" />
            </div>
            <div className="footer pfv-sk" />
          </div>
        </div>
      </div>

      <div className="pfv-floating pfv-float-anim" style={{ bottom: -8, right: 10 }}>
        <span className="lab">Sites gerados</span>
        <span className="val"><em>542</em> hoje</span>
      </div>
    </div>
  );
}

/* ============= CARD 2: Extensão HyperBuild ============= */
export function ExtensionInfiniteVisual() {
  return (
    <div className="pfv" style={{ background: "linear-gradient(135deg, #0a0512 0%, #050508 100%)" }}>
      <style>{sharedStyles}</style>
      <div className="pfv-grid-bg" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <img
          src={hyperbuildExtension}
          alt="Extensão HyperBuild Pro — créditos infinitos no Lovable"
          loading="lazy"
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            width: "auto",
            objectFit: "contain",
            borderRadius: "14px",
            boxShadow: "0 20px 60px -10px rgba(168, 85, 247, 0.45), 0 0 40px rgba(168, 85, 247, 0.2)",
          }}
        />
      </div>
    </div>
  );
}



/* ============= CARD 3: Contract Generator ============= */
export function ContractGeneratorVisual() {
  const cliente = useTyping("João Silva — Barbearia", 55, 0, 5500);
  const servico = useTyping("Site Profissional + SEO", 50, 1200, 5500);
  const valor = useTyping("R$ 1.200,00", 70, 2200, 5500);

  return (
    <div className="pfv">
      <style>{sharedStyles}</style>
      <div className="pfv-grid-bg" />

      <div className="pfv-browser">
        <div className="pfv-chrome">
          <div className="pfv-dots"><i /><i /><i /></div>
          <div className="pfv-url">axionfly.site/contrato</div>
          <span className="pfv-pill"><span className="d" />Gerando</span>
        </div>

        <div className="pfv-ct-body">
          <div className="pfv-ct-doc">
            <div className="h">
              <span className="t">Contrato</span>
              <span className="pfv-pill">Auto</span>
            </div>
            <div className="pfv-field">
              <span className="l">Cliente</span>
              <span className="v">{cliente}</span>
            </div>
            <div className="pfv-field">
              <span className="l">Serviço</span>
              <span className="v">{servico}</span>
            </div>
            <div className="pfv-field">
              <span className="l">Valor</span>
              <span className="v">{valor}</span>
            </div>
            <div className="pfv-ct-body-text">
              <span className="ln" />
              <span className="ln" />
              <span className="ln" />
            </div>
          </div>

          <div className="pfv-ct-side">
            <div className="pfv-step done">
              <span className="ico">✓</span>
              <span className="meta">
                <span className="et">Etapa 1</span>
                <span className="tx">Dados</span>
              </span>
            </div>
            <div className="pfv-step active">
              <span className="ico" />
              <span className="meta">
                <span className="et">Etapa 2</span>
                <span className="tx">Gerando</span>
              </span>
            </div>
            <div className="pfv-step send">
              <span className="ico" />
              <span className="meta">
                <span className="et">Etapa 3</span>
                <span className="tx">WhatsApp</span>
              </span>
            </div>

            <div className="pfv-progbar">
              <div className="h">
                <span className="l">Progresso</span>
                <span className="p">100%</span>
              </div>
              <div className="bar"><i /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="pfv-floating green pfv-float-anim" style={{ bottom: -8, right: 10 }}>
        <span className="lab">WhatsApp</span>
        <span className="val"><em>Enviado ✓</em></span>
      </div>
    </div>
  );
}
