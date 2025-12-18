import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Lembrete</SheetTitle>
          <SheetDescription>Atualize os detalhes do lembrete</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Essenciais */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Essenciais
            </h4>

            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Consulta pediatra"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalhes adicionais..."
                className="bg-background/50 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Data</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">Hora</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </div>
          </div>

          {/* Vínculos */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Vínculos (opcional)
            </h4>

            <div className="space-y-2">
              <Label>Filho</Label>
              <Select value={childId || "__none__"} onValueChange={(val) => setChildId(val === "__none__" ? "" : val)}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Nenhum</SelectItem>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.nickname || child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Contato</Label>
              <Select value={contactId || "__none__"} onValueChange={(val) => setContactId(val === "__none__" ? "" : val)}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Nenhum</SelectItem>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.alias}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recorrência */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recorrência
            </h4>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-recurring">Repetir este lembrete</Label>
              <Switch
                id="edit-recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </div>

            {isRecurring && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>A cada</Label>
                  <Input
                    type="number"
                    min={1}
                    value={intervalValue}
                    onChange={(e) => setIntervalValue(parseInt(e.target.value) || 1)}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Período</Label>
                  <Select value={intervalType} onValueChange={setIntervalType}>
                    <SelectTrigger className="bg-background/50">
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
            )}
          </div>

          {/* Configurações */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Configurações
            </h4>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Nível de esforço (uso interno)
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setEffortLevel(level)}
                    className={`
                      w-8 h-8 rounded-full text-xs font-medium
                      transition-all duration-150
                      ${effortLevel === level
                        ? 'bg-primary/30 text-primary border border-primary/50'
                        : 'bg-background/50 text-muted-foreground border border-border/30 hover:border-primary/30'
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="edit-critical">Lembrete crítico</Label>
                <p className="text-xs text-muted-foreground">A Annia pode me ligar</p>
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
            className="w-full"
          >
            {updateReminder.isPending ? 'Salvando...' : 'Atualizar lembrete'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
