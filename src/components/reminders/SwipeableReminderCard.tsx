import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { PencilSimple, Clock, Check } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import type { UpcomingReminder } from '@/types/reminders';
import { ReminderCard } from './ReminderCard';

interface SwipeableReminderCardProps {
  reminder: UpcomingReminder;
  onComplete: (occurrenceId: string) => void;
  onSnooze: (occurrenceId: string) => void;
  onEdit: (reminder: UpcomingReminder) => void;
  onDelete: (id: string) => void;
}

const COMPLETE_THRESHOLD = 80;
const ACTIONS_THRESHOLD = -60;

export function SwipeableReminderCard({ reminder, onComplete, onSnooze, onEdit, onDelete }: SwipeableReminderCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [completing, setCompleting] = useState(false);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const isCompleted = reminder.occurrence_status === 'acknowledged';

  // Right swipe: green check background
  const rightBgOpacity = useTransform(x, [0, COMPLETE_THRESHOLD], [0, 1]);
  
  const handleDragEnd = async (_: any, info: PanInfo) => {
    const offset = info.offset.x;

    if (offset > COMPLETE_THRESHOLD && !isCompleted) {
      // Swipe right → complete
      setCompleting(true);
      await controls.start({ x: 300, opacity: 0, transition: { duration: 0.15 } });
      onComplete(reminder.occurrence_id);
    } else if (offset < ACTIONS_THRESHOLD) {
      // Swipe left → show actions
      setShowActions(true);
      await controls.start({ x: -120, transition: { duration: 0.15 } });
    } else {
      // Reset
      setShowActions(false);
      await controls.start({ x: 0, transition: { duration: 0.15 } });
    }
  };

  const handleCloseActions = async () => {
    setShowActions(false);
    await controls.start({ x: 0, transition: { duration: 0.15 } });
  };

  if (completing) {
    return (
      <motion.div
        initial={{ height: 'auto', opacity: 0 }}
        animate={{ height: 0, marginBottom: 0 }}
        transition={{ duration: 0.15, delay: 0.05 }}
        className="overflow-hidden"
      />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Right swipe background (complete) */}
      <motion.div 
        className="absolute inset-0 bg-primary/20 rounded-lg flex items-center pl-4"
        style={{ opacity: rightBgOpacity }}
      >
        <Check weight="bold" className="h-5 w-5 text-primary" />
      </motion.div>

      {/* Left swipe actions panel */}
      <div className="absolute right-0 inset-y-0 w-[120px] flex items-center justify-end gap-1 pr-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            onEdit(reminder);
            handleCloseActions();
          }}
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <PencilSimple weight="thin" className="h-4 w-4" />
        </Button>
        {!isCompleted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onSnooze(reminder.occurrence_id);
              handleCloseActions();
            }}
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            title="Adiar 1h"
          >
            <Clock weight="thin" className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Swipeable card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: isCompleted ? 0 : 120 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="relative z-10 touch-pan-y"
      >
        <ReminderCard
          reminder={reminder}
          onComplete={onComplete}
          onSnooze={onSnooze}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </motion.div>
    </div>
  );
}
