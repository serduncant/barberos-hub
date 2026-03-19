import { create } from 'zustand';
import { Service, Barber, Client, Appointment, User, AppointmentStatus, AppointmentEvent, Role } from '@/types';
import { MOCK_SERVICES, MOCK_BARBERS, MOCK_CLIENTS, MOCK_APPOINTMENTS, MOCK_USERS } from '@/data/mockData';

const STORAGE_KEY = 'barberos_state';

interface AppState {
  services: Service[];
  barbers: Barber[];
  clients: Client[];
  appointments: Appointment[];
  users: User[];
  currentUser: User | null;

  // Auth
  login: (userId: string) => void;
  logout: () => void;

  // Appointments
  createAppointment: (apt: Omit<Appointment, 'id' | 'events' | 'barberNotes'>) => string | null;
  transitionAppointment: (id: string, newStatus: AppointmentStatus) => boolean;
  updateAppointmentNotes: (id: string, notes: string) => void;
  cancelAppointment: (id: string) => boolean;
  rescheduleAppointment: (id: string, date: string, time: string) => boolean;

  // Barbers
  addBarber: (barber: Omit<Barber, 'id'>) => void;
  updateBarber: (id: string, data: Partial<Barber>) => void;
  toggleBarber: (id: string) => void;

  // Services
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, data: Partial<Service>) => void;

  // Clients
  updateClient: (id: string, data: Partial<Client>) => void;

  // Utils
  resetData: () => void;
  getBarber: (id: string) => Barber | undefined;
  getClient: (id: string) => Client | undefined;
  getService: (id: string) => Service | undefined;
  getAvailableSlots: (barberId: string, date: string, duration: number, excludeAptId?: string) => string[];
}

const VALID_TRANSITIONS: Record<string, AppointmentStatus[]> = {
  scheduled: ['in_service', 'cancelled', 'no_show'],
  in_service: ['completed'],
  completed: [],
  cancelled: [],
  no_show: [],
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveState(state: Partial<AppState>) {
  try {
    const { services, barbers, clients, appointments, users, currentUser } = state as AppState;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ services, barbers, clients, appointments, currentUser }));
  } catch { /* ignore */ }
}

const saved = loadState();

const initialState = {
  services: saved?.services ?? MOCK_SERVICES,
  barbers: saved?.barbers ?? MOCK_BARBERS,
  clients: saved?.clients ?? MOCK_CLIENTS,
  appointments: saved?.appointments ?? MOCK_APPOINTMENTS,
  users: MOCK_USERS,
  currentUser: saved?.currentUser ?? null,
};

let aptCounter = 100;

export const useStore = create<AppState>((set, get) => ({
  ...initialState,

  login: (userId) => {
    const user = get().users.find(u => u.id === userId) || null;
    set({ currentUser: user });
    saveState({ ...get(), currentUser: user });
  },

  logout: () => {
    set({ currentUser: null });
    saveState({ ...get(), currentUser: null });
  },

  createAppointment: (apt) => {
    const state = get();
    const slots = state.getAvailableSlots(apt.barberId, apt.date, apt.duration);
    if (!slots.includes(apt.time)) return null;

    const id = `apt_${++aptCounter}`;
    const newApt: Appointment = {
      ...apt,
      id,
      barberNotes: '',
      events: [
        { type: 'created', timestamp: new Date().toISOString() },
        { type: 'barber_assigned', timestamp: new Date().toISOString() },
      ],
    };
    const appointments = [...state.appointments, newApt];
    set({ appointments });
    saveState({ ...get() });
    return id;
  },

  transitionAppointment: (id, newStatus) => {
    const state = get();
    const apt = state.appointments.find(a => a.id === id);
    if (!apt) return false;
    const allowed = VALID_TRANSITIONS[apt.status];
    if (!allowed?.includes(newStatus)) return false;

    const eventType: AppointmentEvent['type'] =
      newStatus === 'in_service' ? 'service_started' :
      newStatus === 'completed' ? 'service_completed' : 'created';

    const updated = state.appointments.map(a =>
      a.id === id ? {
        ...a,
        status: newStatus,
        events: [...a.events, { type: eventType, timestamp: new Date().toISOString() }],
      } : a
    );
    set({ appointments: updated });
    saveState({ ...get() });
    return true;
  },

  updateAppointmentNotes: (id, notes) => {
    const updated = get().appointments.map(a => a.id === id ? { ...a, barberNotes: notes } : a);
    set({ appointments: updated });
    saveState({ ...get() });
  },

  cancelAppointment: (id) => get().transitionAppointment(id, 'cancelled'),

  rescheduleAppointment: (id, date, time) => {
    const state = get();
    const apt = state.appointments.find(a => a.id === id);
    if (!apt || apt.status !== 'scheduled') return false;
    const slots = state.getAvailableSlots(apt.barberId, date, apt.duration, id);
    if (!slots.includes(time)) return false;
    const updated = state.appointments.map(a => a.id === id ? { ...a, date, time } : a);
    set({ appointments: updated });
    saveState({ ...get() });
    return true;
  },

  addBarber: (barber) => {
    const id = `barber_${Date.now()}`;
    const newBarber: Barber = { ...barber, id };
    const newUser: User = { id: `user_${id}`, name: barber.name, role: 'barber', linkedId: id };
    set(s => ({ barbers: [...s.barbers, newBarber], users: [...s.users, newUser] }));
    saveState({ ...get() });
  },

  updateBarber: (id, data) => {
    set(s => ({ barbers: s.barbers.map(b => b.id === id ? { ...b, ...data } : b) }));
    saveState({ ...get() });
  },

  toggleBarber: (id) => {
    set(s => ({ barbers: s.barbers.map(b => b.id === id ? { ...b, active: !b.active } : b) }));
    saveState({ ...get() });
  },

  addService: (service) => {
    const id = `svc_${Date.now()}`;
    set(s => ({ services: [...s.services, { ...service, id }] }));
    saveState({ ...get() });
  },

  updateService: (id, data) => {
    set(s => ({ services: s.services.map(sv => sv.id === id ? { ...sv, ...data } : sv) }));
    saveState({ ...get() });
  },

  updateClient: (id, data) => {
    set(s => ({ clients: s.clients.map(c => c.id === id ? { ...c, ...data } : c) }));
    saveState({ ...get() });
  },

  resetData: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      services: MOCK_SERVICES,
      barbers: MOCK_BARBERS,
      clients: MOCK_CLIENTS,
      appointments: MOCK_APPOINTMENTS,
      users: MOCK_USERS,
      currentUser: null,
    });
  },

  getBarber: (id) => get().barbers.find(b => b.id === id),
  getClient: (id) => get().clients.find(c => c.id === id),
  getService: (id) => get().services.find(s => s.id === id),

  getAvailableSlots: (barberId, date, duration, excludeAptId) => {
    const state = get();
    const barber = state.barbers.find(b => b.id === barberId);
    if (!barber) return [];

    const d = new Date(date);
    const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay();
    const scheduleDay = barber.schedule.find(s => s.day === dayOfWeek);
    if (!scheduleDay) return [];

    const [startH, startM] = scheduleDay.start.split(':').map(Number);
    const [endH, endM] = scheduleDay.end.split(':').map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;

    const barberApts = state.appointments.filter(
      a => a.barberId === barberId && a.date === date && a.status !== 'cancelled' && a.status !== 'no_show' && a.id !== excludeAptId
    );

    const slots: string[] = [];
    for (let m = startMin; m + duration <= endMin; m += 30) {
      const slotStart = m;
      const slotEnd = m + duration;
      const conflict = barberApts.some(a => {
        const [ah, am] = a.time.split(':').map(Number);
        const aStart = ah * 60 + am;
        const aEnd = aStart + a.duration;
        return slotStart < aEnd && slotEnd > aStart;
      });
      if (!conflict) {
        const h = Math.floor(m / 60).toString().padStart(2, '0');
        const min = (m % 60).toString().padStart(2, '0');
        slots.push(`${h}:${min}`);
      }
    }
    return slots;
  },
}));
