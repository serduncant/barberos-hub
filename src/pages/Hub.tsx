import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, Users, Scissors, UserCircle, Plus, X, Edit, Clock, BarChart3 } from 'lucide-react';
import { AppointmentStatus, Appointment } from '@/types';

export default function HubPage() {
  const { currentUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate('/auth');
    else if (currentUser.role !== 'admin') navigate('/home');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h2 className="font-display font-bold text-2xl mb-6">Panel de Administración</h2>
        <DashboardStats />
        <Tabs defaultValue="agenda" className="mt-6">
          <TabsList className="mb-4 bg-muted">
            <TabsTrigger value="agenda" className="data-[state=active]:bg-card"><Calendar className="w-4 h-4 mr-1.5" />Agenda</TabsTrigger>
            <TabsTrigger value="barbers" className="data-[state=active]:bg-card"><Scissors className="w-4 h-4 mr-1.5" />Barberos</TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-card"><BarChart3 className="w-4 h-4 mr-1.5" />Servicios</TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-card"><Users className="w-4 h-4 mr-1.5" />Clientes</TabsTrigger>
          </TabsList>

          <TabsContent value="agenda"><AgendaTab /></TabsContent>
          <TabsContent value="barbers"><BarbersTab /></TabsContent>
          <TabsContent value="services"><ServicesTab /></TabsContent>
          <TabsContent value="clients"><ClientsTab /></TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function DashboardStats() {
  const { appointments, barbers, clients } = useStore();
  const today = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter(a => a.date === today);
  const stats = [
    { label: 'Citas Hoy', value: todayApts.length, icon: Calendar, color: 'text-status-scheduled' },
    { label: 'En Servicio', value: todayApts.filter(a => a.status === 'in_service').length, icon: Clock, color: 'text-status-in-service' },
    { label: 'Barberos Activos', value: barbers.filter(b => b.active).length, icon: Scissors, color: 'text-accent' },
    { label: 'Clientes', value: clients.length, icon: Users, color: 'text-status-completed' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(s => (
        <Card key={s.label}>
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AgendaTab() {
  const { appointments, getBarber, getClient, getService, cancelAppointment, rescheduleAppointment, services, barbers, clients, createAppointment, getAvailableSlots } = useStore();
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = appointments
    .filter(a => a.date === dateFilter)
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleCancel = (id: string) => {
    if (cancelAppointment(id)) toast.success('Cita cancelada');
    else toast.error('No se puede cancelar esta cita');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="text-sm">Fecha:</Label>
          <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-44" />
        </div>
        <Button className="gold-gradient text-obsidian font-semibold" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-1" /> Nueva Cita
        </Button>
      </div>

      {showCreate && <CreateAppointmentForm onClose={() => setShowCreate(false)} />}

      {filtered.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground text-sm">No hay citas para esta fecha</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map(apt => (
            <Card key={apt.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-lg w-14">{apt.time}</span>
                    <div>
                      <p className="text-sm font-medium">{getClient(apt.clientId)?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getService(apt.serviceId)?.name} · {getBarber(apt.barberId)?.name} · {apt.duration}min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={apt.status} />
                    {apt.status === 'scheduled' && (
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleCancel(apt.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateAppointmentForm({ onClose }: { onClose: () => void }) {
  const { services, barbers, clients, createAppointment, getAvailableSlots } = useStore();
  const [clientId, setClientId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [barberId, setBarberId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');

  const svc = services.find(s => s.id === serviceId);
  const slots = barberId && date && svc ? getAvailableSlots(barberId, date, svc.duration) : [];

  const handleSubmit = () => {
    if (!clientId || !serviceId || !barberId || !date || !time || !svc) {
      toast.error('Completa todos los campos');
      return;
    }
    const id = createAppointment({ clientId, barberId, serviceId, date, time, duration: svc.duration, status: 'scheduled' });
    if (id) { toast.success('Cita creada'); onClose(); }
    else toast.error('Horario no disponible');
  };

  return (
    <Card className="mb-4 border-accent/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Nueva Cita</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Cliente</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Servicio</Label>
          <Select value={serviceId} onValueChange={v => { setServiceId(v); setTime(''); }}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>{services.map(s => <SelectItem key={s.id} value={s.id}>{s.name} (${s.price})</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Barbero</Label>
          <Select value={barberId} onValueChange={v => { setBarberId(v); setTime(''); }}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>{barbers.filter(b => b.active).map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Fecha</Label>
          <Input type="date" value={date} onChange={e => { setDate(e.target.value); setTime(''); }} className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs">Hora</Label>
          {slots.length === 0 ? (
            <p className="text-xs text-muted-foreground mt-1">{barberId && serviceId && date ? 'Sin horarios disponibles' : 'Selecciona barbero, servicio y fecha'}</p>
          ) : (
            <div className="flex gap-2 flex-wrap mt-1">
              {slots.map(s => (
                <button key={s} className={`px-3 py-1.5 rounded border text-xs font-medium transition-all duration-150 ${time === s ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:border-accent/50'}`} onClick={() => setTime(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="sm:col-span-2">
          <Button className="gold-gradient text-obsidian font-semibold w-full" onClick={handleSubmit}>Crear Cita</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BarbersTab() {
  const { barbers, toggleBarber, addBarber } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleAdd = () => {
    if (!name.trim()) { toast.error('Ingresa un nombre'); return; }
    addBarber({
      name, specialty: specialty || 'General',
      schedule: [1,2,3,4,5,6].map(day => ({ day, start: '09:00', end: '18:00' })),
      active: true,
    });
    toast.success('Barbero agregado');
    setName(''); setSpecialty(''); setShowAdd(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button className="gold-gradient text-obsidian font-semibold" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4 mr-1" /> Agregar Barbero
        </Button>
      </div>
      {showAdd && (
        <Card className="mb-4 border-accent/30">
          <CardContent className="pt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Nombre</Label>
              <Input value={name} onChange={e => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Especialidad</Label>
              <Input value={specialty} onChange={e => setSpecialty(e.target.value)} className="mt-1" />
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancelar</Button>
              <Button className="gold-gradient text-obsidian font-semibold" onClick={handleAdd}>Guardar</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-3">
        {barbers.map(b => (
          <Card key={b.id}>
            <CardContent className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.specialty}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => { toggleBarber(b.id); toast.success(b.active ? 'Barbero desactivado' : 'Barbero activado'); }}>
                {b.active ? 'Desactivar' : 'Activar'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ServicesTab() {
  const { services, addService, updateService } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('30');
  const [price, setPrice] = useState('15');
  const [desc, setDesc] = useState('');

  const handleAdd = () => {
    if (!name.trim()) { toast.error('Ingresa un nombre'); return; }
    addService({ name, duration: parseInt(duration), price: parseInt(price), description: desc || name });
    toast.success('Servicio creado');
    setName(''); setDuration('30'); setPrice('15'); setDesc(''); setShowAdd(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button className="gold-gradient text-obsidian font-semibold" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4 mr-1" /> Agregar Servicio
        </Button>
      </div>
      {showAdd && (
        <Card className="mb-4 border-accent/30">
          <CardContent className="pt-4 grid gap-3 sm:grid-cols-2">
            <div><Label className="text-xs">Nombre</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" /></div>
            <div><Label className="text-xs">Descripción</Label><Input value={desc} onChange={e => setDesc(e.target.value)} className="mt-1" /></div>
            <div><Label className="text-xs">Duración (min)</Label><Input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="mt-1" /></div>
            <div><Label className="text-xs">Precio ($)</Label><Input type="number" value={price} onChange={e => setPrice(e.target.value)} className="mt-1" /></div>
            <div className="sm:col-span-2 flex gap-2">
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancelar</Button>
              <Button className="gold-gradient text-obsidian font-semibold" onClick={handleAdd}>Guardar</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-3">
        {services.map(s => (
          <Card key={s.id}>
            <CardContent className="py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.description} · {s.duration}min</p>
              </div>
              <span className="font-display font-bold text-accent">${s.price}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ClientsTab() {
  const { clients, appointments, getService, getBarber } = useStore();

  return (
    <div className="grid gap-3">
      {clients.map(c => {
        const clientApts = appointments.filter(a => a.clientId === c.id);
        const completed = clientApts.filter(a => a.status === 'completed').length;
        return (
          <Card key={c.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{completed} servicios</span>
              </div>
              {clientApts.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Últimas citas:</p>
                  {clientApts.slice(-3).map(a => (
                    <div key={a.id} className="flex items-center justify-between text-xs py-0.5">
                      <span>{getService(a.serviceId)?.name} · {a.date}</span>
                      <StatusBadge status={a.status} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
