import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WeekSelector } from '@/components/reminders/WeekSelector';
import { ReminderCard } from '@/components/reminders/ReminderCard';
import { AddReminderSheet } from '@/components/reminders/AddReminderSheet';
import { EditReminderSheet } from '@/components/reminders/EditReminderSheet';
import {
  useRemindersByDate,
  useUpcomingReminders,
  useAcknowledgeOccurrence,
  useDeleteReminder,
} from '@/hooks/useReminders';
import type { UpcomingReminder } from '@/types/reminders';
import { format, startOfWeek, addWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Reminders() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<UpcomingReminder | null>(null);
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: upcomingReminders = [] } = useUpcomingReminders();
  const { data: selectedDateReminders = [], isLoading } = useRemindersByDate(selectedDate);

  const acknowledgeOccurrence = useAcknowledgeOccurrence();
  const deleteReminder = useDeleteReminder();

  const handleEdit = (reminder: UpcomingReminder) => {
    setEditingReminder(reminder);
    setIsEditOpen(true);
  };

  const handleComplete = async (occurrenceId: string) => {
    await acknowledgeOccurrence.mutateAsync(occurrenceId);
  };

  const handleDelete = async (id: string) => {
    await deleteReminder.mutateAsync(id);
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
      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAddOpen(true)}
            className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-transparent"
          >
            <Plus weight="thin" className="h-6 w-6" />
          </Button>
        </div>

        {/* Week Selector */}
        <div className="annia-glass p-3 rounded-lg border border-border/30">
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
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Sheets */}
      <AddReminderSheet open={isAddOpen} onOpenChange={setIsAddOpen} />
      <EditReminderSheet
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        reminder={editingReminder}
      />
    </div>
  );
}
