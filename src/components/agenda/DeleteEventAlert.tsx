import { useState } from 'react';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@phosphor-icons/react';
import { useDeleteCalendarEvent } from '@/hooks/useDeleteCalendarEvent';
import { toast } from 'sonner';

interface DeleteEventAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  instanceId: string;
  isRecurring: boolean;
  title: string;
  onDeleted: () => void;
}

export function DeleteEventAlert({
  open, onOpenChange, eventId, instanceId, isRecurring, title, onDeleted,
}: DeleteEventAlertProps) {
  const deleteEvent = useDeleteCalendarEvent();
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);

  const handleDelete = async (deleteSeries: boolean) => {
    try {
      await deleteEvent.mutateAsync({
        event_id: eventId,
        instance_id: !deleteSeries && isRecurring ? instanceId : undefined,
        delete_series: deleteSeries,
      });
      toast.success(deleteSeries ? 'Série excluída' : 'Evento excluído');
      onOpenChange(false);
      setShowRecurringOptions(false);
      onDeleted();
    } catch {
      toast.error('Erro ao excluir evento. Tente novamente.');
    }
  };

  const handleConfirm = () => {
    if (isRecurring && !showRecurringOptions) {
      setShowRecurringOptions(true);
      return;
    }
    handleDelete(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setShowRecurringOptions(false); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir evento</AlertDialogTitle>
          <AlertDialogDescription>
            {showRecurringOptions
              ? `"${title}" é um evento recorrente. O que deseja excluir?`
              : `Tem certeza que deseja excluir "${title}"?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={showRecurringOptions ? 'flex-col gap-2 sm:flex-col' : ''}>
          {showRecurringOptions ? (
            <>
              <Button
                variant="destructive"
                onClick={() => handleDelete(false)}
                disabled={deleteEvent.isPending}
                className="w-full"
              >
                {deleteEvent.isPending ? <Spinner weight="regular" className="h-4 w-4 animate-spin" /> : 'Excluir apenas este'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(true)}
                disabled={deleteEvent.isPending}
                className="w-full"
              >
                {deleteEvent.isPending ? <Spinner weight="regular" className="h-4 w-4 animate-spin" /> : 'Excluir toda a série'}
              </Button>
              <AlertDialogCancel className="w-full" disabled={deleteEvent.isPending}>Cancelar</AlertDialogCancel>
            </>
          ) : (
            <>
              <AlertDialogCancel disabled={deleteEvent.isPending}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => { e.preventDefault(); handleConfirm(); }}
                disabled={deleteEvent.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteEvent.isPending ? (
                  <><Spinner weight="regular" className="h-4 w-4 animate-spin" /> Excluindo...</>
                ) : 'Excluir'}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
