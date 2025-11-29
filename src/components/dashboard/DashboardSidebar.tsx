import { LayoutDashboard, FileText, Plus, User, Briefcase, Wallet, Download, X } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Minhas demandas', path: '/dashboard/demands' },
  { icon: Plus, label: 'Solicitar demanda', path: '/dashboard/new-demand' },
  { icon: User, label: 'Perfil', path: '/dashboard/profile' },
  { icon: Briefcase, label: 'Portfólio', path: '/dashboard/portfolio' },
  { icon: Wallet, label: 'Extrato', path: '/dashboard/statement' },
  { icon: Download, label: 'Retiradas', path: '/dashboard/withdrawals' },
];

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const DashboardSidebar = ({ isOpen = false, onClose }: DashboardSidebarProps) => {
  const { user } = useAuth();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed left-0 top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-64
        border-r border-border/40 bg-card z-50
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo + Close button for mobile */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h1 className="text-xl font-bold text-primary">TechHub</h1>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Logo for desktop */}
          <div className="hidden lg:block p-4 pb-2">
            <h1 className="text-xl font-bold text-primary">TechHub</h1>
          </div>

          {/* User Profile */}
          <div className="p-4 lg:px-6 lg:pt-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 lg:h-12 lg:w-12 ring-2 ring-primary/20">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                  {user?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-semibold text-sm">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.stack}</p>
              </div>
            </div>
          </div>

          <Separator className="mx-4" />

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3 lg:p-4 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className="flex items-center gap-3 rounded-lg px-3 py-2 lg:py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                activeClassName="bg-primary text-primary-foreground shadow-glow font-semibold"
                onClick={onClose}
              >
                <item.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};
