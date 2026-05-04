import React from 'react';
import { Button } from '@/components/ui/button';
import axionflyLogo from '@/assets/axionfly-logo.png';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { createPortal } from 'react-dom';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { LucideIcon } from 'lucide-react';
import {
	MapPin,
	BookOpen,
	Code2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type LinkItem = {
	title: string;
	href: string;
	icon: LucideIcon;
	description?: string;
};

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);
	const navigate = useNavigate();

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn(
				'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 border-b',
				scrolled || open
					? 'bg-background/80 backdrop-blur-xl border-primary/20 shadow-lg'
					: 'bg-transparent border-transparent'
			)}
		>
			<nav
				className={cn(
					'container mx-auto flex items-center justify-between transition-all duration-500',
					scrolled ? 'h-16 px-4' : 'h-20 px-6',
				)}
			>
			{/* Logo */}
				<a href="#inicio" onClick={(e) => { e.preventDefault(); document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex items-center shrink-0">
					<img
						src={axionflyLogo}
						alt="AxionFly"
						className="h-10 w-10 md:h-12 md:w-12 object-contain"
					/>
				</a>

				{/* Nav links — always visible on desktop */}
				<NavigationMenu className="hidden md:flex">
					<NavigationMenuList className="gap-2">
						<NavigationMenuItem>
							<NavigationMenuLink className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-4 py-2" asChild>
								<a href="#inicio" onClick={(e) => { e.preventDefault(); document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' }); }}>
									Início
								</a>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-4 py-2" asChild>
								<a href="#etapas" onClick={(e) => { e.preventDefault(); document.getElementById('etapas')?.scrollIntoView({ behavior: 'smooth' }); }}>
									Etapas
								</a>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-4 py-2" asChild>
								<a href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}>
									Planos
								</a>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-4 py-2" asChild>
								<a href="#feedbacks" onClick={(e) => { e.preventDefault(); document.getElementById('feedbacks')?.scrollIntoView({ behavior: 'smooth' }); }}>
									Feedbacks
								</a>
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-4 py-2" asChild>
								<a href="#faq" onClick={(e) => { e.preventDefault(); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); }}>
									FAQ
								</a>
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				{/* Right side buttons */}
				<div className={cn(
					'hidden items-center gap-2 md:flex transition-all duration-700',
					scrolled ? 'gap-1' : 'gap-2',
				)}>
					<Button variant="ghost" size={scrolled ? 'sm' : 'default'} onClick={() => navigate('/auth')}>Entrar</Button>
					<Button variant="neon" size={scrolled ? 'sm' : 'default'} onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>Ver Planos</Button>
				</div>
				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>
			<MobileMenu open={open} className="flex flex-col justify-between gap-2 overflow-y-auto">
				<NavigationMenu className="max-w-full">
					<div className="flex w-full flex-col gap-y-2">
						<span className="text-sm text-muted-foreground">Ferramentas</span>
						{productLinks.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
					</div>
				</NavigationMenu>
				<div className="flex flex-col gap-2">
					<Button variant="outline" className="w-full bg-transparent" onClick={() => navigate('/auth')}>
						Entrar
					</Button>
					<Button variant="neon" className="w-full" onClick={() => navigate('/auth')}>Acessar Plataforma</Button>
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === 'undefined') return null;

	return createPortal(
		<div
			id="mobile-menu"
			className={cn(
				'bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg',
				'fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y border-border md:hidden',
			)}
		>
			<div
				data-slot={open ? 'open' : 'closed'}
				className={cn(
					'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
					'size-full p-4',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}

function ListItem({
	title,
	description,
	icon: Icon,
	className,
	href,
	...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
	return (
		<NavigationMenuLink className={cn('w-full flex flex-row gap-x-2 hover:bg-secondary/50 rounded-sm p-2 transition-colors', className)} {...props} asChild>
			<a href={href}>
				<div className="bg-secondary/50 flex aspect-square size-10 items-center justify-center rounded-md border border-border shadow-sm">
					<Icon className="text-primary size-5" />
				</div>
				<div className="flex flex-col items-start justify-center">
					<span className="font-medium text-foreground">{title}</span>
					<span className="text-muted-foreground text-xs">{description}</span>
				</div>
			</a>
		</NavigationMenuLink>
	);
}

const productLinks: LinkItem[] = [
	{
		title: 'Criador de Sites',
		href: '/auth',
		description: 'Crie sites profissionais personalizados em minutos',
		icon: Code2,
	},
	{
		title: 'Busca de Leads',
		href: '/auth',
		description: 'Encontre leads qualificados com nome, telefone e nicho',
		icon: MapPin,
	},
];

function useScroll(threshold: number) {
	const [scrolled, setScrolled] = React.useState(false);

	const onScroll = React.useCallback(() => {
		setScrolled(window.scrollY > threshold);
	}, [threshold]);

	React.useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, [onScroll]);

	React.useEffect(() => {
		onScroll();
	}, [onScroll]);

	return scrolled;
}
