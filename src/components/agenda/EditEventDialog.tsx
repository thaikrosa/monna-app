import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useUpdateCalendarEvent } from '@/hooks/useUpdateCalendarEvent';
import { DeleteEventAlert } from './DeleteEventAlert';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CaretDown, Spinner, Trash } from '@phosphor-icons/react';
import type { AgendaEvent } from '@/hooks/useTodayCalendarEvents';

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: AgendaEvent | null;
}

export function EditEventDialog({ open, onOpenChange, event }: EditEventDialogProps) {
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const updateEvent = useUpdateCalendarEvent();

  // Populate form when event changes
  useEffect(() => {
    if (!event) return;
    setTitle(event.title || '');
    const start = new Date(event.starts_at);
    setEventDate(format(start, 'yyyy-MM-dd'));
    setStartTime(format(start, 'HH:mm'));
    const end = new Date(event.ends_at);
    setEndTime(format(end, 'HH:mm'));
    setIsAllDay(event.is_all_day);
    setLocation(event.location || '');
    setDescription(event.description || '');
    setShowMoreOptions(!!(event.location || event.description));
  }, [event]);

  if (!event) return null;

  const handleStartTimeChange = (newTime: string) => {
    setStartTime(newTime);
    const [h, m] = newTime.split(':').map(Number);
    setEndTime(`${String((h + 1) % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !eventDate) return;

    const changes: Record<string, unknown> = {};
    if (title.trim() !== (event.title || '')) changes.title = title.trim();
    if (isAllDay !== event.is_all_day) changes.is_all_day = isAllDay;
    if (location.trim() !== (event.location || '')) changes.location = location.trim();
    if (description.trim() !== (event.description || '')) changes.description = description.trim();

    let newStartsAt: string;
    let newEndsAt: string;
    if (isAllDay) {
      newStartsAt = `${eventDate}T00:00:00-03:00`;
      newEndsAt = `${eventDate}T23:59:59-03:00`;
    } else {
      newStartsAt = `${eventDate}T${startTime}:00-03:00`;
      newEndsAt = `${eventDate}T${endTime}:00-03:00`;
    }

    const origStart = new Date(event.starts_at);
    const origEnd = new Date(event.ends_at);
    if (new Date(newStartsAt).getTime() !== origStart.getTime()) changes.starts_at = newStartsAt;
    if (new Date(newEndsAt).getTime() !== origEnd.getTime()) changes.ends_at = newEndsAt;

    if (Object.keys(changes).length === 0) {
      onOpenChange(false);
      return;
    }

    try {
      await updateEvent.mutateAsync({
        event_id: event.event_id,
        instance_id: event.is_recurring ? event.instance_id : undefined,
        timezone: 'America/Sao_Paulo',
        ...changes,
      });
      toast.success('Evento atualizado');
      onOpenChange(false);
    } catch {
      toast.error('Erro ao atualizar evento. Tente novamente.');
    }
  };

  const isValid = title.trim() && eventDate;
  const inputClass = "bg-transparent border-0 border-b border-border/30 rounded-none focus:border-primary/50 focus:ring-0 transition-colors duration-150 placeholder:text-muted-foreground/40";

  return (
    <>
      <Dialog open={open && !showDeleteAlert} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-md px-5 py-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">Editar Evento</DialogTitle>
            <DialogDescription className="text-muted-foreground/70">
              Atualizar no Google Calendar
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-8">
            <div className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="edit-title" className="text-xs text-muted-foreground/70">O que?</Label>
                <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
              </div>

              <div className="space-y-3">
                <Label htmlFor="edit-date" className="text-xs text-muted-foreground/70">Quando?</Label>
                <Input id="edit-date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={inputClass} />
              </div>

              {!isAllDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="edit-start" className="text-xs text-muted-foreground/70">Hora início</Label>
                    <Input id="edit-start" type="time" value={startTime} onChange={(e) => handleStartTimeChange(e.target.value)} className={inputClass} />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="edit-end" className="text-xs text-muted-foreground/70">Hora fim</Label>
                    <Input id="edit-end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between py-2">
              <Label htmlFor="edit-all-day" className="text-sm text-muted-foreground">Dia inteiro</Label>
              <Switch id="edit-all-day" checked={isAllDay} onCheckedChange={setIsAllDay} />
            </div>

            <Collapsible open={showMoreOptions} onOpenChange={setShowMoreOptions}>
              <CollapsibleTrigger asChild>
                <button type="button" className="flex items-center gap-2 text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-150">
                  <CaretDown weight="regular" className={`h-4 w-4 transition-transform duration-150 ${showMoreOptions ? 'rotate-180' : ''}`} />
                  Mais opções
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-5 pt-6">
                <div className="space-y-3">
                  <Label htmlFor="edit-location" className="text-xs text-muted-foreground/70">Local</Label>
                  <Input id="edit-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex: Escola, Consultório..." className={inputClass} />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="edit-desc" className="text-xs text-muted-foreground/70">Descrição</Label>
                  <Textarea id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes do evento..." className={`${inputClass} min-h-[80px] resize-none`} />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="space-y-3">
              <Button onClick={handleSubmit} disabled={!isValid || updateEvent.isPending} className="w-full">
                {updateEvent.isPending ? (
                  <><Spinner weight="regular" className="h-4 w-4 animate-spin" /> Salvando...</>
                ) : 'Salvar'}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setShowDeleteAlert(true)}
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash weight="regular" className="h-4 w-4" />
                Excluir evento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteEventAlert
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        eventId={event.event_id}
        instanceId={event.instance_id}
        isRecurring={event.is_recurring}
        title={event.title || 'Evento sem título'}
        onDeleted={() => onOpenChange(false)}
      />
    </>
  );
}
