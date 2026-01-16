export type CtaAction = 
  | "create_event"
  | "review_reminders"
  | "open_paywall"
  | "adjust"
  | "dismiss"
  | "create_reminder"
  | "open_child"
  | "open_list"
  | "schedule_shopping"
  | "share_list";

export interface Cta {
  label: string;
  action: CtaAction;
  payload?: Record<string, unknown>;
}

export interface GreetingData {
  title: string;
  insight: string;
  microcopy: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
}

export interface AgendaEvent {
  id: string;
  start_time: string;
  end_time?: string;
  title: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  due_at?: string;
  priority?: "normal" | "important" | "urgent";
  is_overdue?: boolean;
}

export interface UrgentItem {
  id: string;
  title: string;
  days_overdue: number;
}

export interface ShoppingData {
  total_items: number;
  top_items: Array<{ id: string; name: string; qty?: string | null }>;
}

export interface KidAlert {
  id: string;
  child_name: string;
  age_label: string;
  message: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
}

export interface MonnaSuggestion {
  id: string;
  insight: string;
  actions: {
    accept: Record<string, unknown>;
    adjust?: Record<string, unknown>;
    dismiss?: Record<string, unknown>;
  };
}

export interface HomeDashboard {
  profile: {
    first_name?: string;
    nickname?: string | null;
  };
  greeting: GreetingData;
  today: {
    agenda: AgendaEvent[];
    reminders: ReminderItem[];
    urgent_overdue: UrgentItem[];
    shopping: ShoppingData;
    kids: KidAlert[];
    monna_moment: MonnaSuggestion[];
  };
  paywall: {
    is_subscriber: boolean;
  };
}
