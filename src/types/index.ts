export type Role = 'admin' | 'barber' | 'customer';

export type AppointmentStatus = 'scheduled' | 'in_service' | 'completed' | 'cancelled' | 'no_show';

export interface Service {
  id: string;
  name: string;
  duration: number; // minutes
  price: number;
  description: string;
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  schedule: { day: number; start: string; end: string }[];
  active: boolean;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface AppointmentEvent {
  type: 'created' | 'barber_assigned' | 'service_started' | 'service_completed' | 'client_confirmed';
  timestamp: string;
  detail?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number;
  status: AppointmentStatus;
  barberNotes: string;
  events: AppointmentEvent[];
}

export interface User {
  id: string;
  name: string;
  role: Role;
  linkedId: string; // links to barber or client id
}
