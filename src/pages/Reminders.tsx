import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WeekSelector } from '@/components/reminders/WeekSelector';
import { ReminderCard } from '@/components/reminders/ReminderCard';
import { AddReminderDialog } from '@/components/reminders/AddReminderDialog';
import { EditReminderSheet } from '@/components/reminders/EditReminderSheet';
import { RecurringRemindersSection } from '@/components/reminders/RecurringRemindersSection';
import {
  useRemindersByDate,
  useUpcomingReminders,
  useAcknowledgeOccurrence,
  useSnoozeOccurrence,
  useDeleteReminder,
} from '@/hooks/useReminders';
import { toast } from 'sonner';
import type { UpcomingReminder, Reminder } from '@/types/reminders';
import { format, startOfWeek, addWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Union type para aceitar ambos os tipos no sheet de edição
type EditableReminder = UpcomingReminder | Reminder;

export default function Reminders() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<EditableReminder | null>(null);
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: upcomingReminders = [] } = useUpcomingReminders();
  const { data: selectedDateReminders = [], isLoading } = useRemindersByDate(selectedDate);

  const acknowledgeOccurrence = useAcknowledgeOccurrence();
  const snoozeOccurrence = useSnoozeOccurrence();
  const deleteReminder = useDeleteReminder();

  // Handler para editar UpcomingReminder (ocorrência do dia)
  const handleEdit = (reminder: UpcomingReminder) => {
    setEditingReminder(reminder);
    setIsEditOpen(true);
  };

  // Handler para editar Reminder (template recorrente)
  const handleEditRecurring = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsEditOpen(true);
  };

  const handleComplete = async (occurrenceId: string) => {
    await acknowledgeOccurrence.mutateAsync(occurrenceId);
    toast.success('Lembrete concluído');
  };

  const handleSnooze = async (occurrenceId: string) => {
    await snoozeOccurrence.mutateAsync({ occurrenceId, minutes: 60 });
    toast.success('Lembrete adiado por 1 hora');
  };

  const handleDelete = async (id: string) => {
    await deleteReminder.mutateAsync(id);
    toast.success('Lembrete excluído');
  };

  const handlePrevWeek = () => {
    setWeekStart((prev) => addWeeks(prev, -1));
  };

  const handleNextWeek = () => {
    setWeekStart((prev) => addWeeks(prev, 1));
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const pendingCount = selectedDateReminders.filter((r) => r.occurrence_status === 'pending').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-foreground">
              Lembretes
            </h1>
            <p className="text-sm text-muted-foreground/70 mt-0.5">
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </div>

        {/* Week Selector */}
        <div className="bg-card p-3 rounded-lg border border-border shadow-elevated">
          <WeekSelector
            weekStart={weekStart}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            reminders={upcomingReminders}
          />
        </div>

        {/* Reminders List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : selectedDateReminders.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground/60 text-sm">
                Sua mente está livre para este dia.
              </p>
            </div>
          ) : (
            <>
              {pendingCount > 0 && (
                <p className="text-xs text-muted-foreground/50 uppercase tracking-wider pb-2">
                  {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
                </p>
              )}
              {selectedDateReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.occurrence_id}
                  reminder={reminder}
                  onComplete={handleComplete}
                  onSnooze={handleSnooze}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}
        </div>

        {/* Seção de Lembretes Recorrentes */}
        <RecurringRemindersSection
          onEdit={handleEditRecurring}
          onDelete={handleDelete}
        />
      </div>

      {/* FAB flutuante */}
      <button
        onClick={() => setIsAddOpen(true)}
        aria-label="Adicionar lembrete"
        className="
          fixed bottom-20 right-4 z-40
          floating-button
          shadow-lg
          transition-transform duration-200
          hover:scale-110
          active:scale-95
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
        "
      >
        <Plus weight="regular" className="h-6 w-6" />
      </button>

      {/* Dialogs/Sheets */}
      <AddReminderDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
      <EditReminderSheet
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        reminder={editingReminder}
      />
    </div>
  );
}
