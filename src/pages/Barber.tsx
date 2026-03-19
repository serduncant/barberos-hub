import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Play, CheckCircle, Clock, User } from 'lucide-react';

export default function BarberPage() {
  const { currentUser, appointments, getClient, getService, transitionAppointment, updateAppointmentNotes } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate('/auth');
    else if (currentUser.role !== 'barber') navigate('/home');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const myAppointments = appointments.filter(a => a.barberId === currentUser.linkedId);
  const today = new Date().toISOString().split('T')[0];
  const todayApts = myAppointments.filter(a => a.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const upcomingApts = myAppointments.filter(a => a.date > today && a.status === 'scheduled').sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const handleStart = (id: string) => {
    if (transitionAppointment(id, 'in_service')) toast.success('Servicio iniciado');
    else toast.error('No se puede iniciar este servicio');
  };

  const handleComplete = (id: string) => {
    if (transitionAppointment(id, 'completed')) toast.success('Servicio completado');
    else toast.error('No se puede completar este servicio');
  };

  const handleNotes = (id: string, notes: string) => {
    updateAppointmentNotes(id, notes);
    toast.success('Notas guardadas');
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h2 className="font-display font-bold text-2xl mb-6">Mi Agenda</h2>

        {/* Today */}
        <section className="mb-8">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" /> Hoy
          </h3>
          {todayApts.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground text-sm">No hay citas para hoy</CardContent></Card>
          ) : (
            <div className="grid gap-4">
              {todayApts.map(apt => {
                const client = getClient(apt.clientId);
                const service = getService(apt.serviceId);
                return (
                  <AppointmentCard
                    key={apt.id}
                    time={apt.time}
                    clientName={client?.name || ''}
                    serviceName={service?.name || ''}
                    duration={apt.duration}
                    status={apt.status}
                    notes={apt.barberNotes}
                    onStart={() => handleStart(apt.id)}
                    onComplete={() => handleComplete(apt.id)}
                    onSaveNotes={(n) => handleNotes(apt.id, n)}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Upcoming */}
        {upcomingApts.length > 0 && (
          <section>
            <h3 className="font-display font-semibold text-lg mb-4">Próximas Citas</h3>
            <div className="grid gap-3">
              {upcomingApts.map(apt => {
                const client = getClient(apt.clientId);
                const service = getService(apt.serviceId);
                return (
                  <Card key={apt.id}>
                    <CardContent className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{client?.name}</p>
                          <p className="text-xs text-muted-foreground">{service?.name} · {apt.date} · {apt.time}</p>
                        </div>
                      </div>
                      <StatusBadge status={apt.status} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}

function AppointmentCard({ time, clientName, serviceName, duration, status, notes, onStart, onComplete, onSaveNotes }: {
  time: string; clientName: string; serviceName: string; duration: number; status: string;
  notes: string; onStart: () => void; onComplete: () => void; onSaveNotes: (n: string) => void;
}) {
  const [localNotes, setLocalNotes] = useState(notes);

  return (
    <Card className="border-l-4" style={{
      borderLeftColor: status === 'in_service' ? 'hsl(258 90% 66%)' : status === 'completed' ? 'hsl(160 84% 39%)' : 'hsl(217 91% 60%)'
    }}>
      <CardContent className="py-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display font-bold text-lg">{time}</span>
              <StatusBadge status={status as any} />
            </div>
            <p className="text-sm font-medium">{clientName}</p>
            <p className="text-xs text-muted-foreground">{serviceName} · {duration} min</p>
          </div>
          <div className="flex gap-2">
            {status === 'scheduled' && (
              <Button size="sm" className="gold-gradient text-obsidian font-semibold" onClick={onStart}>
                <Play className="w-3.5 h-3.5 mr-1" /> Iniciar
              </Button>
            )}
            {status === 'in_service' && (
              <Button size="sm" variant="default" className="bg-status-completed text-primary-foreground hover:bg-status-completed/90" onClick={onComplete}>
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Finalizar
              </Button>
            )}
          </div>
        </div>
        {(status === 'in_service' || status === 'completed') && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Notas del servicio</p>
            <div className="flex gap-2">
              <Textarea
                value={localNotes}
                onChange={e => setLocalNotes(e.target.value)}
                className="text-sm min-h-[60px]"
                placeholder="Preferencias, recomendaciones..."
                readOnly={status === 'completed'}
              />
              {status === 'in_service' && (
                <Button size="sm" variant="outline" onClick={() => onSaveNotes(localNotes)}>Guardar</Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
