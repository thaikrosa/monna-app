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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          nickname: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          nickname?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          nickname?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          child_id: string | null
          contact_id: string | null
          created_at: string
          description: string | null
          due_date: string
          effort_level: number | null
          id: string
          interval_type: string | null
          interval_value: number | null
          is_critical: boolean | null
          is_recurring: boolean | null
          metadata: Json | null
          send_whatsapp: boolean | null
          status: string | null
          suggested_by_ia: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          child_id?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          effort_level?: number | null
          id?: string
          interval_type?: string | null
          interval_value?: number | null
          is_critical?: boolean | null
          is_recurring?: boolean | null
          metadata?: Json | null
          send_whatsapp?: boolean | null
          status?: string | null
          suggested_by_ia?: boolean | null
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          child_id?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          effort_level?: number | null
          id?: string
          interval_type?: string | null
          interval_value?: number | null
          is_critical?: boolean | null
          is_recurring?: boolean | null
          metadata?: Json | null
          send_whatsapp?: boolean | null
          status?: string | null
          suggested_by_ia?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      v_daily_mental_load: {
        Row: {
          critical_tasks: number | null
          pending_tasks: number | null
          reference_date: string | null
          total_effort_score: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_n8n_upcoming_reminders: {
        Row: {
          child_id: string | null
          child_name: string | null
          contact_id: string | null
          contact_name: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          effort_level: number | null
          id: string | null
          interval_type: string | null
          interval_value: number | null
          is_critical: boolean | null
          is_recurring: boolean | null
          metadata: Json | null
          send_whatsapp: boolean | null
          status: string | null
          suggested_by_ia: boolean | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminders_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Functions: {
      get_complete_schema: { Args: never; Returns: Json }
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
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
