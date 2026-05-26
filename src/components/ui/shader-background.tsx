import { MeshGradient } from "@paper-design/shaders-react";

export function ShaderBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-50"
        colors={["#000000", "#0a0a0a", "#141414", "#080808", "#000000"]}
        speed={0.2}
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-25 mix-blend-screen"
        colors={["#000000", "#0d0d0d", "#161616", "#000000"]}
        speed={0.12}
      />
      {/* Vinheta para escurecer bordas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.95)_100%)]" />
    </div>
  );
}
