import { MeshGradient } from "@paper-design/shaders-react";

export function ShaderBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[#0f0f12]" />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-60"
        colors={["#0f0f12", "#18181f", "#23232e", "#15151a", "#0c0c10"]}
        speed={0.2}
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-30 mix-blend-screen"
        colors={["#0a0a0e", "#14141c", "#1a1a24", "#08080a"]}
        speed={0.12}
      />
      {/* Vinheta para escurecer bordas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,15,18,0.9)_100%)]" />
    </div>
  );
}
