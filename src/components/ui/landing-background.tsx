import bgImage from "@/assets/landing-bg.png";

export function LandingBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base preta */}
      <div className="absolute inset-0 bg-black" />
      {/* Imagem com as curvas azuis, repetida verticalmente para cobrir toda a landing */}
      <div
        className="absolute inset-0 opacity-[0.55] bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "100% auto",
          backgroundRepeat: "repeat-y",
          backgroundPosition: "center top",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.7) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      {/* Vinheta para garantir contraste do conteúdo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
    </div>
  );
}
