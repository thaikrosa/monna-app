import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useUpdateReminder, useReminder } from '@/hooks/useReminders';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { UpcomingReminder, ReminderCategory, ReminderPriority, RecurrenceType } from '@/types/reminders';

interface EditReminderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder: UpcomingReminder | null;
}

export function EditReminderSheet({ open, onOpenChange, reminder }: EditReminderSheetProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [category, setCategory] = useState<ReminderCategory>('other');
  const [priority, setPriority] = useState<ReminderPriority>('normal');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('daily');
  const [intervalValue, setIntervalValue] = useState<number>(1);
  const [effortLevel, setEffortLevel] = useState<number>(1);

  // Fetch full reminder details
  const { data: reminderData } = useReminder(reminder?.id);
  const updateReminder = useUpdateReminder();

  useEffect(() => {
    if (reminder) {
      const date = new Date(reminder.scheduled_at);
      setTitle(reminder.title);
      setDescription(reminder.description || '');
      setDueDate(format(date, 'yyyy-MM-dd'));
      setDueTime(format(date, 'HH:mm'));
      setCategory(reminder.category);
      setPriority(reminder.priority);
    }
  }, [reminder]);

  // Load full reminder data when available
  useEffect(() => {
    if (reminderData?.reminder) {
      const r = reminderData.reminder;
      setIsRecurring(r.recurrence_type !== 'once');
      setRecurrenceType(r.recurrence_type === 'once' ? 'daily' : r.recurrence_type);
      setEffortLevel(r.effort_level || 1);
      if (r.recurrence_config && typeof r.recurrence_config === 'object') {
        const config = r.recurrence_config as Record<string, unknown>;
        if (config.interval_value) {
          setIntervalValue(config.interval_value as number);
        }
      }
    }
  }, [reminderData]);

  const handleSubmit = async () => {
    if (!reminder || !title.trim() || !dueDate) return;

    const datetime = new Date(`${dueDate}T${dueTime}:00`);

    // Capitalizar primeira letra do título
    const trimmedTitle = title.trim();
    const capitalizedTitle = trimmedTitle.charAt(0).toUpperCase() + trimmedTitle.slice(1);

    try {
      await updateReminder.mutateAsync({
        id: reminder.id,
        title: capitalizedTitle,
        description: description.trim() || null,
        datetime: datetime.toISOString(),
        category,
        priority,
        recurrence_type: isRecurring ? recurrenceType : 'once',
        recurrence_config: isRecurring && recurrenceType === 'interval' 
          ? { interval_value: intervalValue } 
          : null,
        effort_level: effortLevel,
        call_guarantee: false,
      });
      toast.success('Lembrete atualizado');
      onOpenChange(false);
    } catch {
      toast.error('Erro ao atualizar lembrete');
    }
  };

  const isValid = title.trim() && dueDate;

  const inputClass = "bg-transparent border-0 border-b border-border/30 rounded-none focus:border-primary/50 focus:ring-0 transition-colors duration-150 placeholder:text-muted-foreground/40";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto px-5 py-6">
        <SheetHeader>
          <SheetTitle className="text-lg font-medium">Editar Lembrete</SheetTitle>
          <SheetDescription className="text-muted-foreground/70">
            Atualize os detalhes
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Essenciais */}
          <div className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="edit-title" className="text-xs text-muted-foreground/70">
                O que precisa lembrar?
              </Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Consulta pediatra"
                className={inputClass}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-description" className="text-xs text-muted-foreground/70">
                Detalhes (opcional)
              </Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Notas adicionais..."
                className={`${inputClass} min-h-[60px] resize-none`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="edit-date" className="text-xs text-muted-foreground/70">
                  Quando?
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="edit-time" className="text-xs text-muted-foreground/70">
                  Hora
                </Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Classificação */}
          <div className="space-y-4">
            <h4 className="text-xs text-muted-foreground/50 uppercase tracking-wider">
              Classificação
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground/70">Categoria</Label>
                <Select value={category} onValueChange={(val) => setCategory(val as ReminderCategory)}>
                  <SelectTrigger className="bg-transparent border-0 border-b border-border/30 rounded-none h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Saúde</SelectItem>
                    <SelectItem value="school">Escola</SelectItem>
                    <SelectItem value="home">Casa</SelectItem>
                    <SelectItem value="work">Trabalho</SelectItem>
                    <SelectItem value="personal">Pessoal</SelectItem>
                    <SelectItem value="family">Família</SelectItem>
                    <SelectItem value="finance">Finanças</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground/70">Prioridade</Label>
                <Select value={priority} onValueChange={(val) => setPriority(val as ReminderPriority)}>
                  <SelectTrigger className="bg-transparent border-0 border-b border-border/30 rounded-none h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="important">Importante</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Recorrência */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="edit-recurring" className="text-sm text-muted-foreground">
                Repetir lembrete
              </Label>
              <Switch
                id="edit-recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </div>

            <Collapsible open={isRecurring}>
              <CollapsibleContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground/70">Frequência</Label>
                  <Select value={recurrenceType} onValueChange={(val) => setRecurrenceType(val as RecurrenceType)}>
                    <SelectTrigger className="bg-transparent border-0 border-b border-border/30 rounded-none h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diariamente</SelectItem>
                      <SelectItem value="weekly">Semanalmente</SelectItem>
                      <SelectItem value="monthly">Mensalmente</SelectItem>
                      <SelectItem value="yearly">Anualmente</SelectItem>
                      <SelectItem value="interval">Intervalo personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {recurrenceType === 'interval' && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground/70">A cada X dias</Label>
                    <Input
                      type="number"
                      min={1}
                      value={intervalValue}
                      onChange={(e) => setIntervalValue(parseInt(e.target.value) || 1)}
                      className={inputClass}
                    />
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Configurações */}
          <div className="space-y-5">
            <h4 className="text-xs text-muted-foreground/50 uppercase tracking-wider">
              Configurações
            </h4>

            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground/70">
                Esforço
              </Label>
              <div className="flex gap-3 justify-center py-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setEffortLevel(level)}
                    className={`
                      w-3 h-3 rounded-full transition-all duration-150
                      ${effortLevel === level 
                        ? 'bg-primary scale-125' 
                        : 'bg-muted-foreground/20 hover:bg-muted-foreground/40'}
                    `}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid || updateReminder.isPending}
            className="w-full mt-4"
          >
            {updateReminder.isPending ? 'Salvando...' : 'Atualizar'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
