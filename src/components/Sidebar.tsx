
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  CreditCard, 
  LayoutGrid, // Adicionado
  ArrowLeftRight, 
  Receipt, 
  TrendingUp, 
  Settings, 
  HelpCircle,
  LogOut,
  Repeat,
  Sparkles,
  Landmark
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 text-left",
      active 
        ? "bg-sidebar-accent text-sidebar-foreground" 
        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
    )}
  >
    <span className={cn(active && "text-sidebar-primary")}>{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

const navItems = [
  { icon: <Home size={20} />, label: "Início", path: "/" },
  { icon: <CreditCard size={20} />, label: "Cartões", path: "/cartao" },
  { icon: <LayoutGrid size={20} />, label: "Resumo dos Cartões", path: "/resumo-cartoes" }, // Adicionado
  { icon: <Sparkles size={20} />, label: "Assistente IA", path: "/assistente-ia" },
  { icon: <ArrowLeftRight size={20} />, label: "Transferências", path: "/transferencias" },
  { icon: <Landmark size={20} />, label: "Meus Empréstimos", path: "/emprestimos" },
  { icon: <Receipt size={20} />, label: "Pagamentos", path: "/pagamentos" },
  { icon: <TrendingUp size={20} />, label: "Investimentos", path: "/investimentos" },
  { icon: <Repeat size={20} />, label: "Controle de Assinaturas", path: "/assinaturas" },
];

const bottomNavItems = [
    { icon: <Settings size={20} />, label: "Configurações", path: "/configuracoes" },
    { icon: <HelpCircle size={20} />, label: "Ajuda", path: "/ajuda" },
    { icon: <LogOut size={20} />, label: "Sair", path: "/sair" },
]

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-semibold text-foreground">Carbon</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            path={item.path}
            active={location.pathname === item.path}
            onClick={() => handleNavClick(item.path)}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        {bottomNavItems.map((item) => (
            <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                path={item.path}
                active={location.pathname === item.path}
                onClick={() => handleNavClick(item.path)}
            />
        ))}
      </div>
    </aside>
  );
};
