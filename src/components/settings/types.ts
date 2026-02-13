export interface SettingsState {
  checkin_morning_enabled: boolean;
  checkin_morning_time: string;
  checkin_evening_enabled: boolean;
  checkin_evening_time: string;
  proactive_suggestions_enabled: boolean;
  inventory_alerts_enabled: boolean;
  communication_style: string;
}

export const defaultSettings: SettingsState = {
  checkin_morning_enabled: false,
  checkin_morning_time: '08:00',
  checkin_evening_enabled: false,
  checkin_evening_time: '21:00',
  proactive_suggestions_enabled: false,
  inventory_alerts_enabled: false,
  communication_style: 'caring',
};

export const MORNING_OPTIONS = ['07:00', '08:00', '09:00'];
export const EVENING_OPTIONS = ['19:00', '20:00', '21:00'];

/** Normalize time format from Supabase (HH:mm:ss) to HH:mm */
export function normalizeTime(time: string | null | undefined, defaultValue: string): string {
  if (!time) return defaultValue;
  const parts = time.split(':');
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return defaultValue;
}

/** Format time for PostgreSQL (add seconds) */
export function formatTimeForDb(time: string): string {
  if (time.includes(':')) {
    return time.split(':').length === 2 ? `${time}:00` : time;
  }
  return `${time}:00`;
}
