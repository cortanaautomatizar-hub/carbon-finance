
import { Bell, Search, User, Settings, LifeBuoy, LogOut } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SearchDialog from "@/components/SearchDialog";
import NotificationsMenu from "@/components/NotificationsMenu";
import { cards } from "@/data/cards";

export const Header = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    // Limpa sessão via contexto e redireciona
    auth.logout();
    navigate("/login");
  };

  const { t, locale, setLocale } = useTranslation();

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">{t('header.ola')}, {auth.user?.name ?? auth.user?.email ?? 'usuário'} 👋</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <SearchDialog>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <Search size={20} />
          </button>
        </SearchDialog>

        {/* Language selector */}
        <div className="w-28">
          <Select value={locale} onValueChange={(v) => setLocale(v as any)}>
            <SelectTrigger className="w-full h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">PT-BR</SelectItem>
              <SelectItem value="en">EN</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications */}
        <NotificationsMenu items={
          // build simple notification items from sample cards
          cards.slice(0,5).flatMap(card => {
            const items = [] as Array<{id:string; title:string; body?:string}>;
            if (card.invoice?.total > 0) {
              items.push({ id: `invoice-${card.id}`, title: `Fatura: ${card.name}`, body: `R$ ${card.invoice.total.toFixed(2)} vence em ${card.invoice.dueDate}` });
            }
            if (card.limit && card.limit > 0) {
              const pct = (card.used / card.limit) * 100;
              if (pct > 75) {
                items.push({ id: `limit-${card.id}`, title: `Limite: ${card.name}`, body: `Você usou ${pct.toFixed(0)}% do limite` });
              }
            }
            return items;
          })
        }>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </button>
        </NotificationsMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center ml-2">
              <User size={18} className="text-primary-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{auth.user?.name ?? 'Usuário'}</p>
                <p className="text-xs leading-none text-muted-foreground">{auth.user?.email ?? ''}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/configuracoes">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/assistente-ia">
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Ajuda</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
