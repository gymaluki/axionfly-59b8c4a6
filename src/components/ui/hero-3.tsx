import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
	const navigate = useNavigate();

	return (
		<section className="mx-auto w-full max-w-5xl overflow-hidden pt-16">
			{/* Shades */}
			<div
				aria-hidden="true"
				className="absolute inset-0 size-full overflow-hidden"
			>
				<div
					className={cn(
						"absolute inset-0 isolate -z-10",
						"bg-[radial-gradient(20%_80%_at_20%_0%,hsl(var(--primary)/.15),transparent)]"
					)}
				/>
			</div>
			<div className="relative z-10 flex max-w-2xl flex-col gap-5 px-4">
				<a
					className={cn(
						"group flex w-fit items-center gap-3 rounded-sm border border-border bg-card p-1 shadow-xs",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out"
					)}
					href="#pricing"
				>
					<div className="rounded-xs border border-primary/30 bg-primary/10 px-1.5 py-0.5 shadow-sm">
						<p className="font-mono text-xs text-primary">NOVO</p>
					</div>

					<span className="text-xs text-muted-foreground">Acesso vitalício por apenas R$ 147,90</span>
					<span className="block h-5 border-l border-border" />

					<div className="pr-1">
						<ArrowRight className="size-3 -translate-x-0.5 text-muted-foreground duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-primary" />
					</div>
				</a>

				<h1
					className={cn(
						"text-balance font-black text-4xl text-foreground leading-[1.08] md:text-5xl lg:text-6xl",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-100 duration-500 ease-out"
					)}
				>
					Pare de Perder Clientes.{" "}
					<span className="gradient-text">Automatize e Fature Mais.</span>
				</h1>

				<p
					className={cn(
						"text-muted-foreground text-base tracking-wide sm:text-lg md:text-xl leading-relaxed",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-200 duration-500 ease-out"
					)}
				>
					Prospecte no Google Maps, gere e-books com IA e crie sites completos — tudo em{" "}
					<span className="text-foreground font-semibold">menos de 5 minutos</span>. 
					Enquanto você lê isso, seus concorrentes já estão usando.
				</p>

				<div className="fade-in slide-in-from-bottom-10 flex w-fit animate-in items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
					<Button variant="neon" size="lg" onClick={() => navigate("/auth")}>
						<Zap className="size-4 mr-1" />
						Começar Agora — É Grátis
					</Button>
					<Button variant="outline" size="lg" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
						Ver Planos
						<ArrowRight className="size-4 ml-1" />
					</Button>
				</div>
			</div>
			<div className="relative">
				<div
					className={cn(
						"absolute -inset-x-20 inset-y-0 -translate-y-1/3 scale-120 rounded-full",
						"bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/.12),transparent,transparent)]",
						"blur-[50px]"
					)}
				/>
				<div
					className={cn(
						"relative mt-8 overflow-hidden px-2 sm:mt-12 md:mt-20",
						"fade-in slide-in-from-bottom-5 animate-in fill-mode-backwards delay-100 duration-1000 ease-out"
					)}
					style={{ maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" }}
				>
					<div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-border bg-card p-2 shadow-xl neon-border">
						<div className="flex items-center gap-2 border-b border-border px-4 py-2">
							<div className="flex gap-1.5">
								<div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
								<div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
								<div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
							</div>
							<div className="flex-1 flex justify-center">
								<div className="bg-secondary rounded px-3 py-0.5 text-[10px] text-muted-foreground">app.scaleai.com/dashboard</div>
							</div>
						</div>
						<div className="p-4 space-y-3">
							<div className="flex gap-3">
								<div className="w-1/5 space-y-2">
									<div className="h-2.5 w-full rounded bg-primary/20" />
									<div className="h-2.5 w-3/4 rounded bg-primary/10" />
									<div className="h-2.5 w-full rounded bg-primary/10" />
								</div>
								<div className="flex-1 space-y-3">
									<div className="flex gap-3">
										<div className="flex-1 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-border/50" />
										<div className="flex-1 h-16 rounded-lg bg-gradient-to-br from-accent/20 to-primary/10 border border-border/50" />
										<div className="flex-1 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-accent/20 border border-border/50" />
									</div>
									<div className="h-24 rounded-lg bg-secondary/50 border border-border/50" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
