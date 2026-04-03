import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RocketIcon, ArrowRightIcon, Zap } from "lucide-react";
import { LogoCloud } from "@/components/ui/logo-cloud-3";
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

			{/* X Bold Faded Borders */}
			<div
				aria-hidden="true"
				className="absolute inset-0 mx-auto hidden min-h-screen w-full max-w-5xl lg:block"
			>
				<div className="absolute inset-y-0 left-0 z-10 h-full w-px bg-foreground/15" style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }} />
				<div className="absolute inset-y-0 right-0 z-10 h-full w-px bg-foreground/15" style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }} />
			</div>

			{/* main content */}
			<div className="relative flex flex-col items-center justify-center gap-5 pt-32 pb-20">
				{/* X Content Faded Borders */}
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-[1] size-full overflow-hidden"
				>
					<div className="absolute inset-y-0 left-4 w-px bg-gradient-to-b from-transparent via-border to-border md:left-8" />
					<div className="absolute inset-y-0 right-4 w-px bg-gradient-to-b from-transparent via-border to-border md:right-8" />
					<div className="absolute inset-y-0 left-8 w-px bg-gradient-to-b from-transparent via-border/50 to-border/50 md:left-12" />
					<div className="absolute inset-y-0 right-8 w-px bg-gradient-to-b from-transparent via-border/50 to-border/50 md:right-12" />
				</div>

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
							words={["BARBEARIAS", "HAMBURGUERIAS", "ACADEMIAS", "DENTISTAS", "CLÍNICAS", "RESTAURANTES"]}
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

export function LogosSection() {
	return (
		<section className="relative space-y-4 border-t border-border/50 pt-6 pb-10">
			<h2 className="text-center font-medium text-lg text-muted-foreground tracking-tight md:text-xl">
				Integrado com <span className="text-foreground">ferramentas top</span>
			</h2>
			<div className="relative z-10 mx-auto max-w-4xl">
				<LogoCloud logos={logos} />
			</div>
		</section>
	);
}

const logos = [
	{ src: "https://storage.efferd.com/logo/nvidia-wordmark.svg", alt: "Nvidia Logo" },
	{ src: "https://storage.efferd.com/logo/supabase-wordmark.svg", alt: "Supabase Logo" },
	{ src: "https://storage.efferd.com/logo/openai-wordmark.svg", alt: "OpenAI Logo" },
	{ src: "https://storage.efferd.com/logo/vercel-wordmark.svg", alt: "Vercel Logo" },
	{ src: "https://storage.efferd.com/logo/github-wordmark.svg", alt: "GitHub Logo" },
	{ src: "https://storage.efferd.com/logo/claude-wordmark.svg", alt: "Claude AI Logo" },
];
