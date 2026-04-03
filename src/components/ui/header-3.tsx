import React from 'react';
import { Button } from '@/components/ui/button';
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
	Zap,
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
			className={cn('sticky top-0 z-50 w-full border-b border-transparent', {
				'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg':
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<div className="flex items-center gap-5">
					<a href="#" className="hover:opacity-80 transition-opacity flex items-center gap-2">
						<div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
							<Zap className="w-4 h-4 text-primary-foreground" />
						</div>
						<span className="text-xl font-bold text-foreground">Axion<span className="text-primary">Fly</span></span>
					</a>
					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-foreground">Ferramentas</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-background p-1 pr-1.5">
									<ul className="bg-popover grid w-[400px] grid-cols-1 gap-2 rounded-md border border-border p-2 shadow-lg">
										{productLinks.map((item, i) => (
											<li key={i}>
												<ListItem {...item} />
											</li>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink className="px-4 text-sm text-muted-foreground hover:text-foreground transition-colors" asChild>
									<a href="#pricing" className="rounded-md p-2">
										Preços
									</a>
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<Button variant="ghost" onClick={() => navigate('/auth')}>Entrar</Button>
					<Button variant="neon" onClick={() => navigate('/auth')}>Começar Grátis</Button>
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
					<Button variant="neon" className="w-full" onClick={() => navigate('/auth')}>Começar Grátis</Button>
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
		title: 'Criador de Sites IA',
		href: '#',
		description: 'Crie sites profissionais com prompts inteligentes',
		icon: Code2,
	},
	{
		title: 'Prospecção Google Maps',
		href: '#',
		description: 'IA encontra barbearias, clínicas, restaurantes automaticamente',
		icon: MapPin,
	},
	{
		title: 'Gerador de E-books',
		href: '#',
		description: 'Crie e-books profissionais com IA em segundos',
		icon: BookOpen,
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
