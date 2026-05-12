import { MapPin, Code2, LogOut, ShoppingBag, User, ChevronUp, Shield, PlayCircle, FileText, UserCircle, Sparkles, ExternalLink, Zap } from "lucide-react";
import axionflyLogo from "@/assets/axionfly-logo.webp";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type View = "dashboard" | "aulas" | "progresso" | "perfil" | "admin" | "lesson-player";

interface DashboardSidebarProps {
  active: View;
  onNavigate: (view: View) => void;
  onSignOut: () => void;
  userEmail?: string;
  userName?: string;
  isAdmin?: boolean;
}

const navItems: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "sites", label: "Criador de Sites", icon: Code2 },
  { id: "prospeccao", label: "Busca de Leads", icon: MapPin },
  { id: "membros", label: "Área de Membros", icon: PlayCircle },
  { id: "vendas", label: "Minhas Vendas", icon: ShoppingBag },
  { id: "contrato", label: "Contrato & Script", icon: FileText },
  { id: "extensao-lovable", label: "Extensão Lovable", icon: Sparkles },
  { id: "perfil", label: "Meu Perfil", icon: UserCircle },
];

const DashboardSidebar = ({ active, onNavigate, onSignOut, userEmail, userName, isAdmin }: DashboardSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const allNavItems = isAdmin
    ? [...navItems, { id: "admin" as View, label: "Painel Admin", icon: Shield }]
    : navItems;

  const displayName = userName || userEmail?.split("@")[0] || "Usuário";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <Sidebar collapsible="icon" className="bg-[#05050a] border-r border-white/5">
      <SidebarHeader className="border-b border-white/5 px-4 py-4 bg-[#05050a]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <img src={axionflyLogo} alt="AxionFly" width="120" height="24" decoding="async" className="h-6 w-auto" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-black text-white tracking-tighter leading-none">
                AxionFly
              </span>
              <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.1em] mt-1">DASHBOARD</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#05050a]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b7280] mb-2 px-4">
            FERRAMENTAS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-1">
              {allNavItems.map(({ id, label, icon: Icon }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(id)}
                    isActive={active === id}
                    tooltip={label}
                    className={cn(
                      "transition-all duration-200 h-10 px-3 rounded-lg",
                      active === id 
                        ? "bg-[#1a2035] text-[#3B82F6] border-l-2 border-[#3B82F6] rounded-l-none" 
                        : "text-[#6b7280] hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 shrink-0", active === id ? "text-primary" : "text-inherit")} />
                    <span className="font-bold text-[11px] uppercase tracking-[0.1em]">{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Minimal Hyperbuild Link */}
        {!collapsed && (
          <div className="mt-auto px-4 py-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-[#3B82F6]/30 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-bold text-primary uppercase tracking-[0.1em]">Parceria Ativa</span>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Tokens ilimitados com <span className="text-white font-bold">Hyperbuild Pro</span>
              </p>
            </div>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 bg-[#05050a] p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton size="lg" className="w-full h-12 rounded-xl hover:bg-white/5 transition-colors">
                        <div className="relative">
                          <Avatar className="w-8 h-8 shrink-0 ring-2 ring-white/5">
                            <AvatarFallback className="bg-[#3B82F6] text-white text-xs font-bold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0d0d14] rounded-full animate-pulse" />
                        </div>
                        {!collapsed && (
                          <div className="flex-1 text-left min-w-0 ml-3">
                            <p className="text-sm font-bold text-foreground truncate leading-none mb-1">{displayName}</p>
                            <p className="text-[11px] text-[#475569] font-bold uppercase tracking-[0.1em]">Membro Premium</p>
                          </div>
                        )}
                        {!collapsed && <ChevronUp className="w-4 h-4 text-[#475569] shrink-0" />}
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="start" className="w-56 bg-[#0d0d14] border-white/10 text-white">
                      <DropdownMenuItem onClick={() => onNavigate("perfil")} className="hover:bg-white/5 focus:bg-white/5 py-2.5">
                        <UserCircle className="w-4 h-4 mr-3 text-primary" />
                        Meu Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onSignOut} className="text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 py-2.5">
                        <LogOut className="w-4 h-4 mr-3" />
                        Sair da conta
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-primary text-white border-none text-xs font-bold px-3 py-1.5">
                  {userEmail}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
