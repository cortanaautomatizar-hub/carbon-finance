
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from '@/hooks/useTranslation';
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
import { Logo } from "./Logo";

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

// navItems moved inside component to support translation
  
  { icon: <TrendingUp size={20} />, label: "Investimentos", path: "/investimentos" },
  { icon: <Repeat size={20} />, label: "Controle de Assinaturas", path: "/assinaturas" },
];

const bottomNavItems = [
    { icon: <Settings size={20} />, label: "Configurações", path: "/configuracoes" },
    { icon: <HelpCircle size={20} />, label: "Ajuda", path: "/ajuda" },
    { icon: <LogOut size={20} />, label: "Sair", path: "/sair" },
]

export const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={20} />, label: t('sidebar.inicio'), path: "/" },
    { icon: <CreditCard size={20} />, label: t('sidebar.cartoes'), path: "/cartao" },
    { icon: <LayoutGrid size={20} />, label: t('sidebar.resumoCartoes'), path: "/resumo-cartoes" },
    { icon: <Sparkles size={20} />, label: t('sidebar.assistente'), path: "/assistente-ia" },
    { icon: <ArrowLeftRight size={20} />, label: t('sidebar.transferencias'), path: "/transferencias" },
    { icon: <Landmark size={20} />, label: t('sidebar.emprestimos'), path: "/emprestimos" },
    { icon: <Receipt size={20} />, label: t('sidebar.pagamentos'), path: "/pagamentos" },
    { icon: <TrendingUp size={20} />, label: t('sidebar.investimentos'), path: "/investimentos" },
    { icon: <Repeat size={20} />, label: t('sidebar.assinaturas'), path: "/assinaturas" },
  ];

  const bottomNavItems = [
    { icon: <Settings size={20} />, label: t('sidebar.configuracoes'), path: "/configuracoes" },
    { icon: <HelpCircle size={20} />, label: t('sidebar.ajuda'), path: "/ajuda" },
    { icon: <LogOut size={20} />, label: t('sidebar.sair'), path: "/sair" },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Logo variant="light" className="h-9" />
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
