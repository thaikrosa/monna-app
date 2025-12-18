// ===== ENUMS (batem com o banco Supabase) =====

export type RecurrenceType = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'interval';

export type ReminderCategory = 'health' | 'school' | 'home' | 'work' | 'personal' | 'family' | 'finance' | 'other';

export type ReminderPriority = 'normal' | 'important' | 'urgent';

export type ReminderSource = 'whatsapp_audio' | 'whatsapp_text' | 'webapp' | 'ai_suggestion';

export type ReminderStatus = 'active' | 'paused' | 'completed' | 'cancelled';

export type OccurrenceStatus = 'pending' | 'notified' | 'acknowledged' | 'snoozed' | 'missed' | 'skipped';

// ===== TABELA: reminders =====

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  datetime: string;
  timezone: string;
  recurrence_type: RecurrenceType;
  recurrence_config: Record<string, unknown> | null;
  recurrence_end: string | null;
  priority: ReminderPriority;
  category: ReminderCategory;
  notify_minutes_before: number;
  send_whatsapp: boolean;
  call_guarantee: boolean;
  source: ReminderSource;
  suggested_by_ai: boolean;
  effort_level: number;
  status: ReminderStatus;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ReminderInsert {
  title: string;
  datetime: string;
  description?: string | null;
  timezone?: string;
  recurrence_type?: RecurrenceType;
  recurrence_config?: Record<string, unknown> | null;
  recurrence_end?: string | null;
  priority?: ReminderPriority;
  category?: ReminderCategory;
  notify_minutes_before?: number;
  send_whatsapp?: boolean;
  call_guarantee?: boolean;
  effort_level?: number;
  metadata?: Record<string, unknown> | null;
}

export interface ReminderUpdate {
  title?: string;
  datetime?: string;
  description?: string | null;
  timezone?: string;
  recurrence_type?: RecurrenceType;
  recurrence_config?: Record<string, unknown> | null;
  recurrence_end?: string | null;
  priority?: ReminderPriority;
  category?: ReminderCategory;
  notify_minutes_before?: number;
  send_whatsapp?: boolean;
  call_guarantee?: boolean;
  effort_level?: number;
  status?: ReminderStatus;
  metadata?: Record<string, unknown> | null;
}

// ===== TABELA: reminder_occurrences =====

export interface ReminderOccurrence {
  id: string;
  reminder_id: string;
  scheduled_at: string;
  status: OccurrenceStatus;
  notification_sent_at: string | null;
  acknowledged_at: string | null;
  snoozed_until: string | null;
  snooze_count: number;
  call_attempts: number;
  call_answered: boolean | null;
  last_call_at: string | null;
  response_text: string | null;
  created_at: string;
  updated_at: string;
}

// ===== VIEWS =====

export interface TodayReminder {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  occurrence_id: string;
  scheduled_at: string;
  occurrence_status: OccurrenceStatus;
  call_guarantee: boolean;
  priority: ReminderPriority;
  category: ReminderCategory;
}

export interface UpcomingReminder {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  occurrence_id: string;
  scheduled_at: string;
  occurrence_status: OccurrenceStatus;
  call_guarantee: boolean;
  priority: ReminderPriority;
  category: ReminderCategory;
}
