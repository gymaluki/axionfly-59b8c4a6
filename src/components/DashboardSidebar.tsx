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
  { id: "dashboard", label: "Início", icon: User },
  { id: "aulas", label: "Minhas Aulas", icon: PlayCircle },
  { id: "progresso", label: "Meu Progresso", icon: FileText },
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
    <Sidebar collapsible="icon" className="bg-white border-r border-[#F0F0F0]">
      <SidebarHeader className="border-b border-[#F0F0F0] px-4 py-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1B3A5C] flex items-center justify-center text-white shrink-0">
            <PlayCircle className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#1A1A1A] tracking-tight leading-none">
                Projeto Live
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Plataforma</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 px-4">
            MENU PRINCIPAL
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
                      "transition-all duration-200 h-10 px-3 rounded-xl",
                      active === id 
                        ? "bg-[#1B3A5C] text-white hover:bg-[#1B3A5C] hover:text-white" 
                        : "text-muted-foreground hover:bg-[#F0F0F0] hover:text-[#1A1A1A]"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 shrink-0", active === id ? "text-white" : "text-inherit")} />
                    <span className="font-semibold text-sm">{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className="border-t border-[#F0F0F0] bg-white p-4">
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
