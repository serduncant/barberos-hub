import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Scissors, Clock, Star, ArrowRight, Coffee } from 'lucide-react';
import { MOCK_SERVICES } from '@/data/mockData';
import heroImage from '@/assets/hero-barbershop.jpg';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-obsidian/95 backdrop-blur-sm border-b border-gold/20">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <h1 className="font-display font-bold text-xl text-gold">BarberOS</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-gold/80 hover:text-gold hover:bg-gold/10" onClick={() => navigate('/auth')}>
              Iniciar Sesión
            </Button>
            <Button className="gold-gradient text-obsidian font-semibold hover:opacity-90" onClick={() => navigate('/auth')}>
              Reservar Cita
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Barbería moderna premium" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-obsidian/70" />
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <p className="text-gold font-display font-semibold text-sm uppercase tracking-[0.3em] mb-4">
            Sistema de gestión para barberías
          </p>
          <h2 className="font-display font-bold text-5xl md:text-7xl text-primary-foreground mb-6 leading-tight">
            BarberOS<br />
            <span className="text-gold">Demo Shop</span>
          </h2>
          <p className="text-primary-foreground/70 text-lg md:text-xl max-w-xl mx-auto mb-8">
            Reserva tu cita en segundos. Estilo, precisión y experiencia premium en cada visita.
          </p>
          <Button
            size="lg"
            className="gold-gradient text-obsidian font-display font-bold text-lg px-10 py-6 hover:opacity-90 transition-opacity duration-150"
            onClick={() => navigate('/auth')}
          >
            Reservar Cita <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <p className="text-accent font-display font-semibold text-sm uppercase tracking-[0.2em] text-center mb-2">Nuestros Servicios</p>
          <h3 className="font-display font-bold text-3xl md:text-4xl text-center mb-12 text-card-foreground">
            Precisión en cada corte
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {MOCK_SERVICES.map(svc => (
              <div key={svc.id} className="group border border-border rounded-lg p-6 hover:border-accent/50 hover:shadow-lg transition-all duration-150 bg-card">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display font-semibold text-lg text-card-foreground">{svc.name}</h4>
                  <span className="text-accent font-bold text-lg">${svc.price}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{svc.description}</p>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{svc.duration} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 obsidian-gradient">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-display font-bold text-3xl text-primary-foreground mb-4">
            ¿Listo para tu próximo corte?
          </h3>
          <p className="text-primary-foreground/60 mb-8 max-w-md mx-auto">
            Agenda tu cita ahora y disfruta de la experiencia BarberOS.
          </p>
          <Button
            size="lg"
            className="gold-gradient text-obsidian font-display font-bold px-10 py-6 hover:opacity-90"
            onClick={() => navigate('/auth')}
          >
            Reservar Ahora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-obsidian py-8 border-t border-gold/10">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
          <a
            href="https://paypal.me/StarkGeek?locale.x=es_XC&country.x=GT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFDD00] text-black font-semibold text-xs transition-transform hover:scale-105 shadow-md"
          >
            <Coffee className="w-4 h-4" />
            <span>Invítame un café</span>
          </a>
          <div>
            <p className="text-gold font-display font-semibold text-sm">BarberOS Demo Shop</p>
            <p className="text-primary-foreground/40 text-xs mt-1">Sistema de gestión para barberías</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
