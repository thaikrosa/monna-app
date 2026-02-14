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

  const { todayList, overdueList } = useMemo(() => {
    if (!isToday) return { todayList: selectedDateReminders, overdueList: [] as UpcomingReminder[] };

    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);

    return {
      todayList: selectedDateReminders.filter(r => new Date(r.scheduled_at) >= dayStart),
      overdueList: selectedDateReminders.filter(r => new Date(r.scheduled_at) < dayStart),
    };
  }, [selectedDateReminders, isToday, selectedDate]);

  const pendingCount = todayList.filter((r) => r.occurrence_status === 'pending' || r.occurrence_status === 'snoozed').length;

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-6">
      {/* Header — DaySelector (espelho da StripCalendar da Agenda) */}
      <header className="animate-slide-up stagger-1">
        <h1 className="sr-only">Lembretes</h1>
        <div className="bg-card p-3 rounded-lg border border-border shadow-elevated">
          <DaySelector
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
      </header>

      <div className="animate-slide-up stagger-2">
        <p className="text-sm text-primary/80 capitalize">
          {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {/* Reminders List */}
      <section aria-label="Lista de lembretes" className="animate-slide-up stagger-3 space-y-3">
          {isLoading ? (
            <div className="space-y-3" aria-busy="true">
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
            // Simple CSS animation - no need for framer-motion here
            <div className="py-16 text-center flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
              <CheckCircle weight="thin" className="h-12 w-12 text-primary/60" />
              <p className="text-muted-foreground/60 text-sm">Tudo em dia</p>
            </div>
          ) : (
            <>
              {pendingCount > 0 && (
                <p className="text-xs text-muted-foreground/50 uppercase tracking-wider pb-2">
                  {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
                </p>
              )}
              <AnimatePresence>
                <ul className="space-y-3">
                  {todayList.map((reminder) => (
                    <motion.li
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
                    </motion.li>
                  ))}
                </ul>
              </AnimatePresence>

              {overdueList.length > 0 && (
                <>
                  <p className="text-xs text-muted-foreground/50 uppercase tracking-wider pt-4 pb-2">
                    Atrasados
                  </p>
                  <AnimatePresence>
                    <ul className="space-y-3">
                      {overdueList.map((reminder) => (
                        <motion.li
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
                        </motion.li>
                      ))}
                    </ul>
                  </AnimatePresence>
                </>
              )}
            </>
          )}
        </section>

        {/* Seção de Lembretes Recorrentes */}
        <RecurringRemindersSection
          onEdit={handleEditRecurring}
          onDelete={handleDelete}
        />

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
