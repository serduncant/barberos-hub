import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, ArrowRight, CheckCircle } from 'lucide-react';

export default function CustomerPage() {
  const { currentUser, appointments, services, barbers, getBarber, getService, createAppointment, getAvailableSlots } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate('/auth');
    else if (currentUser.role !== 'customer') navigate('/home');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const myApts = appointments.filter(a => a.clientId === currentUser.linkedId);
  const upcoming = myApts.filter(a => ['scheduled', 'in_service'].includes(a.status)).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const history = myApts.filter(a => ['completed', 'cancelled', 'no_show'].includes(a.status)).sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  return (
    <AppLayout>
      <div className="animate-fade-in max-w-3xl">
        <h2 className="font-display font-bold text-2xl mb-6">Mis Citas</h2>

        {/* Booking */}
        <BookingFlow clientId={currentUser.linkedId} />

        {/* Upcoming */}
        <section className="mb-8">
          <h3 className="font-display font-semibold text-lg mb-4">Próximas Citas</h3>
          {upcoming.length === 0 ? (
            <Card><CardContent className="py-6 text-center text-muted-foreground text-sm">No tienes citas próximas</CardContent></Card>
          ) : (
            <div className="grid gap-3">
              {upcoming.map(apt => (
                <Card key={apt.id}>
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{getService(apt.serviceId)?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {getBarber(apt.barberId)?.name} · {apt.date} · {apt.time}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* History */}
        <section>
          <h3 className="font-display font-semibold text-lg mb-4">Historial</h3>
          {history.length === 0 ? (
            <Card><CardContent className="py-6 text-center text-muted-foreground text-sm">Sin historial de servicios</CardContent></Card>
          ) : (
            <div className="grid gap-3">
              {history.map(apt => (
                <Card key={apt.id} className="opacity-80">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{getService(apt.serviceId)?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getBarber(apt.barberId)?.name} · {apt.date}
                      </p>
                      {apt.barberNotes && <p className="text-xs text-muted-foreground mt-1 italic">"{apt.barberNotes}"</p>}
                    </div>
                    <StatusBadge status={apt.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

function BookingFlow({ clientId }: { clientId: string }) {
  const { services, barbers, createAppointment, getAvailableSlots } = useStore();
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState('');
  const [barberId, setBarberId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [open, setOpen] = useState(false);

  const activeBarbers = barbers.filter(b => b.active);
  const selectedService = services.find(s => s.id === serviceId);
  const slots = barberId && date && selectedService ? getAvailableSlots(barberId, date, selectedService.duration) : [];

  // Generate next 14 days
  const dates: string[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }

  const handleConfirm = () => {
    if (!selectedService) return;
    const id = createAppointment({
      clientId,
      barberId,
      serviceId,
      date,
      time,
      duration: selectedService.duration,
      status: 'scheduled',
    });
    if (id) {
      toast.success('¡Cita reservada con éxito!');
      setOpen(false);
      setStep(0);
      setServiceId('');
      setBarberId('');
      setDate('');
      setTime('');
    } else {
      toast.error('Horario no disponible');
    }
  };

  if (!open) {
    return (
      <Card className="mb-8 border-accent/30 bg-accent/5">
        <CardContent className="py-6 text-center">
          <p className="font-display font-semibold text-lg mb-3">Reservar nueva cita</p>
          <Button className="gold-gradient text-obsidian font-semibold" onClick={() => setOpen(true)}>
            <Calendar className="w-4 h-4 mr-2" /> Reservar Cita
          </Button>
        </CardContent>
      </Card>
    );
  }

  const steps = ['Servicio', 'Barbero', 'Fecha', 'Hora', 'Confirmar'];

  return (
    <Card className="mb-8 border-accent/30">
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Reservar Cita</span>
          <Button variant="ghost" size="sm" onClick={() => { setOpen(false); setStep(0); }}>✕</Button>
        </CardTitle>
        {/* Stepper */}
        <div className="flex items-center gap-1 mt-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium ${
                i <= step ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
              }`}>{i + 1}</div>
              <span className={`text-xs hidden sm:inline ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
              {i < steps.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground mx-1" />}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <div className="grid gap-2">
            {services.map(svc => (
              <button
                key={svc.id}
                className={`text-left p-3 rounded-md border transition-all duration-150 ${serviceId === svc.id ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
                onClick={() => { setServiceId(svc.id); setStep(1); }}
              >
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{svc.name}</span>
                  <span className="text-sm font-semibold text-accent">${svc.price}</span>
                </div>
                <p className="text-xs text-muted-foreground">{svc.duration} min · {svc.description}</p>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-2">
            {activeBarbers.map(b => (
              <button
                key={b.id}
                className={`text-left p-3 rounded-md border transition-all duration-150 ${barberId === b.id ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
                onClick={() => { setBarberId(b.id); setStep(2); }}
              >
                <span className="text-sm font-medium">{b.name}</span>
                <p className="text-xs text-muted-foreground">{b.specialty}</p>
              </button>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setStep(0)}>← Atrás</Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex gap-2 flex-wrap mb-3">
              {dates.map(d => {
                const dayName = new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
                return (
                  <button
                    key={d}
                    className={`px-3 py-2 rounded-md border text-xs font-medium transition-all duration-150 ${date === d ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-accent/50'}`}
                    onClick={() => { setDate(d); setStep(3); }}
                  >
                    {dayName}
                  </button>
                );
              })}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>← Atrás</Button>
          </div>
        )}

        {step === 3 && (
          <div>
            {slots.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No hay horarios disponibles para esta fecha</p>
            ) : (
              <div className="flex gap-2 flex-wrap mb-3">
                {slots.map(s => (
                  <button
                    key={s}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-150 ${time === s ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-accent/50'}`}
                    onClick={() => { setTime(s); setStep(4); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setStep(2)}>← Atrás</Button>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="bg-muted rounded-lg p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Servicio</span><span className="font-medium">{selectedService?.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Barbero</span><span className="font-medium">{barbers.find(b => b.id === barberId)?.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Fecha</span><span className="font-medium">{date}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Hora</span><span className="font-medium">{time}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Precio</span><span className="font-semibold text-accent">${selectedService?.price}</span></div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(3)}>← Atrás</Button>
              <Button className="gold-gradient text-obsidian font-semibold flex-1" onClick={handleConfirm}>
                <CheckCircle className="w-4 h-4 mr-2" /> Confirmar Cita
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
