import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useUpdateReminder, type Reminder } from '@/hooks/useReminders';
import { useChildren } from '@/hooks/useChildren';
import { useContacts } from '@/hooks/useContacts';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface EditReminderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder: Reminder | null;
}

export function EditReminderSheet({ open, onOpenChange, reminder }: EditReminderSheetProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [childId, setChildId] = useState<string>('');
  const [contactId, setContactId] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [intervalType, setIntervalType] = useState<string>('days');
  const [intervalValue, setIntervalValue] = useState<number>(1);
  const [effortLevel, setEffortLevel] = useState<number>(1);
  const [isCritical, setIsCritical] = useState(false);

  const { data: children = [] } = useChildren();
  const { data: contacts = [] } = useContacts();
  const updateReminder = useUpdateReminder();

  useEffect(() => {
    if (reminder) {
      const date = new Date(reminder.due_date);
      setTitle(reminder.title);
      setDescription(reminder.description || '');
      setDueDate(format(date, 'yyyy-MM-dd'));
      setDueTime(format(date, 'HH:mm'));
      setChildId(reminder.child_id || '');
      setContactId(reminder.contact_id || '');
      setIsRecurring(reminder.is_recurring || false);
      setIntervalType(reminder.interval_type || 'days');
      setIntervalValue(reminder.interval_value || 1);
      setEffortLevel(reminder.effort_level || 1);
      setIsCritical(reminder.is_critical || false);
    }
  }, [reminder]);

  const handleSubmit = async () => {
    if (!reminder || !title.trim() || !dueDate) return;

    const dueDatetime = new Date(`${dueDate}T${dueTime}:00`);

    try {
      await updateReminder.mutateAsync({
        id: reminder.id,
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDatetime.toISOString(),
        child_id: childId || null,
        contact_id: contactId || null,
        is_recurring: isRecurring,
        interval_type: isRecurring ? intervalType : null,
        interval_value: isRecurring ? intervalValue : null,
        effort_level: effortLevel,
        is_critical: isCritical,
      });
      toast.success('Lembrete atualizado');
      onOpenChange(false);
    } catch {
      toast.error('Erro ao atualizar lembrete');
    }
  };

  const isValid = title.trim() && dueDate;

  // Input style for border-bottom subtle
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

          {/* Vínculos - Grid 2 columns */}
          <div className="space-y-4">
            <h4 className="text-xs text-muted-foreground/50 uppercase tracking-wider">
              Vínculos
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <Select value={childId || "__none__"} onValueChange={(val) => setChildId(val === "__none__" ? "" : val)}>
                <SelectTrigger className="bg-transparent border-0 border-b border-border/30 rounded-none h-10">
                  <SelectValue placeholder="Filho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Opcional</SelectItem>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.nickname || child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={contactId || "__none__"} onValueChange={(val) => setContactId(val === "__none__" ? "" : val)}>
                <SelectTrigger className="bg-transparent border-0 border-b border-border/30 rounded-none h-10">
                  <SelectValue placeholder="Contato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Opcional</SelectItem>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.alias}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recorrência - Collapsible */}
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground/70">A cada</Label>
                    <Input
                      type="number"
                      min={1}
                      value={intervalValue}
                      onChange={(e) => setIntervalValue(parseInt(e.target.value) || 1)}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground/70">Período</Label>
                    <Select value={intervalType} onValueChange={setIntervalType}>
                      <SelectTrigger className="bg-transparent border-0 border-b border-border/30 rounded-none h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Horas</SelectItem>
                        <SelectItem value="days">Dias</SelectItem>
                        <SelectItem value="weeks">Semanas</SelectItem>
                        <SelectItem value="months">Meses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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

            <div className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor="edit-critical" className="text-sm text-muted-foreground">
                  Lembrete crítico
                </Label>
                <p className="text-xs text-muted-foreground/50">A Annia pode me ligar</p>
              </div>
              <Switch
                id="edit-critical"
                checked={isCritical}
                onCheckedChange={setIsCritical}
              />
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
