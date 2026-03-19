import { Service, Barber, Client, Appointment, User } from '@/types';

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const todayStr = fmt(today);
const tomorrowStr = fmt(new Date(today.getTime() + 86400000));

export const MOCK_SERVICES: Service[] = [
  { id: 'svc_01', name: 'Corte Clásico', duration: 30, price: 15, description: 'Corte tradicional con tijera y máquina' },
  { id: 'svc_02', name: 'Fade', duration: 40, price: 20, description: 'Degradado moderno con acabado limpio' },
  { id: 'svc_03', name: 'Corte + Barba', duration: 50, price: 28, description: 'Corte completo con perfilado de barba' },
  { id: 'svc_04', name: 'Afeitado Clásico', duration: 25, price: 12, description: 'Afeitado con navaja y toalla caliente' },
  { id: 'svc_05', name: 'Corte Premium', duration: 60, price: 35, description: 'Experiencia completa con lavado, corte y styling' },
];

export const MOCK_BARBERS: Barber[] = [
  {
    id: 'barber_01', name: 'Carlos Méndez', specialty: 'Fades & Diseños',
    schedule: [1,2,3,4,5,6].map(day => ({ day, start: '09:00', end: '18:00' })),
    active: true,
  },
  {
    id: 'barber_02', name: 'Luis Herrera', specialty: 'Cortes Clásicos',
    schedule: [1,2,3,4,5].map(day => ({ day, start: '10:00', end: '19:00' })),
    active: true,
  },
  {
    id: 'barber_03', name: 'Andrés Ríos', specialty: 'Barba & Afeitado',
    schedule: [1,2,3,4,5,6].map(day => ({ day, start: '09:00', end: '17:00' })),
    active: true,
  },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'client_01', name: 'Miguel Torres', phone: '+34 612 345 678', email: 'miguel@email.com' },
  { id: 'client_02', name: 'David García', phone: '+34 623 456 789', email: 'david@email.com' },
  { id: 'client_03', name: 'Javier López', phone: '+34 634 567 890', email: 'javier@email.com' },
  { id: 'client_04', name: 'Alejandro Ruiz', phone: '+34 645 678 901', email: 'alejandro@email.com' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_01', clientId: 'client_01', barberId: 'barber_01', serviceId: 'svc_02',
    date: todayStr, time: '10:00', duration: 40, status: 'scheduled', barberNotes: '',
    events: [{ type: 'created', timestamp: new Date().toISOString() }, { type: 'barber_assigned', timestamp: new Date().toISOString() }],
  },
  {
    id: 'apt_02', clientId: 'client_02', barberId: 'barber_02', serviceId: 'svc_01',
    date: todayStr, time: '11:00', duration: 30, status: 'in_service', barberNotes: 'Cliente prefiere corte sin máquina',
    events: [
      { type: 'created', timestamp: new Date().toISOString() },
      { type: 'barber_assigned', timestamp: new Date().toISOString() },
      { type: 'service_started', timestamp: new Date().toISOString() },
    ],
  },
  {
    id: 'apt_03', clientId: 'client_03', barberId: 'barber_03', serviceId: 'svc_04',
    date: todayStr, time: '09:00', duration: 25, status: 'completed', barberNotes: 'Piel sensible, usar bálsamo especial',
    events: [
      { type: 'created', timestamp: new Date().toISOString() },
      { type: 'barber_assigned', timestamp: new Date().toISOString() },
      { type: 'service_started', timestamp: new Date().toISOString() },
      { type: 'service_completed', timestamp: new Date().toISOString() },
    ],
  },
  {
    id: 'apt_04', clientId: 'client_04', barberId: 'barber_01', serviceId: 'svc_05',
    date: tomorrowStr, time: '14:00', duration: 60, status: 'scheduled', barberNotes: '',
    events: [{ type: 'created', timestamp: new Date().toISOString() }],
  },
  {
    id: 'apt_05', clientId: 'client_01', barberId: 'barber_02', serviceId: 'svc_03',
    date: tomorrowStr, time: '16:00', duration: 50, status: 'scheduled', barberNotes: '',
    events: [{ type: 'created', timestamp: new Date().toISOString() }],
  },
];

export const MOCK_USERS: User[] = [
  { id: 'user_admin', name: 'Admin BarberOS', role: 'admin', linkedId: '' },
  { id: 'user_barber_01', name: 'Carlos Méndez', role: 'barber', linkedId: 'barber_01' },
  { id: 'user_barber_02', name: 'Luis Herrera', role: 'barber', linkedId: 'barber_02' },
  { id: 'user_barber_03', name: 'Andrés Ríos', role: 'barber', linkedId: 'barber_03' },
  { id: 'user_client_01', name: 'Miguel Torres', role: 'customer', linkedId: 'client_01' },
  { id: 'user_client_02', name: 'David García', role: 'customer', linkedId: 'client_02' },
  { id: 'user_client_03', name: 'Javier López', role: 'customer', linkedId: 'client_03' },
  { id: 'user_client_04', name: 'Alejandro Ruiz', role: 'customer', linkedId: 'client_04' },
];
