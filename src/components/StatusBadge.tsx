import { AppointmentStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  scheduled: { label: 'Agendada', className: 'bg-status-scheduled/15 text-status-scheduled border-status-scheduled/30' },
  in_service: { label: 'En Servicio', className: 'bg-status-in-service/15 text-status-in-service border-status-in-service/30' },
  completed: { label: 'Completada', className: 'bg-status-completed/15 text-status-completed border-status-completed/30' },
  cancelled: { label: 'Cancelada', className: 'bg-status-cancelled/15 text-status-cancelled border-status-cancelled/30' },
  no_show: { label: 'No Show', className: 'bg-status-no-show/15 text-status-no-show border-status-no-show/30' },
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn('font-medium text-xs border', config.className)}>
      {config.label}
    </Badge>
  );
}
