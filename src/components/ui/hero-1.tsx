import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RocketIcon, ArrowRightIcon, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShutterText from "@/components/ui/hero-shutter-text";

export function HeroSection() {
	const navigate = useNavigate();

	return (
		<section className="mx-auto w-full max-w-5xl">
			{/* Top Shades */}
			<div
				aria-hidden="true"
				className="absolute inset-0 isolate hidden overflow-hidden lg:block"
			>
				<div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,hsl(var(--foreground)/.08),transparent)]" />
			</div>

			{/* main content */}
			<div className="relative flex flex-col items-center justify-center gap-5 pt-32 pb-20">
				<a
					className={cn(
						"group mx-auto flex w-fit items-center gap-3 rounded-full border border-border bg-card px-3 py-1 shadow",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out"
					)}
					href="#pricing"
				>
					<RocketIcon className="size-3 text-primary" />
					<span className="text-xs text-muted-foreground">Plataforma de criação de sites com IA</span>
					<span className="block h-5 border-l border-border" />
					<ArrowRightIcon className="size-3 text-muted-foreground duration-150 ease-out group-hover:translate-x-1 group-hover:text-primary" />
				</a>

				<div className="fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards text-center delay-100 duration-500 ease-out space-y-3">
					<h1 className="text-balance text-4xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl leading-[1.08]">
						Crie Sites com IA e Venda para
					</h1>
					<div className="flex justify-center">
						<ShutterText
							words={["BARBEARIAS", "PIZZARIAS", "HAMBURGUERIAS", "ACADEMIAS", "CLÍNICAS", "RESTAURANTES"]}
							interval={2200}
						/>
					</div>
				</div>

				<p className="fade-in slide-in-from-bottom-10 mx-auto max-w-lg animate-in fill-mode-backwards text-center text-base text-muted-foreground tracking-wide delay-200 duration-500 ease-out sm:text-lg md:text-xl leading-relaxed">
					A IA encontra negócios <span className="text-foreground font-semibold">sem site</span> no Google Maps.
					Você cria o site em minutos e <span className="text-foreground font-semibold">fecha o contrato</span>.
				</p>

				<div className="fade-in slide-in-from-bottom-10 flex animate-in flex-row flex-wrap items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
					<Button variant="neon" size="lg" className="rounded-full" onClick={() => navigate("/auth")}>
						<Zap className="size-4 mr-2" />
						Criar Meu Primeiro Site
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
