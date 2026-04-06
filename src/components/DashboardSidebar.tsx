import { MapPin, Code2, LogOut, ShoppingBag, User, ChevronUp } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type View = "prospeccao" | "sites" | "vendas";

interface DashboardSidebarProps {
  active: View;
  onNavigate: (view: View) => void;
  onSignOut: () => void;
  userEmail?: string;
  userName?: string;
}

const navItems: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "sites", label: "Criador de Sites", icon: Code2 },
  { id: "prospeccao", label: "Busca de Leads", icon: MapPin },
  { id: "vendas", label: "Minhas Vendas", icon: ShoppingBag },
];

const DashboardSidebar = ({ active, onNavigate, onSignOut, userEmail, userName }: DashboardSidebarProps) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const displayName = userName || userEmail?.split("@")[0] || "Usuário";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-black text-sm">A</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-foreground tracking-tight">
              Axion<span className="text-primary">Fly</span>
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ id, label, icon: Icon }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(id)}
                    isActive={active === id}
                    tooltip={label}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="w-full">
                  <Avatar className="w-7 h-7 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                      {userEmail && (
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                      )}
                    </div>
                  )}
                  {!collapsed && <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem onClick={onSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da conta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
