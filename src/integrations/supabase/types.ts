export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_suggestions: {
        Row: {
          action_metadata: Json | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          status: string | null
          suggestion_type: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          action_metadata?: Json | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          status?: string | null
          suggestion_type?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          action_metadata?: Json | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          status?: string | null
          suggestion_type?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      calendar_connections: {
        Row: {
          access_token: string | null
          access_token_expires_at: string | null
          created_at: string
          external_calendar_id: string
          id: string
          last_error: string | null
          last_synced_at: string | null
          provider: string
          refresh_token: string | null
          scopes: string[]
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          access_token_expires_at?: string | null
          created_at?: string
          external_calendar_id?: string
          id?: string
          last_error?: string | null
          last_synced_at?: string | null
          provider?: string
          refresh_token?: string | null
          scopes?: string[]
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          access_token?: string | null
          access_token_expires_at?: string | null
          created_at?: string
          external_calendar_id?: string
          id?: string
          last_error?: string | null
          last_synced_at?: string | null
          provider?: string
          refresh_token?: string | null
          scopes?: string[]
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string
          ends_at: string
          external_calendar_id: string
          external_event_id: string
          id: string
          is_all_day: boolean
          location: string | null
          provider: string
          starts_at: string
          status: string
          title: string | null
          updated_at: string
          updated_from_provider_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          external_calendar_id?: string
          external_event_id: string
          id?: string
          is_all_day?: boolean
          location?: string | null
          provider?: string
          starts_at: string
          status?: string
          title?: string | null
          updated_at?: string
          updated_from_provider_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          external_calendar_id?: string
          external_event_id?: string
          id?: string
          is_all_day?: boolean
          location?: string | null
          provider?: string
          starts_at?: string
          status?: string
          title?: string | null
          updated_at?: string
          updated_from_provider_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      children: {
        Row: {
          accepted_health_disclaimer: boolean | null
          allergies: string | null
          birth_date: string
          blood_type: string | null
          created_at: string
          gender: string | null
          id: string
          is_neurodivergent: boolean | null
          medical_notes: string | null
          name: string
          nickname: string | null
          personality_traits: string | null
          show_standard_milestones: boolean | null
          soothing_methods: string | null
          special_needs_notes: string | null
          updated_at: string
          user_id: string
          vaccination_reminders_enabled: boolean | null
        }
        Insert: {
          accepted_health_disclaimer?: boolean | null
          allergies?: string | null
          birth_date: string
          blood_type?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          is_neurodivergent?: boolean | null
          medical_notes?: string | null
          name: string
          nickname?: string | null
          personality_traits?: string | null
          show_standard_milestones?: boolean | null
          soothing_methods?: string | null
          special_needs_notes?: string | null
          updated_at?: string
          user_id?: string
          vaccination_reminders_enabled?: boolean | null
        }
        Update: {
          accepted_health_disclaimer?: boolean | null
          allergies?: string | null
          birth_date?: string
          blood_type?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          is_neurodivergent?: boolean | null
          medical_notes?: string | null
          name?: string
          nickname?: string | null
          personality_traits?: string | null
          show_standard_milestones?: boolean | null
          soothing_methods?: string | null
          special_needs_notes?: string | null
          updated_at?: string
          user_id?: string
          vaccination_reminders_enabled?: boolean | null
        }
        Relationships: []
      }
      children_insights: {
        Row: {
          child_id: string | null
          created_at: string | null
          description: string | null
          display_until: string | null
          id: string
          insight_type: string
          is_urgent: boolean | null
          title: string
          user_id: string | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          display_until?: string | null
          id?: string
          insight_type: string
          is_urgent?: boolean | null
          title: string
          user_id?: string | null
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          display_until?: string | null
          id?: string
          insight_type?: string
          is_urgent?: boolean | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "children_insights_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          alias: string
          can_annia_message: boolean | null
          category: string | null
          created_at: string
          formal_name: string
          id: string
          intimacy_level: number | null
          notes: string | null
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alias: string
          can_annia_message?: boolean | null
          category?: string | null
          created_at?: string
          formal_name: string
          id?: string
          intimacy_level?: number | null
          notes?: string | null
          phone: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          alias?: string
          can_annia_message?: boolean | null
          category?: string | null
          created_at?: string
          formal_name?: string
          id?: string
          intimacy_level?: number | null
          notes?: string | null
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_log: {
        Row: {
          created_at: string
          direction: string
          id: string
          instance: string | null
          message: string
          phone: string
          user_id: string
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          instance?: string | null
          message: string
          phone: string
          user_id: string
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          instance?: string | null
          message?: string
          phone?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_logs: {
        Row: {
          confidence: number | null
          content: string
          created_at: string | null
          id: string
          intent: string | null
          message_type: string | null
          metadata: Json | null
          phone: string
          processing_time_ms: number | null
          role: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          confidence?: number | null
          content: string
          created_at?: string | null
          id?: string
          intent?: string | null
          message_type?: string | null
          metadata?: Json | null
          phone: string
          processing_time_ms?: number | null
          role: string
          timestamp: string
          user_id?: string | null
        }
        Update: {
          confidence?: number | null
          content?: string
          created_at?: string | null
          id?: string
          intent?: string | null
          message_type?: string | null
          metadata?: Json | null
          phone?: string
          processing_time_ms?: number | null
          role?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          content: string
          conversation_state_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_state_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_state_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_state_id_fkey"
            columns: ["conversation_state_id"]
            isOneToOne: false
            referencedRelation: "conversation_states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_states: {
        Row: {
          context: Json | null
          conversation_key: string
          expires_at: string
          id: string
          origin_workflow: string
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          conversation_key: string
          expires_at?: string
          id?: string
          origin_workflow: string
          started_at?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: Json | null
          conversation_key?: string
          expires_at?: string
          id?: string
          origin_workflow?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_insights: {
        Row: {
          action_label: string | null
          action_url: string | null
          active_date: string
          created_at: string | null
          id: string
          message: string
          mood_type: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          active_date: string
          created_at?: string | null
          id?: string
          message: string
          mood_type: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          active_date?: string
          created_at?: string | null
          id?: string
          message?: string
          mood_type?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          error_stack: string | null
          error_type: string
          execution_id: string | null
          flow_version: string | null
          id: string
          metadata: Json | null
          node_name: string | null
          phone: string | null
          resolved_at: string | null
          retry_count: number | null
          timestamp: string | null
          user_id: string | null
          user_message: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          error_stack?: string | null
          error_type: string
          execution_id?: string | null
          flow_version?: string | null
          id?: string
          metadata?: Json | null
          node_name?: string | null
          phone?: string | null
          resolved_at?: string | null
          retry_count?: number | null
          timestamp?: string | null
          user_id?: string | null
          user_message?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          error_stack?: string | null
          error_type?: string
          execution_id?: string | null
          flow_version?: string | null
          id?: string
          metadata?: Json | null
          node_name?: string | null
          phone?: string | null
          resolved_at?: string | null
          retry_count?: number | null
          timestamp?: string | null
          user_id?: string | null
          user_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      free_time_slots: {
        Row: {
          confidence: number | null
          created_at: string
          duration_min: number
          ends_at: string
          id: string
          source: string
          starts_at: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          duration_min: number
          ends_at: string
          id?: string
          source?: string
          starts_at: string
          user_id?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          duration_min?: number
          ends_at?: string
          id?: string
          source?: string
          starts_at?: string
          user_id?: string
        }
        Relationships: []
      }
      google_oauth_tokens: {
        Row: {
          access_token_expires_at: string | null
          created_at: string
          email: string
          google_access_token: string | null
          google_refresh_token: string
          google_user_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token_expires_at?: string | null
          created_at?: string
          email: string
          google_access_token?: string | null
          google_refresh_token: string
          google_user_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token_expires_at?: string | null
          created_at?: string
          email?: string
          google_access_token?: string | null
          google_refresh_token?: string
          google_user_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      motivational_phrases: {
        Row: {
          communication_style: string
          created_at: string | null
          id: string
          is_active: boolean | null
          phrase: string
          type: string
        }
        Insert: {
          communication_style: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          phrase: string
          type: string
        }
        Update: {
          communication_style?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          phrase?: string
          type?: string
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          created_at: string | null
          id: string
          kickstart_completed_at: string | null
          last_prompt_shown_at: string | null
          prompts_dismissed: number | null
          step_calendar: boolean | null
          step_children: boolean | null
          step_desires: boolean | null
          step_feelings: boolean | null
          step_routines: boolean | null
          step_support_areas: boolean | null
          step_welcome: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          kickstart_completed_at?: string | null
          last_prompt_shown_at?: string | null
          prompts_dismissed?: number | null
          step_calendar?: boolean | null
          step_children?: boolean | null
          step_desires?: boolean | null
          step_feelings?: boolean | null
          step_routines?: boolean | null
          step_support_areas?: boolean | null
          step_welcome?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          kickstart_completed_at?: string | null
          last_prompt_shown_at?: string | null
          prompts_dismissed?: number | null
          step_calendar?: boolean | null
          step_children?: boolean | null
          step_desires?: boolean | null
          step_feelings?: boolean | null
          step_routines?: boolean | null
          step_support_areas?: boolean | null
          step_welcome?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          checkin_evening_enabled: boolean | null
          checkin_evening_time: string | null
          checkin_morning_enabled: boolean | null
          checkin_morning_time: string | null
          city: string | null
          communication_style: string | null
          created_at: string | null
          first_name: string | null
          id: string
          inventory_alerts_enabled: boolean | null
          last_name: string | null
          nickname: string | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          proactive_suggestions_enabled: boolean | null
          state: string | null
          timezone: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          checkin_evening_enabled?: boolean | null
          checkin_evening_time?: string | null
          checkin_morning_enabled?: boolean | null
          checkin_morning_time?: string | null
          city?: string | null
          communication_style?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          inventory_alerts_enabled?: boolean | null
          last_name?: string | null
          nickname?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          proactive_suggestions_enabled?: boolean | null
          state?: string | null
          timezone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          checkin_evening_enabled?: boolean | null
          checkin_evening_time?: string | null
          checkin_morning_enabled?: boolean | null
          checkin_morning_time?: string | null
          city?: string | null
          communication_style?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          inventory_alerts_enabled?: boolean | null
          last_name?: string | null
          nickname?: string | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          proactive_suggestions_enabled?: boolean | null
          state?: string | null
          timezone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      reminder_occurrences: {
        Row: {
          acknowledged_at: string | null
          call_answered: boolean | null
          call_attempts: number | null
          created_at: string
          id: string
          last_call_at: string | null
          notification_sent_at: string | null
          reminder_id: string
          response_text: string | null
          scheduled_at: string
          snooze_count: number | null
          snoozed_until: string | null
          status: Database["public"]["Enums"]["occurrence_status"] | null
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          call_answered?: boolean | null
          call_attempts?: number | null
          created_at?: string
          id?: string
          last_call_at?: string | null
          notification_sent_at?: string | null
          reminder_id: string
          response_text?: string | null
          scheduled_at: string
          snooze_count?: number | null
          snoozed_until?: string | null
          status?: Database["public"]["Enums"]["occurrence_status"] | null
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          call_answered?: boolean | null
          call_attempts?: number | null
          created_at?: string
          id?: string
          last_call_at?: string | null
          notification_sent_at?: string | null
          reminder_id?: string
          response_text?: string | null
          scheduled_at?: string
          snooze_count?: number | null
          snoozed_until?: string | null
          status?: Database["public"]["Enums"]["occurrence_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_occurrences_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "reminders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_occurrences_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "today_reminders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_occurrences_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "upcoming_reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          call_guarantee: boolean | null
          category: Database["public"]["Enums"]["reminder_category"] | null
          created_at: string
          datetime: string
          description: string | null
          effort_level: number | null
          id: string
          metadata: Json | null
          notify_minutes_before: number | null
          priority: Database["public"]["Enums"]["reminder_priority"] | null
          recurrence_config: Json | null
          recurrence_end: string | null
          recurrence_type: Database["public"]["Enums"]["recurrence_type"]
          send_whatsapp: boolean | null
          source: Database["public"]["Enums"]["reminder_source"] | null
          status: Database["public"]["Enums"]["reminder_status"] | null
          suggested_by_ai: boolean | null
          timezone: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          call_guarantee?: boolean | null
          category?: Database["public"]["Enums"]["reminder_category"] | null
          created_at?: string
          datetime: string
          description?: string | null
          effort_level?: number | null
          id?: string
          metadata?: Json | null
          notify_minutes_before?: number | null
          priority?: Database["public"]["Enums"]["reminder_priority"] | null
          recurrence_config?: Json | null
          recurrence_end?: string | null
          recurrence_type?: Database["public"]["Enums"]["recurrence_type"]
          send_whatsapp?: boolean | null
          source?: Database["public"]["Enums"]["reminder_source"] | null
          status?: Database["public"]["Enums"]["reminder_status"] | null
          suggested_by_ai?: boolean | null
          timezone?: string | null
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          call_guarantee?: boolean | null
          category?: Database["public"]["Enums"]["reminder_category"] | null
          created_at?: string
          datetime?: string
          description?: string | null
          effort_level?: number | null
          id?: string
          metadata?: Json | null
          notify_minutes_before?: number | null
          priority?: Database["public"]["Enums"]["reminder_priority"] | null
          recurrence_config?: Json | null
          recurrence_end?: string | null
          recurrence_type?: Database["public"]["Enums"]["recurrence_type"]
          send_whatsapp?: boolean | null
          source?: Database["public"]["Enums"]["reminder_source"] | null
          status?: Database["public"]["Enums"]["reminder_status"] | null
          suggested_by_ai?: boolean | null
          timezone?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_messages: {
        Row: {
          created_at: string | null
          end_date: string | null
          formatted_message: string
          id: string
          last_error: string | null
          last_run: string | null
          max_runs: number | null
          message_content: string
          next_run: string
          recipient_alias: string | null
          recipient_id: string | null
          recipient_name: string
          recipient_phone: string
          run_count: number | null
          schedule_config: Json | null
          schedule_time: string | null
          schedule_type: string
          start_date: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          formatted_message: string
          id?: string
          last_error?: string | null
          last_run?: string | null
          max_runs?: number | null
          message_content: string
          next_run: string
          recipient_alias?: string | null
          recipient_id?: string | null
          recipient_name: string
          recipient_phone: string
          run_count?: number | null
          schedule_config?: Json | null
          schedule_time?: string | null
          schedule_type?: string
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          formatted_message?: string
          id?: string
          last_error?: string | null
          last_run?: string | null
          max_runs?: number | null
          message_content?: string
          next_run?: string
          recipient_alias?: string | null
          recipient_id?: string | null
          recipient_name?: string
          recipient_phone?: string
          run_count?: number | null
          schedule_config?: Json | null
          schedule_time?: string | null
          schedule_type?: string
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sensitive_patterns: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          pattern_regex: string
          pattern_type: string
          rejection_message: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          pattern_regex: string
          pattern_type: string
          rejection_message: string
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          pattern_regex?: string
          pattern_type?: string
          rejection_message?: string
        }
        Relationships: []
      }
      shopping_item_events: {
        Row: {
          event_type: string
          id: string
          item_id: string | null
          meta: Json
          occurred_at: string
          user_id: string
        }
        Insert: {
          event_type: string
          id?: string
          item_id?: string | null
          meta?: Json
          occurred_at?: string
          user_id?: string
        }
        Update: {
          event_type?: string
          id?: string
          item_id?: string | null
          meta?: Json
          occurred_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_item_events_item_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "shopping_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_item_events_item_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_shopping_items_with_frequency"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_item_stats: {
        Row: {
          avg_days_between: number | null
          intervals_count: number
          item_id: string
          last_calculated_at: string
          last_checked_at: string | null
          user_id: string
        }
        Insert: {
          avg_days_between?: number | null
          intervals_count?: number
          item_id: string
          last_calculated_at?: string
          last_checked_at?: string | null
          user_id: string
        }
        Update: {
          avg_days_between?: number | null
          intervals_count?: number
          item_id?: string
          last_calculated_at?: string
          last_checked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_item_stats_item_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "shopping_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_item_stats_item_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "v_shopping_items_with_frequency"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_items: {
        Row: {
          checked_at: string | null
          created_at: string
          id: string
          is_checked: boolean
          last_purchased_at: string | null
          name: string
          name_norm: string | null
          notes: string | null
          phone: string | null
          quantity_text: string | null
          tag_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          checked_at?: string | null
          created_at?: string
          id?: string
          is_checked?: boolean
          last_purchased_at?: string | null
          name: string
          name_norm?: string | null
          notes?: string | null
          phone?: string | null
          quantity_text?: string | null
          tag_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          checked_at?: string | null
          created_at?: string
          id?: string
          is_checked?: boolean
          last_purchased_at?: string | null
          name?: string
          name_norm?: string | null
          notes?: string | null
          phone?: string | null
          quantity_text?: string | null
          tag_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_tag_fk"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "shopping_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          name_norm: string | null
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_norm?: string | null
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_norm?: string | null
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          plan: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          plan?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          plan?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          age: string | null
          challenge: string | null
          children: string | null
          concept: string | null
          created_at: string
          email: string | null
          features: string | null
          has_partner: string | null
          id: string
          marital_status: string | null
          name: string | null
          occupation: string | null
          organization: string | null
          overwhelm: string | null
          partner_contribution: string | null
          phone: string | null
          pricing: string | null
          pricing_comment: string | null
          q10: string | null
          q11: string | null
          q12: string | null
          q14: string | null
          q15: string | null
          q16: string | null
          q17: string | null
          q18: string | null
          q19: string | null
          q20: string | null
          q22: string | null
          q24: string | null
          q9: string | null
          updated_at: string
        }
        Insert: {
          age?: string | null
          challenge?: string | null
          children?: string | null
          concept?: string | null
          created_at?: string
          email?: string | null
          features?: string | null
          has_partner?: string | null
          id?: string
          marital_status?: string | null
          name?: string | null
          occupation?: string | null
          organization?: string | null
          overwhelm?: string | null
          partner_contribution?: string | null
          phone?: string | null
          pricing?: string | null
          pricing_comment?: string | null
          q10?: string | null
          q11?: string | null
          q12?: string | null
          q14?: string | null
          q15?: string | null
          q16?: string | null
          q17?: string | null
          q18?: string | null
          q19?: string | null
          q20?: string | null
          q22?: string | null
          q24?: string | null
          q9?: string | null
          updated_at?: string
        }
        Update: {
          age?: string | null
          challenge?: string | null
          children?: string | null
          concept?: string | null
          created_at?: string
          email?: string | null
          features?: string | null
          has_partner?: string | null
          id?: string
          marital_status?: string | null
          name?: string | null
          occupation?: string | null
          organization?: string | null
          overwhelm?: string | null
          partner_contribution?: string | null
          phone?: string | null
          pricing?: string | null
          pricing_comment?: string | null
          q10?: string | null
          q11?: string | null
          q12?: string | null
          q14?: string | null
          q15?: string | null
          q16?: string | null
          q17?: string | null
          q18?: string | null
          q19?: string | null
          q20?: string | null
          q22?: string | null
          q24?: string | null
          q9?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      thais_testes_gerais: {
        Row: {
          created_at: string
          id: number
          texto: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          texto?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          texto?: string | null
        }
        Relationships: []
      }
      user_memories: {
        Row: {
          category: string
          category_normalized: string
          content: string
          content_hash: string
          created_at: string | null
          deleted_at: string | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          source: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          category_normalized?: string
          content: string
          content_hash: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          source?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          category_normalized?: string
          content?: string
          content_hash?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          source?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_memories_audit: {
        Row: {
          id: string
          memory_id: string
          metadata: Json | null
          new_category: string | null
          new_content: string | null
          old_category: string | null
          old_content: string | null
          operation: string
          performed_at: string | null
          performed_by: string | null
          user_id: string
        }
        Insert: {
          id?: string
          memory_id: string
          metadata?: Json | null
          new_category?: string | null
          new_content?: string | null
          old_category?: string | null
          old_content?: string | null
          operation: string
          performed_at?: string | null
          performed_by?: string | null
          user_id: string
        }
        Update: {
          id?: string
          memory_id?: string
          metadata?: Json | null
          new_category?: string | null
          new_content?: string | null
          old_category?: string | null
          old_content?: string | null
          operation?: string
          performed_at?: string | null
          performed_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_routines: {
        Row: {
          color: string | null
          created_at: string | null
          days_of_week: number[]
          end_time: string
          id: string
          is_flexible: boolean | null
          name: string
          routine_type: string
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          days_of_week: number[]
          end_time: string
          id?: string
          is_flexible?: boolean | null
          name: string
          routine_type?: string
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          days_of_week?: number[]
          end_time?: string
          id?: string
          is_flexible?: boolean | null
          name?: string
          routine_type?: string
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      errors_recent: {
        Row: {
          affected_users: number | null
          avg_retry_count: number | null
          error_count: number | null
          error_type: string | null
          first_occurrence: string | null
          last_occurrence: string | null
          resolved_count: number | null
          unresolved_count: number | null
        }
        Relationships: []
      }
      intent_distribution: {
        Row: {
          avg_confidence: number | null
          count: number | null
          intent: string | null
          max_confidence: number | null
          min_confidence: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      metrics_hourly: {
        Row: {
          assistant_messages: number | null
          avg_confidence: number | null
          avg_processing_time_ms: number | null
          hour: string | null
          max_processing_time_ms: number | null
          total_messages: number | null
          unique_intents: number | null
          unique_phones: number | null
          unique_users: number | null
          user_messages: number | null
        }
        Relationships: []
      }
      today_reminders: {
        Row: {
          call_guarantee: boolean | null
          category: Database["public"]["Enums"]["reminder_category"] | null
          description: string | null
          id: string | null
          occurrence_id: string | null
          occurrence_status:
            | Database["public"]["Enums"]["occurrence_status"]
            | null
          priority: Database["public"]["Enums"]["reminder_priority"] | null
          scheduled_at: string | null
          title: string | null
          user_id: string | null
        }
        Relationships: []
      }
      upcoming_reminders: {
        Row: {
          call_guarantee: boolean | null
          category: Database["public"]["Enums"]["reminder_category"] | null
          description: string | null
          id: string | null
          occurrence_id: string | null
          occurrence_status:
            | Database["public"]["Enums"]["occurrence_status"]
            | null
          priority: Database["public"]["Enums"]["reminder_priority"] | null
          scheduled_at: string | null
          title: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_activity_summary: {
        Row: {
          active_days: number | null
          avg_processing_time_ms: number | null
          first_name: string | null
          last_interaction: string | null
          nickname: string | null
          total_interactions: number | null
          unique_intents_used: number | null
          user_id: string | null
          whatsapp: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_memory_stats: {
        Row: {
          active_count: number | null
          category_count: number | null
          deleted_count: number | null
          last_memory_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_recent_audit: {
        Row: {
          id: string | null
          memory_id: string | null
          new_content: string | null
          old_content: string | null
          operation: string | null
          performed_at: string | null
          user_name: string | null
        }
        Relationships: []
      }
      v_shopping_items_with_frequency: {
        Row: {
          avg_days_between: number | null
          checked_at: string | null
          created_at: string | null
          id: string | null
          intervals_count: number | null
          is_checked: boolean | null
          last_calculated_at: string | null
          last_checked_at: string | null
          last_purchased_at: string | null
          name: string | null
          notes: string | null
          quantity_text: string | null
          tag_id: string | null
          tag_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_tag_fk"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "shopping_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_pending_scheduled_messages: {
        Row: {
          formatted_message: string | null
          id: string | null
          next_run: string | null
          recipient_alias: string | null
          recipient_name: string | null
          recipient_phone: string | null
          schedule_type: string | null
          sender_name: string | null
          sender_phone: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_next_run: {
        Args: {
          p_current_run: string
          p_schedule_config: Json
          p_schedule_time: string
          p_schedule_type: string
          p_timezone?: string
        }
        Returns: string
      }
      check_sensitive_content: {
        Args: { p_content: string }
        Returns: {
          is_sensitive: boolean
          rejection_message: string
        }[]
      }
      cleanup_old_conversation_messages: {
        Args: { p_retention_days?: number }
        Returns: number
      }
      cleanup_old_deleted_memories: { Args: never; Returns: number }
      cleanup_old_logs: {
        Args: { days_to_keep?: number }
        Returns: {
          conversation_logs_deleted: number
          error_logs_deleted: number
        }[]
      }
      count_memories_by_category: {
        Args: { p_user_id: string }
        Returns: {
          category_display: string
          category_normalized: string
          count: number
        }[]
      }
      finish_conversa_state: {
        Args: { p_state_id: string }
        Returns: undefined
      }
      fn_lista_excluir: {
        Args: { p_items: string[]; p_user_id: string }
        Returns: {
          matched_name: string
          requested_name: string
          sim_score: number
          status: string
        }[]
      }
      fn_lista_incluir: {
        Args: { p_items: string[]; p_tag_name: string; p_user_id: string }
        Returns: {
          item_name: string
          matched_name: string
          out_tag_id: string
          out_tag_name: string
          status: string
        }[]
      }
      fn_lista_ver: {
        Args: { p_tag_name?: string; p_user_id: string }
        Returns: {
          item_count: number
          items: Json
          tag_id: string
          tag_name: string
        }[]
      }
      generate_content_hash: { Args: { content_text: string }; Returns: string }
      generate_reminder_occurrences: {
        Args: { p_count?: number; p_reminder_id: string }
        Returns: number
      }
      get_complete_schema: { Args: never; Returns: Json }
      get_conversa_context: {
        Args: { p_state_id?: string; p_user_id: string }
        Returns: Json
      }
      get_home_dashboard: { Args: never; Returns: Json }
      get_pending_notifications: {
        Args: { p_minutes_ahead?: number }
        Returns: {
          call_guarantee: boolean
          category: Database["public"]["Enums"]["reminder_category"]
          description: string
          occurrence_id: string
          priority: Database["public"]["Enums"]["reminder_priority"]
          reminder_id: string
          scheduled_at: string
          send_whatsapp: boolean
          title: string
          user_id: string
        }[]
      }
      get_pending_occurrences: {
        Args: { p_limit?: number }
        Returns: {
          description: string
          notify_minutes_before: number
          occurrence_id: string
          reminder_id: string
          scheduled_at: string
          title: string
          user_id: string
        }[]
      }
      get_system_stats: {
        Args: { hours_back?: number }
        Returns: {
          metric: string
          value: number
        }[]
      }
      handle_occurrence_completion: {
        Args: { p_occurrence_id: string; p_reminder_id: string }
        Returns: Json
      }
      handle_user_action: {
        Args: {
          p_action: string
          p_occurrence_id: string
          p_snooze_minutes?: number
        }
        Returns: Json
      }
      insert_memory: {
        Args: {
          p_category: string
          p_category_normalized: string
          p_content: string
          p_keywords?: string[]
          p_user_id: string
        }
        Returns: {
          error_message: string
          memory_id: string
          success: boolean
        }[]
      }
      list_deleted_memories: {
        Args: { p_limit?: number; p_user_id: string }
        Returns: {
          category: string
          content: string
          deleted_at: string
          id: string
        }[]
      }
      memory_exists: {
        Args: { p_content: string; p_user_id: string }
        Returns: boolean
      }
      process_scheduled_message: {
        Args: {
          p_error_message?: string
          p_message_id: string
          p_success?: boolean
        }
        Returns: undefined
      }
      restore_memory: {
        Args: { p_memory_id: string; p_user_id: string }
        Returns: {
          message: string
          restored_id: string
          success: boolean
        }[]
      }
      save_conversa_messages: {
        Args: {
          p_assistant_message: string
          p_state_id: string
          p_user_id: string
          p_user_message: string
        }
        Returns: undefined
      }
      search_memories: {
        Args: {
          p_category_normalized?: string
          p_limit?: number
          p_search_term?: string
          p_user_id: string
        }
        Returns: {
          category: string
          category_normalized: string
          content: string
          created_at: string
          id: string
          keywords: string[]
        }[]
      }
      shopping_add_item: {
        Args: {
          p_name: string
          p_notes?: string
          p_quantity_text?: string
          p_tag_name?: string
        }
        Returns: string
      }
      shopping_check_duplicate: {
        Args: { p_name: string; p_tag_name?: string }
        Returns: boolean
      }
      shopping_clear_checked_items: {
        Args: { p_days_ago?: number }
        Returns: number
      }
      shopping_delete_item: { Args: { p_item_id: string }; Returns: undefined }
      shopping_set_item_checked: {
        Args: { p_checked: boolean; p_item_id: string }
        Returns: undefined
      }
      shopping_upsert_tag: {
        Args: { p_name: string; p_sort_order?: number }
        Returns: string
      }
      soft_delete_memory: {
        Args: { memory_id: string; requesting_user_id: string }
        Returns: boolean
      }
      unaccent: { Args: { "": string }; Returns: string }
      upsert_conversa_state: {
        Args: { p_existing_state_id?: string; p_user_id: string }
        Returns: {
          conversation_key: string
          is_new: boolean
          state_id: string
        }[]
      }
    }
    Enums: {
      occurrence_status:
        | "pending"
        | "notified"
        | "acknowledged"
        | "snoozed"
        | "missed"
        | "skipped"
        | "sent"
        | "retry_1"
        | "retry_2"
        | "failed"
      recurrence_type:
        | "once"
        | "daily"
        | "weekly"
        | "monthly"
        | "yearly"
        | "interval"
      reminder_category:
        | "health"
        | "school"
        | "home"
        | "work"
        | "personal"
        | "family"
        | "finance"
        | "other"
      reminder_priority: "normal" | "important" | "urgent"
      reminder_source:
        | "whatsapp_audio"
        | "whatsapp_text"
        | "webapp"
        | "ai_suggestion"
        | "whatsapp"
      reminder_status: "active" | "paused" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      occurrence_status: [
        "pending",
        "notified",
        "acknowledged",
        "snoozed",
        "missed",
        "skipped",
        "sent",
        "retry_1",
        "retry_2",
        "failed",
      ],
      recurrence_type: [
        "once",
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "interval",
      ],
      reminder_category: [
        "health",
        "school",
        "home",
        "work",
        "personal",
        "family",
        "finance",
        "other",
      ],
      reminder_priority: ["normal", "important", "urgent"],
      reminder_source: [
        "whatsapp_audio",
        "whatsapp_text",
        "webapp",
        "ai_suggestion",
        "whatsapp",
      ],
      reminder_status: ["active", "paused", "completed", "cancelled"],
    },
  },
} as const
