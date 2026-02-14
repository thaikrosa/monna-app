import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useAddReminder } from '@/hooks/useReminders';
import { toast } from 'sonner';
import { format, addDays, differenceInDays } from 'date-fns';
import { WhatsappLogo } from '@phosphor-icons/react';
import type { ReminderCategory, ReminderPriority, RecurrenceType } from '@/types/reminders';

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const recurrenceOptions: { value: RecurrenceType; label: string }[] = [
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
  { value: 'interval', label: 'Intervalo' },
];

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function getNextFullHour(): string {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1, 0, 0, 0);
  return format(nextHour, 'HH:mm');
}

export function AddReminderDialog({ open, onOpenChange }: AddReminderDialogProps) {
  const titleRef = useRef<HTMLInputElement>(null);

  // Essenciais
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueTime, setDueTime] = useState(getNextFullHour());

  // Recorrência
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [intervalHoursStr, setIntervalHoursStr] = useState('24');
  const [durationDaysStr, setDurationDaysStr] = useState('7');
  const [recurrenceEnd, setRecurrenceEnd] = useState('');
  const [lastEdited, setLastEdited] = useState<'duration' | 'endDate' | null>(null);

  // Notificação
  const [sendWhatsapp, setSendWhatsapp] = useState(true);

  // Validação
  const [attempted, setAttempted] = useState(false);

  const addReminder = useAddReminder();

  // Autofocus on title when dialog opens
  useEffect(() => {
    if (open) {
      setDueDate(format(new Date(), 'yyyy-MM-dd'));
      setDueTime(getNextFullHour());
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (lastEdited === 'duration' && durationDaysStr && dueDate) {
      const days = parseInt(durationDaysStr);
      if (!isNaN(days) && days > 0) {
        const endDate = addDays(new Date(dueDate), days);
        setRecurrenceEnd(format(endDate, 'yyyy-MM-dd'));
      }
    }
  }, [durationDaysStr, dueDate, lastEdited]);

  useEffect(() => {
    if (lastEdited === 'endDate' && recurrenceEnd && dueDate) {
      const days = differenceInDays(new Date(recurrenceEnd), new Date(dueDate));
      if (days > 0) {
        setDurationDaysStr(String(days));
      }
    }
  }, [recurrenceEnd, dueDate, lastEdited]);

  const resetForm = () => {
    setTitle('');
    setDueDate(format(new Date(), 'yyyy-MM-dd'));
    setDueTime(getNextFullHour());
    setShowRecurrence(false);
    setRecurrenceType('daily');
    setDaysOfWeek([]);
    setIntervalHoursStr('24');
    setDurationDaysStr('7');
    setRecurrenceEnd('');
    setLastEdited(null);
    setSendWhatsapp(true);
    setAttempted(false);
  };

  const toggleDayOfWeek = (day: number) => {
    setDaysOfWeek(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = async () => {
    setAttempted(true);

    if (!title.trim()) {
      titleRef.current?.focus();
      return;
    }
    if (!dueDate || !dueTime) return;

    const datetime = new Date(`${dueDate}T${dueTime}:00`);

    if (datetime < new Date()) {
      toast.error('Esse horário já passou. Vamos agendar para quando?');
      return;
    }

    const intervalHours = parseInt(intervalHoursStr) || 24;

    let recurrence_config: Record<string, unknown> | null = null;
    if (showRecurrence && recurrenceType === 'weekly' && daysOfWeek.length > 0) {
      recurrence_config = { days_of_week: daysOfWeek };
    } else if (showRecurrence && recurrenceType === 'interval') {
      recurrence_config = { interval_hours: intervalHours, duration_days: parseInt(durationDaysStr) || 7 };
    }

    const trimmedTitle = title.trim();
    const capitalizedTitle = trimmedTitle.charAt(0).toUpperCase() + trimmedTitle.slice(1);

    const payload = {
      title: capitalizedTitle,
      description: null,
      datetime: datetime.toISOString(),
      category: 'other' as ReminderCategory,
      priority: 'normal' as ReminderPriority,
      recurrence_type: showRecurrence ? recurrenceType : 'once',
      recurrence_config,
      recurrence_end: recurrenceEnd || null,
      effort_level: 1,
      call_guarantee: false,
      send_whatsapp: sendWhatsapp,
    };

    try {
      await addReminder.mutateAsync(payload);
      toast.success('Lembrete criado');
      resetForm();
      onOpenChange(false);
    } catch {
      toast.error('Erro ao criar lembrete');
    }
  };

  const selectedDateTime = dueDate && dueTime ? new Date(`${dueDate}T${dueTime}:00`) : null;
  const isDateInPast = selectedDateTime ? selectedDateTime < new Date() : false;
  const isValid = title.trim() && dueDate && dueTime && !isDateInPast;

  const inputClass = "bg-transparent border-0 border-b border-border/30 rounded-none focus:border-primary/50 focus:ring-0 transition-colors duration-150 placeholder:text-muted-foreground/40";
  const selectedSolidClass = "bg-primary text-primary-foreground";
  const unselectedClass = "bg-muted/20 text-muted-foreground hover:bg-muted/40";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto max-w-md px-5 py-6 pb-10 sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Novo Lembrete</DialogTitle>
          <DialogDescription className="text-muted-foreground/70">
            Crie um lembrete com hora e recorrência
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          {/* TITLE */}
          <div className="space-y-3">
            <Input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="O que você quer lembrar?"
              className={inputClass}
              autoFocus
            />
            {attempted && !title.trim() && (
              <p className="text-xs text-muted-foreground">
                Escreva o que você quer lembrar 😉
              </p>
            )}
          </div>

          {/* DATE + TIME */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="date" className="text-xs text-muted-foreground/70">Quando?</Label>
              <Input
                id="date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`${inputClass} ${isDateInPast ? 'border-destructive/50' : ''}`}
              />
              {attempted && !dueDate && (
                <p className="text-xs text-muted-foreground">
                  Preencha a data para não esquecer 😉
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="time" className="text-xs text-muted-foreground/70">Hora</Label>
              <Input
                id="time"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className={`${inputClass} ${isDateInPast ? 'border-destructive/50' : ''}`}
              />
              {attempted && !dueTime && (
                <p className="text-xs text-muted-foreground">
                  Informe o horário para te lembrar na hora certa
                </p>
              )}
            </div>
          </div>

          {isDateInPast && (
            <p className="text-xs text-destructive/80">
              Essa data já passou. Escolhe um horário a partir de agora?
            </p>
          )}

          {/* RECURRENCE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="recurring" className="text-sm text-muted-foreground">Recorrente?</Label>
              <Switch
                id="recurring"
                checked={showRecurrence}
                onCheckedChange={(checked) => {
                  setShowRecurrence(checked);
                  if (!checked) setRecurrenceType('daily');
                }}
              />
            </div>

            <Collapsible open={showRecurrence}>
              <CollapsibleContent className="space-y-5 pt-2">
                <div className="flex flex-wrap gap-2">
                  {recurrenceOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRecurrenceType(opt.value)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm transition-all duration-150
                        ${recurrenceType === opt.value ? selectedSolidClass : unselectedClass}
                      `}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {recurrenceType === 'weekly' && (
                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground/70">Quais dias?</Label>
                    <div className="flex justify-center gap-2">
                      {weekDays.map((day, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => toggleDayOfWeek(index)}
                          className={`
                            w-9 h-9 rounded-full text-xs font-medium transition-all duration-150
                            ${daysOfWeek.includes(index) ? selectedSolidClass : unselectedClass}
                          `}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {recurrenceType === 'interval' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground/70">A cada</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={intervalHoursStr}
                          onChange={(e) => setIntervalHoursStr(e.target.value.replace(/\D/g, ''))}
                          onBlur={() => {
                            const val = parseInt(intervalHoursStr);
                            if (isNaN(val) || val < 1) setIntervalHoursStr('1');
                          }}
                          className={`${inputClass} w-16`}
                        />
                        <span className="text-sm text-muted-foreground">horas</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground/70">Por quantos dias</Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={durationDaysStr}
                        onChange={(e) => {
                          setDurationDaysStr(e.target.value.replace(/\D/g, ''));
                          setLastEdited('duration');
                        }}
                        onBlur={() => {
                          const val = parseInt(durationDaysStr);
                          if (isNaN(val) || val < 1) setDurationDaysStr('1');
                        }}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {showRecurrence && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground/70">Até quando? (opcional)</Label>
                    <Input
                      type="date"
                      value={recurrenceEnd}
                      onChange={(e) => {
                        setRecurrenceEnd(e.target.value);
                        setLastEdited('endDate');
                      }}
                      className={inputClass}
                    />
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* WHATSAPP */}
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <WhatsappLogo weight="thin" className="h-4 w-4 text-primary/70" />
                <Label htmlFor="whatsapp" className="text-sm text-muted-foreground">
                  Notificar por WhatsApp
                </Label>
              </div>
              <Switch
                id="whatsapp"
                checked={sendWhatsapp}
                onCheckedChange={setSendWhatsapp}
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid || addReminder.isPending}
            className="w-full"
          >
            {addReminder.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
