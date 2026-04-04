import { MapPin, BookOpen, Code2, LogOut, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type View = "prospeccao" | "ebooks" | "sites" | "vendas";

interface DashboardSidebarProps {
  active: View;
  onNavigate: (view: View) => void;
  onSignOut: () => void;
  userEmail?: string;
}

const navItems: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "sites", label: "Fábrica de Sites", icon: Code2 },
  { id: "prospeccao", label: "Busca de Leads", icon: MapPin },
  { id: "ebooks", label: "Gerador de E-books", icon: BookOpen },
  { id: "vendas", label: "Minhas Vendas", icon: ShoppingBag },
];

const DashboardSidebar = ({ active, onNavigate, onSignOut, userEmail }: DashboardSidebarProps) => {
  return (
    <aside className="w-64 shrink-0 border-r border-border bg-sidebar flex flex-col min-h-screen">
      <div className="p-5 border-b border-border">
        <span className="text-lg font-bold text-foreground">Axion<span className="text-primary">Fly</span></span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              active === id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        {userEmail && (
          <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
        )}
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
