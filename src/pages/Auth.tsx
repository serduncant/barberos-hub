import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Shield, Scissors, User } from 'lucide-react';
import { Role } from '@/types';

const roleOptions: { role: Role; icon: React.ElementType; label: string; desc: string; users: { id: string; name: string }[] }[] = [
  {
    role: 'admin', icon: Shield, label: 'Administrador', desc: 'Acceso completo al sistema',
    users: [{ id: 'user_admin', name: 'Admin BarberOS' }],
  },
  {
    role: 'barber', icon: Scissors, label: 'Barbero', desc: 'Gestiona citas y servicios',
    users: [
      { id: 'user_barber_01', name: 'Carlos Méndez' },
      { id: 'user_barber_02', name: 'Luis Herrera' },
      { id: 'user_barber_03', name: 'Andrés Ríos' },
    ],
  },
  {
    role: 'customer', icon: User, label: 'Cliente', desc: 'Reserva y consulta citas',
    users: [
      { id: 'user_client_01', name: 'Miguel Torres' },
      { id: 'user_client_02', name: 'David García' },
      { id: 'user_client_03', name: 'Javier López' },
      { id: 'user_client_04', name: 'Alejandro Ruiz' },
    ],
  },
];

export default function Auth() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleLogin = (userId: string, name: string) => {
    login(userId);
    toast.success(`Bienvenido, ${name}`);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground">BarberOS</h1>
          <p className="text-muted-foreground text-sm mt-1">Selecciona un perfil para entrar</p>
        </div>

        {!selectedRole ? (
          <div className="grid gap-4">
            {roleOptions.map(opt => (
              <Card
                key={opt.role}
                className="cursor-pointer border-border hover:border-accent hover:shadow-md transition-all duration-150"
                onClick={() => opt.users.length === 1 ? handleLogin(opt.users[0].id, opt.users[0].name) : setSelectedRole(opt.role)}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <opt.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{opt.label}</CardTitle>
                    <CardDescription className="text-xs">{opt.desc}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <Button variant="ghost" className="mb-4 text-muted-foreground" onClick={() => setSelectedRole(null)}>
              ← Volver
            </Button>
            <div className="grid gap-3">
              {roleOptions.find(r => r.role === selectedRole)?.users.map(u => (
                <Card
                  key={u.id}
                  className="cursor-pointer border-border hover:border-accent hover:shadow-md transition-all duration-150"
                  onClick={() => handleLogin(u.id, u.name)}
                >
                  <CardHeader className="flex flex-row items-center gap-3 py-4">
                    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                    <CardTitle className="text-sm font-medium">{u.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
