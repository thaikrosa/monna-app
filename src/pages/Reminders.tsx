import { useState } from 'react';
import { Plus, Bell } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WeekSelector } from '@/components/reminders/WeekSelector';
import { ReminderCard } from '@/components/reminders/ReminderCard';
import { AddReminderSheet } from '@/components/reminders/AddReminderSheet';
import { EditReminderSheet } from '@/components/reminders/EditReminderSheet';
import {
  useTodayReminders,
  useWeekReminders,
  useRemindersByDate,
  useCompleteReminder,
  useDeleteReminder,
  type Reminder,
} from '@/hooks/useReminders';
import { format, startOfWeek, addWeeks, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Reminders() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: todayReminders = [], isLoading: isTodayLoading } = useTodayReminders();
  const { data: weekReminders = [] } = useWeekReminders(weekStart);
  const { data: selectedDateReminders = [], isLoading: isSelectedLoading } = useRemindersByDate(selectedDate);

  const completeReminder = useCompleteReminder();
  const deleteReminder = useDeleteReminder();

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsEditOpen(true);
  };

  const handleComplete = async (id: string) => {
    await completeReminder.mutateAsync(id);
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

  const isSelectedToday = isToday(selectedDate);
  const remindersToShow = isSelectedToday ? todayReminders : selectedDateReminders;
  const isLoading = isSelectedToday ? isTodayLoading : isSelectedLoading;

  const pendingToday = todayReminders.filter((r) => r.status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Central de Lembretes
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {pendingToday.length === 0
                ? 'Sua mente está livre'
                : `${pendingToday.length} lembrete${pendingToday.length > 1 ? 's' : ''} hoje`}
            </p>
          </div>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="gap-2"
          >
            <Plus weight="bold" className="h-4 w-4" />
            Novo lembrete
          </Button>
        </div>

        {/* Seção HOJE */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Hoje
          </h2>

          {isTodayLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          ) : todayReminders.length === 0 ? (
            <div className="annia-glass p-8 rounded-lg border border-border/30 text-center">
              <Bell weight="thin" className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Sua mente está livre. Aproveite o agora.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onComplete={handleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        {/* Seção SEMANA */}
        <section className="space-y-4">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Semana
          </h2>

          <div className="annia-glass p-4 rounded-lg border border-border/30">
            <WeekSelector
              weekStart={weekStart}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              reminders={weekReminders}
            />
          </div>

          {!isSelectedToday && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </h3>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                  ))}
                </div>
              ) : remindersToShow.length === 0 ? (
                <div className="annia-glass p-6 rounded-lg border border-border/30 text-center">
                  <p className="text-muted-foreground text-sm">
                    Sua mente está livre para este dia.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {remindersToShow.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onComplete={handleComplete}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
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
