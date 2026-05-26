import { MeshGradient } from "@paper-design/shaders-react";

export function ShaderBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[#03060f]" />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-70"
        colors={["#03060f", "#0a1837", "#1e3a8a", "#0b2150", "#050912"]}
        speed={0.25}
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-40 mix-blend-screen"
        colors={["#000814", "#0a2a6b", "#1e40af", "#000000"]}
        speed={0.15}
      />
      {/* Vinheta para escurecer bordas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,6,15,0.85)_100%)]" />
    </div>
  );
}
