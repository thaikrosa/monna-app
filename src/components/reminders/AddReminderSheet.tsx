import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddReminder } from '@/hooks/useReminders';
import { useChildren } from '@/hooks/useChildren';
import { useContacts } from '@/hooks/useContacts';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AddReminderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddReminderSheet({ open, onOpenChange }: AddReminderSheetProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueTime, setDueTime] = useState('09:00');
  const [childId, setChildId] = useState<string>('');
  const [contactId, setContactId] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [intervalType, setIntervalType] = useState<string>('days');
  const [intervalValue, setIntervalValue] = useState<number>(1);
  const [effortLevel, setEffortLevel] = useState<number>(1);
  const [isCritical, setIsCritical] = useState(false);

  const { data: children = [] } = useChildren();
  const { data: contacts = [] } = useContacts();
  const addReminder = useAddReminder();

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(format(new Date(), 'yyyy-MM-dd'));
    setDueTime('09:00');
    setChildId('');
    setContactId('');
    setIsRecurring(false);
    setIntervalType('days');
    setIntervalValue(1);
    setEffortLevel(1);
    setIsCritical(false);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !dueDate) return;

    const dueDatetime = new Date(`${dueDate}T${dueTime}:00`);

    try {
      await addReminder.mutateAsync({
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
      toast.success('Lembrete criado');
      resetForm();
      onOpenChange(false);
    } catch {
      toast.error('Erro ao criar lembrete');
    }
  };

  const isValid = title.trim() && dueDate;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Novo Lembrete</SheetTitle>
          <SheetDescription>Organize seu dia com tranquilidade</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Essenciais */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Essenciais
            </h4>

            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Consulta pediatra"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalhes adicionais..."
                className="bg-background/50 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Input
                  id="time"
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
              <Select value={childId} onValueChange={setChildId}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
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
              <Select value={contactId} onValueChange={setContactId}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
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
              <Label htmlFor="recurring">Repetir este lembrete</Label>
              <Switch
                id="recurring"
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
                <Label htmlFor="critical">Lembrete crítico</Label>
                <p className="text-xs text-muted-foreground">A Annia pode me ligar</p>
              </div>
              <Switch
                id="critical"
                checked={isCritical}
                onCheckedChange={setIsCritical}
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid || addReminder.isPending}
            className="w-full"
          >
            {addReminder.isPending ? 'Salvando...' : 'Salvar lembrete'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
