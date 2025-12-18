// ===== USER ROUTINES =====
export type RoutineType = 'work' | 'kids' | 'self_care' | 'sleep' | 'commute' | 'other';

export interface UserRoutine {
  id: string;
  user_id: string;
  name: string;
  routine_type: RoutineType;
  days_of_week: number[];  // 0=dom, 1=seg, ..., 6=sab
  start_time: string;      // "08:00"
  end_time: string;        // "18:00"
  is_flexible: boolean | null;
  color: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserRoutineInsert {
  name: string;
  routine_type: RoutineType;
  days_of_week: number[];
  start_time: string;
  end_time: string;
  is_flexible?: boolean;
  color?: string;
}

// ===== ONBOARDING PROGRESS =====
export interface OnboardingProgress {
  id: string;
  user_id: string;
  step_welcome: boolean | null;
  step_routines: boolean | null;
  step_calendar: boolean | null;
  step_children: boolean | null;
  step_feelings: boolean | null;
  step_desires: boolean | null;
  step_support_areas: boolean | null;
  kickstart_completed_at: string | null;
  last_prompt_shown_at: string | null;
  prompts_dismissed: number | null;
  created_at: string | null;
  updated_at: string | null;
}

// ===== PROFILE UPDATE =====
export interface ProfileUpdate {
  first_name?: string;
  last_name?: string;
  nickname?: string;
  avatar_url?: string;
  whatsapp?: string;
  city?: string;
  state?: string;
  timezone?: string;
  communication_style?: 'caring' | 'direct' | 'playful';
  onboarding_completed?: boolean;
  onboarding_completed_at?: string;
}

// ===== CONSTANTES DE UI =====
export const ROUTINE_ICONS: Record<RoutineType, string> = {
  work: 'Briefcase',
  kids: 'Baby',
  self_care: 'Heartbeat',
  sleep: 'Moon',
  commute: 'Car',
  other: 'DotsThree',
};

export const ROUTINE_LABELS: Record<RoutineType, string> = {
  work: 'Trabalho',
  kids: 'Filhos',
  self_care: 'Autocuidado',
  sleep: 'Descanso',
  commute: 'Deslocamento',
  other: 'Outro',
};

export const ROUTINE_COLORS: Record<RoutineType, string> = {
  work: '#6B7C3A',
  kids: '#C4754B',
  self_care: '#8B5CF6',
  sleep: '#3B82F6',
  commute: '#F59E0B',
  other: '#6B7280',
};
