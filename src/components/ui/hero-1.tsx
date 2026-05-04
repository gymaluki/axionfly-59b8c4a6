import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Zap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardMockup } from "./dashboard-mockup";

export function HeroSection() {
	const navigate = useNavigate();

	const headline = "Crie Sites Feitos por IA e Venda para";
	const words = headline.split(" ");

	return (
		<section id="inicio" className="relative pt-20 pb-16 md:pt-32 md:pb-32 overflow-hidden">
			<div className="container mx-auto px-4 relative z-10">
				{/* Badge */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="flex justify-center mb-8"
				>
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(37,99,235,0.2)]">
						<motion.div
							animate={{ scale: [1, 1.2, 1] }}
							transition={{ duration: 2, repeat: Infinity }}
						>
							<Zap className="size-3.5 text-primary fill-primary" />
						</motion.div>
						<span className="text-[11px] font-black uppercase tracking-[0.1em] text-primary">
							+5.000 empreendedores já vendem com AxionFly
						</span>
					</div>
				</motion.div>

				{/* Headline */}
				<div className="text-center mb-8">
					<h1 className="text-3xl md:text-[58px] font-black tracking-tight text-foreground leading-[1.1] mb-2">
						{words.map((word, i) => (
							<motion.span
								key={i}
								initial={{ opacity: 0, y: 40 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.8,
									delay: i * 0.08,
									ease: [0.16, 1, 0.3, 1]
								}}
								className="inline-block mr-[0.2em]"
							>
								{word}
							</motion.span>
						))}
					</h1>
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
						className="flex justify-center mt-2"
					>
						<span className="text-4xl md:text-[68px] font-black leading-none gradient-text-animate tracking-tighter">
							COMÉRCIOS
						</span>
					</motion.div>
				</div>

				{/* Description */}
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 1.2 }}
					className="mx-auto max-w-2xl text-center text-[18px] md:text-[20px] text-[#94a3b8] font-normal leading-[1.7] mb-10"
				>
					Escolha o plano ideal para você. Comece seu negócio{" "}
					<span className="text-foreground font-bold border-b-2 border-primary/40">com a liberdade</span> de crescer ainda mais.
				</motion.p>

				{/* CTAs */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 1.4 }}
					className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
				>
					<Button 
						variant="neon" 
						size="xl" 
						className="rounded-full shimmer-button px-10 h-14 text-base font-black uppercase tracking-widest w-full sm:w-auto" 
						onClick={() => navigate("/auth")}
					>
						<Zap className="size-5 mr-2 fill-current" />
						Assinar agora
					</Button>
					<Button 
						variant="outline" 
						size="xl" 
						className="rounded-full px-10 h-14 text-base font-black uppercase tracking-widest border-2 hover:bg-primary/10 w-full sm:w-auto" 
						onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
					>
						Ver Planos
						<ArrowRightIcon className="size-5 ml-2" />
					</Button>
				</motion.div>

				{/* Mockup */}
				<DashboardMockup />

				{/* Partners */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 1, delay: 2 }}
					className="mt-20 flex flex-col items-center gap-6"
				>
					<p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
						Parceiros oficiais
					</p>
					<div className="flex items-center gap-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
						<div className="flex items-center gap-2">
							<Sparkles className="w-6 h-6 text-primary" />
							<span className="text-xl font-black tracking-tighter text-foreground">Lovable</span>
						</div>
						<div className="flex items-center gap-2">
							<img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" alt="Google Maps" className="w-6 h-6" />
							<span className="text-xl font-bold tracking-tight text-foreground/80">Google Maps</span>
						</div>
					</div>
				</motion.div>
			</div>
			
			{/* Decorative elements */}
			<div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
			<div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
		</section>
	);
}
