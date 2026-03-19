import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { currentUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => { if (!currentUser) navigate('/auth'); }, [currentUser, navigate]);
  if (!currentUser) return null;

  return (
    <AppLayout>
      <div className="max-w-lg animate-fade-in">
        <h2 className="font-display font-bold text-2xl mb-6">Configuración</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Nombre</Label>
              <Input value={currentUser.name} readOnly className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Rol</Label>
              <Input value={currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'barber' ? 'Barbero' : 'Cliente'} readOnly className="mt-1 capitalize" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">ID de usuario</Label>
              <Input value={currentUser.id} readOnly className="mt-1 font-mono text-xs" />
            </div>
            <p className="text-xs text-muted-foreground">
              Los perfiles se gestionan con datos mock. En futuras versiones se integrará autenticación real.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
