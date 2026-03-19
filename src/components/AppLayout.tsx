import { useStore } from '@/store/useStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Scissors, Users, Settings, LogOut, LayoutDashboard, RotateCcw, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const navItems = {
  admin: [
    { label: 'Dashboard', path: '/hub', icon: LayoutDashboard },
  ],
  barber: [
    { label: 'Mi Agenda', path: '/barber', icon: Calendar },
  ],
  customer: [
    { label: 'Mis Citas', path: '/customer', icon: Calendar },
  ],
};

export function AppSidebar() {
  const { currentUser, logout, resetData } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return null;

  const items = navItems[currentUser.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleReset = () => {
    resetData();
    toast.success('Datos reiniciados correctamente');
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-16 lg:w-56 bg-obsidian flex flex-col z-40 transition-all duration-150">
      {/* Logo */}
      <div className="p-3 lg:p-4 border-b border-sidebar-border">
        <h1 className="hidden lg:block text-lg font-display font-bold text-sidebar-primary">
          BarberOS
        </h1>
        <span className="lg:hidden text-sidebar-primary font-display font-bold text-lg flex justify-center">B</span>
      </div>

      {/* User info */}
      <div className="p-3 lg:p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <User className="w-4 h-4 text-sidebar-foreground" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.name}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{currentUser.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1">
        {items.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150',
              location.pathname === item.path
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:inline">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => navigate('/settings')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150',
            location.pathname === '/settings'
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="hidden lg:inline">Configuración</span>
        </button>
      </nav>

      {/* Bottom */}
      <div className="p-2 space-y-1 border-t border-sidebar-border">
        <button
          onClick={handleReset}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-150"
        >
          <RotateCcw className="w-4 h-4 flex-shrink-0" />
          <span className="hidden lg:inline">Reset Demo</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-status-cancelled/80 hover:bg-status-cancelled/10 hover:text-status-cancelled transition-colors duration-150"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="hidden lg:inline">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-16 lg:ml-56 p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
}
