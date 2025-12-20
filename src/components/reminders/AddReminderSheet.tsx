import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAddReminder } from '@/hooks/useReminders';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Heart, 
  GraduationCap, 
  House, 
  Briefcase, 
  User, 
  UsersThree, 
  Bank, 
  DotsThree,
  CaretDown,
  Phone,
  WhatsappLogo
} from '@phosphor-icons/react';
import type { ReminderCategory, ReminderPriority, RecurrenceType } from '@/types/reminders';

interface AddReminderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryIcons: Record<ReminderCategory, React.ElementType> = {
  health: Heart,
  school: GraduationCap,
  home: House,
  work: Briefcase,
  personal: User,
  family: UsersThree,
  finance: Bank,
  other: DotsThree,
};

const categoryLabels: Record<ReminderCategory, string> = {
  health: 'Saúde',
  school: 'Escola',
  home: 'Casa',
  work: 'Trabalho',
  personal: 'Pessoal',
  family: 'Família',
  finance: 'Finanças',
  other: 'Outros',
};

const recurrenceOptions: { value: RecurrenceType; label: string }[] = [
  { value: 'once', label: 'Uma vez' },
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
  { value: 'interval', label: 'Intervalo' },
];

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export function AddReminderSheet({ open, onOpenChange }: AddReminderSheetProps) {
  // Etapa 1 - Essenciais
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueTime, setDueTime] = useState('09:00');

  // Etapa 2 - Recorrência
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('once');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [intervalHours, setIntervalHours] = useState<number>(24);
  const [durationDays, setDurationDays] = useState<number>(7);
  const [recurrenceEnd, setRecurrenceEnd] = useState('');

  // Etapa 3 - Mais opções
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [category, setCategory] = useState<ReminderCategory>('other');
  const [priority, setPriority] = useState<ReminderPriority>('normal');
  const [effortLevel, setEffortLevel] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [sendWhatsapp, setSendWhatsapp] = useState(true);
  const [callGuarantee, setCallGuarantee] = useState(false);

  const addReminder = useAddReminder();

  const resetForm = () => {
    setTitle('');
    setDueDate(format(new Date(), 'yyyy-MM-dd'));
    setDueTime('09:00');
    setShowRecurrence(false);
    setRecurrenceType('once');
    setDaysOfWeek([]);
    setIntervalHours(24);
    setDurationDays(7);
    setRecurrenceEnd('');
    setShowMoreOptions(false);
    setCategory('other');
    setPriority('normal');
    setEffortLevel(1);
    setDescription('');
    setSendWhatsapp(true);
    setCallGuarantee(false);
  };

  const toggleDayOfWeek = (day: number) => {
    setDaysOfWeek(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day].sort()
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || !dueDate) return;

    const datetime = new Date(`${dueDate}T${dueTime}:00`);

    // Validar se a data não é no passado
    if (datetime < new Date()) {
      toast.error('Ops, esse horário já passou. Vamos agendar pra quando?');
      return;
    }

    // Montar recurrence_config baseado no tipo
    let recurrence_config: Record<string, unknown> | null = null;
    
    if (recurrenceType === 'weekly' && daysOfWeek.length > 0) {
      recurrence_config = { days_of_week: daysOfWeek };
    } else if (recurrenceType === 'interval') {
      recurrence_config = { 
        interval_hours: intervalHours, 
        duration_days: durationDays 
      };
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      datetime: datetime.toISOString(),
      category,
      priority,
      recurrence_type: showRecurrence ? recurrenceType : 'once',
      recurrence_config,
      recurrence_end: recurrenceEnd || null,
      effort_level: effortLevel,
      call_guarantee: callGuarantee,
      send_whatsapp: sendWhatsapp,
    };

    console.log('[DEBUG] Creating reminder with payload:', payload);

    try {
      await addReminder.mutateAsync(payload);
      toast.success('Lembrete criado');
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('[DEBUG] Error creating reminder:', error);
      toast.error('Erro ao criar lembrete');
    }
  };

  // Verificar se a data/hora selecionada está no passado
  const selectedDateTime = new Date(`${dueDate}T${dueTime}:00`);
  const isDateInPast = selectedDateTime < new Date();
  const isValid = title.trim() && dueDate && !isDateInPast;

  const inputClass = "bg-transparent border-0 border-b border-border/30 rounded-none focus:border-primary/50 focus:ring-0 transition-colors duration-150 placeholder:text-muted-foreground/40";

  // Classes de seleção
  const selectedClass = "bg-primary/20 text-primary";
  const selectedSolidClass = "bg-primary text-primary-foreground"; // Para botões pequenos (pills, dias)
  const urgentSelectedClass = "bg-destructive/20 text-destructive";
  const unselectedClass = "bg-muted/20 text-muted-foreground hover:bg-muted/40";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto px-5 py-6">
        <SheetHeader>
          <SheetTitle className="text-lg font-medium">Novo Lembrete</SheetTitle>
          <SheetDescription className="text-muted-foreground/70">
            Organize sua mente
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* ═══════════════════════════════════════════════════════════════
              ETAPA 1 - ESSENCIAIS (sempre visível)
          ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-xs text-muted-foreground/70">
                O que você quer lembrar?
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Consulta pediatra"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="date" className="text-xs text-muted-foreground/70">
                  Quando?
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`${inputClass} ${isDateInPast ? 'border-[#C4754B]/50' : ''}`}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="time" className="text-xs text-muted-foreground/70">
                  Hora
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className={`${inputClass} ${isDateInPast ? 'border-[#C4754B]/50' : ''}`}
                />
              </div>
            </div>
            
            {/* Mensagem de erro inline para data passada */}
            {isDateInPast && (
              <p className="text-xs text-destructive/80 mt-2">
                Essa data já passou. Escolhe um horário a partir de agora?
              </p>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              ETAPA 2 - REPETIR? (toggle + opções)
          ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="recurring" className="text-sm text-muted-foreground">
                Repetir?
              </Label>
              <Switch
                id="recurring"
                checked={showRecurrence}
                onCheckedChange={(checked) => {
                  setShowRecurrence(checked);
                  if (!checked) setRecurrenceType('once');
                }}
              />
            </div>

            <Collapsible open={showRecurrence}>
              <CollapsibleContent className="space-y-5 pt-2">
                {/* Seletor visual de frequência */}
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

                {/* Seletor de dias da semana (para weekly) */}
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

                {/* Campos para interval */}
                {recurrenceType === 'interval' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground/70">A cada</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          value={intervalHours}
                          onChange={(e) => setIntervalHours(parseInt(e.target.value) || 1)}
                          className={`${inputClass} w-16`}
                        />
                        <span className="text-sm text-muted-foreground">horas</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground/70">Por quantos dias</Label>
                      <Input
                        type="number"
                        min={1}
                        value={durationDays}
                        onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {/* Até quando? (para recorrentes) */}
                {recurrenceType !== 'once' && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground/70">Até quando? (opcional)</Label>
                    <Input
                      type="date"
                      value={recurrenceEnd}
                      onChange={(e) => setRecurrenceEnd(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              ETAPA 3 - NOTIFICAÇÕES (sempre visível)
          ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3 py-2">
            {/* WhatsApp toggle */}
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

            {/* Call Guarantee */}
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="flex items-center gap-2">
                  <Phone weight="thin" className="h-4 w-4 text-primary/70" />
                  <Label htmlFor="call" className="text-sm text-muted-foreground">
                    Garantir com ligação
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground/50 mt-1 ml-6">
                  Vou te ligar para garantir que não esqueça
                </p>
              </div>
              <Switch
                id="call"
                checked={callGuarantee}
                onCheckedChange={setCallGuarantee}
              />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              ETAPA 4 - MAIS OPÇÕES (colapsável)
          ═══════════════════════════════════════════════════════════════ */}
          <Collapsible open={showMoreOptions} onOpenChange={setShowMoreOptions}>
            <CollapsibleTrigger asChild>
              <button 
                type="button"
                className="flex items-center gap-2 text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-150"
              >
                <CaretDown 
                  weight="thin" 
                  className={`h-4 w-4 transition-transform duration-150 ${showMoreOptions ? 'rotate-180' : ''}`} 
                />
                Mais opções
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 pt-6">
              {/* Categoria com ícones */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground/70">Categoria</Label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(categoryIcons) as ReminderCategory[]).map((cat) => {
                    const Icon = categoryIcons[cat];
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`
                          flex flex-col items-center gap-1.5 p-3 rounded-lg
                          transition-all duration-150
                          ${category === cat ? selectedClass : unselectedClass}
                        `}
                      >
                        <Icon weight="thin" className="h-5 w-5" />
                        <span className="text-[10px]">{categoryLabels[cat]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prioridade */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground/70">Prioridade</Label>
                <div className="flex gap-2">
                  {(['normal', 'important', 'urgent'] as ReminderPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`
                        flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-150
                        ${priority === p
                          ? p === 'urgent' ? urgentSelectedClass : selectedClass
                          : unselectedClass
                        }
                      `}
                    >
                      {p === 'normal' ? 'Normal' : p === 'important' ? 'Importante' : 'Urgente'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Esforço */}
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground/70">Nível de esforço</Label>
                <div className="flex gap-3 justify-center py-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setEffortLevel(level)}
                      className={`
                        w-3 h-3 rounded-full transition-all duration-150
                        ${effortLevel >= level 
                          ? 'bg-primary scale-110' 
                          : 'bg-muted-foreground/20 hover:bg-muted-foreground/40'}
                      `}
                    />
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-xs text-muted-foreground/70">
                  Detalhes (opcional)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notas adicionais..."
                  className={`${inputClass} min-h-[60px] resize-none`}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!isValid || addReminder.isPending}
            className="w-full mt-4"
          >
            {addReminder.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
