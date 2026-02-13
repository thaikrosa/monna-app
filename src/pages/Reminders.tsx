import { useState, useMemo } from 'react';
import { Plus, CheckCircle } from '@phosphor-icons/react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { DaySelector } from '@/components/reminders/DaySelector';
import { SwipeableReminderCard } from '@/components/reminders/SwipeableReminderCard';
import { AddReminderDialog } from '@/components/reminders/AddReminderDialog';
import { EditReminderSheet } from '@/components/reminders/EditReminderSheet';
import { RecurringRemindersSection } from '@/components/reminders/RecurringRemindersSection';
import {
  useRemindersByDate,
  useAcknowledgeOccurrence,
  useSnoozeOccurrence,
  useDeleteReminder,
} from '@/hooks/useReminders';
import { toast } from 'sonner';
import type { UpcomingReminder, Reminder } from '@/types/reminders';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

type EditableReminder = UpcomingReminder | Reminder;

export default function Reminders() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<EditableReminder | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [justCleared, setJustCleared] = useState(false);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const isToday = isSameDay(selectedDate, today);
  const { data: selectedDateReminders = [], isLoading, isError, refetch } = useRemindersByDate(selectedDate, isToday);

  const acknowledgeOccurrence = useAcknowledgeOccurrence();
  const snoozeOccurrence = useSnoozeOccurrence();
  const deleteReminder = useDeleteReminder();

  const handleEdit = (reminder: UpcomingReminder) => {
    setEditingReminder(reminder);
    setIsEditOpen(true);
  };

  const handleEditRecurring = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsEditOpen(true);
  };

  const handleComplete = async (occurrenceId: string) => {
    await acknowledgeOccurrence.mutateAsync(occurrenceId);
    toast.success('Lembrete concluído');

    // Check if this was the last pending reminder
    const pendingAfter = selectedDateReminders.filter(
      r => r.occurrence_status !== 'acknowledged' && r.occurrence_id !== occurrenceId
    );
    if (pendingAfter.length === 0) {
      setJustCleared(true);
      setTimeout(() => setJustCleared(false), 3000);
    }
  };

  const handleSnooze = async (occurrenceId: string) => {
    await snoozeOccurrence.mutateAsync({ occurrenceId, minutes: 60 });
    toast.success('Lembrete adiado por 1 hora');
  };

  const handleDelete = async (id: string) => {
    await deleteReminder.mutateAsync(id);
    toast.success('Lembrete excluído');
  };

  const pendingCount = selectedDateReminders.filter((r) => r.occurrence_status === 'pending' || r.occurrence_status === 'snoozed').length;

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

        {/* Day Selector (3 days) */}
        <div className="bg-card p-3 rounded-lg border border-border shadow-elevated">
          <DaySelector
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
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
          ) : isError ? (
            <ErrorState
              message="Erro ao carregar lembretes"
              onRetry={() => refetch()}
            />
          ) : selectedDateReminders.length === 0 || (selectedDateReminders.every(r => r.occurrence_status === 'acknowledged') && !justCleared) ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground/60 text-sm">
                Sua mente está livre para este dia.
              </p>
            </div>
          ) : justCleared ? (
            <motion.div 
              className="py-16 text-center flex flex-col items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle weight="thin" className="h-12 w-12 text-primary/60 animate-scale-in" />
              <p className="text-muted-foreground/60 text-sm">Tudo em dia</p>
            </motion.div>
          ) : (
            <>
              {pendingCount > 0 && (
                <p className="text-xs text-muted-foreground/50 uppercase tracking-wider pb-2">
                  {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
                </p>
              )}
              <AnimatePresence>
                {selectedDateReminders.map((reminder) => (
                  <motion.div
                    key={reminder.occurrence_id}
                    layout
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <SwipeableReminderCard
                      reminder={reminder}
                      onComplete={handleComplete}
                      onSnooze={handleSnooze}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
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
