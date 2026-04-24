import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShutterText from "@/components/ui/hero-shutter-text";

export function HeroSection() {
	const navigate = useNavigate();

	return (
		<section id="inicio" className="mx-auto w-full max-w-5xl">
			{/* Top Shades */}
			<div
				aria-hidden="true"
				className="absolute inset-0 isolate hidden overflow-hidden lg:block"
			>
				<div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,hsl(var(--foreground)/.08),transparent)]" />
			</div>

			{/* main content */}
			<div className="relative flex flex-col items-center justify-center gap-4 pt-20 pb-10 md:gap-5 md:pt-32 md:pb-20">
			<a
				className={cn(
					"group mx-auto flex w-fit items-center gap-3 rounded-full border border-border bg-card px-4 py-1.5 shadow",
					"fade-in slide-in-from-bottom-5 animate-in fill-mode-backwards transition-all duration-300 ease-out"
				)}
				href="#etapas"
			>
				<span className="text-xs text-muted-foreground font-medium">Veja como começar - Simples e Fácil</span>
				<span className="block h-4 border-l border-border" />
				<ArrowRightIcon className="size-3 text-muted-foreground duration-150 ease-out group-hover:translate-x-1 group-hover:text-primary" />
			</a>

				<div className="fade-in slide-in-from-bottom-5 animate-in fill-mode-backwards text-center duration-300 ease-out space-y-3">
					<h1 className="text-balance text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl leading-[1.08]">
						Crie Sites Feitos por IA e Venda para
					</h1>
					<div className="flex justify-center">
						<span className="block text-center text-4xl font-black leading-none gradient-text md:text-6xl lg:text-7xl">
							COMÉRCIOS
						</span>
					</div>
				</div>

				<p className="fade-in slide-in-from-bottom-5 mx-auto max-w-xl animate-in fill-mode-backwards text-center text-base text-muted-foreground tracking-wide delay-100 duration-300 ease-out sm:text-lg md:text-xl leading-relaxed">
					Escolha o plano ideal para você. Comece seu negócio{" "}
					<span className="text-foreground font-semibold">com a liberdade</span> de crescer ainda mais.
				</p>

				<div className="fade-in slide-in-from-bottom-5 flex animate-in flex-row flex-wrap items-center justify-center gap-3 fill-mode-backwards pt-2 delay-150 duration-300 ease-out">
					<Button variant="neon" size="lg" className="rounded-full" onClick={() => navigate("/auth")}>
						<Zap className="size-4 mr-2" />
						Assinar agora
					</Button>
					<Button className="rounded-full" size="lg" variant="outline" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
						Ver Planos
						<ArrowRightIcon className="size-4 ms-2" />
					</Button>
				</div>
			</div>
		</section>
	);
}
