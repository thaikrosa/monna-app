import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useCreateCalendarEvent } from '@/hooks/useCreateCalendarEvent';
import { toast } from 'sonner';
import { format, addHours } from 'date-fns';
import { CaretDown, Spinner } from '@phosphor-icons/react';

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
}

function getNextFullHour(): string {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1, 0, 0, 0);
  return format(nextHour, 'HH:mm');
}

function calculateEndTime(startTime: string): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endHours = (hours + 1) % 24;
  return `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function AddEventDialog({ open, onOpenChange, defaultDate }: AddEventDialogProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(
    defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [startTime, setStartTime] = useState(getNextFullHour());
  const [endTime, setEndTime] = useState(calculateEndTime(getNextFullHour()));
  const [isAllDay, setIsAllDay] = useState(false);
  
  // "Mais opções" section
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const createEvent = useCreateCalendarEvent();

  const resetForm = () => {
    setTitle('');
    setEventDate(defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
    setStartTime(getNextFullHour());
    setEndTime(calculateEndTime(getNextFullHour()));
    setIsAllDay(false);
    setShowMoreOptions(false);
    setLocation('');
    setDescription('');
  };

  const handleStartTimeChange = (newTime: string) => {
    setStartTime(newTime);
    // Auto-calculate end time (+1 hour)
    setEndTime(calculateEndTime(newTime));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !eventDate) return;

    let starts_at: string;
    let ends_at: string;

    if (isAllDay) {
      // All-day events: use date only format
      starts_at = `${eventDate}T00:00:00`;
      ends_at = `${eventDate}T23:59:59`;
    } else {
      // Timed events: use full ISO format with timezone
      starts_at = `${eventDate}T${startTime}:00`;
      ends_at = `${eventDate}T${endTime}:00`;
    }

    try {
      await createEvent.mutateAsync({
        title: title.trim(),
        starts_at,
        ends_at,
        is_all_day: isAllDay,
        location: location.trim() || undefined,
        description: description.trim() || undefined,
        timezone: 'America/Sao_Paulo',
      });

      toast.success('Evento criado no Google Calendar');
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('[AddEventDialog] Error creating event:', error);
      toast.error('Erro ao criar evento. Tente novamente.');
    }
  };

  const isValid = title.trim() && eventDate;

  const inputClass = "bg-transparent border-0 border-b border-border/30 rounded-none focus:border-primary/50 focus:ring-0 transition-colors duration-150 placeholder:text-muted-foreground/40";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-md px-5 py-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Novo Evento</DialogTitle>
          <DialogDescription className="text-muted-foreground/70">
            Adicione ao Google Calendar
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          {/* ESSENCIAIS */}
          <div className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="event-title" className="text-xs text-muted-foreground/70">
                O que?
              </Label>
              <Input
                id="event-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Reunião escola"
                className={inputClass}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="event-date" className="text-xs text-muted-foreground/70">
                Quando?
              </Label>
              <Input
                id="event-date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={inputClass}
              />
            </div>

            {!isAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="start-time" className="text-xs text-muted-foreground/70">
                    Hora início
                  </Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="end-time" className="text-xs text-muted-foreground/70">
                    Hora fim
                  </Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>

          {/* DIA INTEIRO TOGGLE */}
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="all-day" className="text-sm text-muted-foreground">
              Dia inteiro
            </Label>
            <Switch
              id="all-day"
              checked={isAllDay}
              onCheckedChange={setIsAllDay}
            />
          </div>

          {/* MAIS OPÇÕES */}
          <Collapsible open={showMoreOptions} onOpenChange={setShowMoreOptions}>
            <CollapsibleTrigger asChild>
              <button 
                type="button"
                className="flex items-center gap-2 text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-150"
              >
                <CaretDown 
                  weight="regular" 
                  className={`h-4 w-4 transition-transform duration-150 ${showMoreOptions ? 'rotate-180' : ''}`} 
                />
                Mais opções
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-5 pt-6">
              <div className="space-y-3">
                <Label htmlFor="location" className="text-xs text-muted-foreground/70">
                  Local
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Escola, Consultório..."
                  className={inputClass}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-xs text-muted-foreground/70">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes do evento..."
                  className={`${inputClass} min-h-[80px] resize-none`}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* SUBMIT BUTTON */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid || createEvent.isPending}
            className="w-full"
          >
            {createEvent.isPending ? (
              <>
                <Spinner weight="regular" className="h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Evento'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
