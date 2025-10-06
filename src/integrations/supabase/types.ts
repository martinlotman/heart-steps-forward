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
      admin_impersonation_sessions: {
        Row: {
          admin_user_id: string
          ended_at: string | null
          expires_at: string
          id: string
          impersonated_user_id: string
          reason: string | null
          started_at: string
        }
        Insert: {
          admin_user_id: string
          ended_at?: string | null
          expires_at?: string
          id?: string
          impersonated_user_id: string
          reason?: string | null
          started_at?: string
        }
        Update: {
          admin_user_id?: string
          ended_at?: string | null
          expires_at?: string
          id?: string
          impersonated_user_id?: string
          reason?: string | null
          started_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          resource_accessed: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          resource_accessed?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          resource_accessed?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          created_at: string
          education: boolean | null
          health: boolean | null
          id: string
          medications: boolean | null
          physical_activity: boolean | null
          task_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          education?: boolean | null
          health?: boolean | null
          id?: string
          medications?: boolean | null
          physical_activity?: boolean | null
          task_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          education?: boolean | null
          health?: boolean | null
          id?: string
          medications?: boolean | null
          physical_activity?: boolean | null
          task_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      eq5d5l_responses: {
        Row: {
          anxiety_depression: string
          created_at: string
          health_score: number
          id: string
          mobility: string
          pain_discomfort: string
          self_care: string
          updated_at: string
          user_id: string
          usual_activities: string
        }
        Insert: {
          anxiety_depression: string
          created_at?: string
          health_score: number
          id?: string
          mobility: string
          pain_discomfort: string
          self_care: string
          updated_at?: string
          user_id: string
          usual_activities: string
        }
        Update: {
          anxiety_depression?: string
          created_at?: string
          health_score?: number
          id?: string
          mobility?: string
          pain_discomfort?: string
          self_care?: string
          updated_at?: string
          user_id?: string
          usual_activities?: string
        }
        Relationships: []
      }
      gppaq_responses: {
        Row: {
          created_at: string
          housework: string
          id: string
          physical_activity: string
          updated_at: string
          user_id: string
          walking_cycling: string
          work_type: string
        }
        Insert: {
          created_at?: string
          housework: string
          id?: string
          physical_activity: string
          updated_at?: string
          user_id: string
          walking_cycling: string
          work_type: string
        }
        Update: {
          created_at?: string
          housework?: string
          id?: string
          physical_activity?: string
          updated_at?: string
          user_id?: string
          walking_cycling?: string
          work_type?: string
        }
        Relationships: []
      }
      health_activities: {
        Row: {
          activity_type: string
          created_at: string
          duration_minutes: number | null
          end_date: string
          exercise_name: string | null
          id: string
          notes: string | null
          source: string
          start_date: string
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          activity_type: string
          created_at?: string
          duration_minutes?: number | null
          end_date: string
          exercise_name?: string | null
          id?: string
          notes?: string | null
          source: string
          start_date: string
          unit: string
          user_id: string
          value: number
        }
        Update: {
          activity_type?: string
          created_at?: string
          duration_minutes?: number | null
          end_date?: string
          exercise_name?: string | null
          id?: string
          notes?: string | null
          source?: string
          start_date?: string
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      health_journey: {
        Row: {
          created_at: string
          id: string
          journey_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          journey_date: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          journey_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_metrics: {
        Row: {
          created_at: string
          diastolic: number | null
          id: string
          metric_type: string
          notes: string | null
          recorded_at: string
          systolic: number | null
          unit: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          diastolic?: number | null
          id?: string
          metric_type: string
          notes?: string | null
          recorded_at?: string
          systolic?: number | null
          unit: string
          updated_at?: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          diastolic?: number | null
          id?: string
          metric_type?: string
          notes?: string | null
          recorded_at?: string
          systolic?: number | null
          unit?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      Lifestyle: {
        Row: {
          "Patient-Friendly Description": string | null
          "Performance Indicator": string | null
          Task: string
          "Time Needed": string | null
        }
        Insert: {
          "Patient-Friendly Description"?: string | null
          "Performance Indicator"?: string | null
          Task: string
          "Time Needed"?: string | null
        }
        Update: {
          "Patient-Friendly Description"?: string | null
          "Performance Indicator"?: string | null
          Task?: string
          "Time Needed"?: string | null
        }
        Relationships: []
      }
      "Lifestyle daily recommendations": {
        Row: {
          Recommendation: string | null
          Reference: string | null
          Tip: string
          Topic: string | null
        }
        Insert: {
          Recommendation?: string | null
          Reference?: string | null
          Tip: string
          Topic?: string | null
        }
        Update: {
          Recommendation?: string | null
          Reference?: string | null
          Tip?: string
          Topic?: string | null
        }
        Relationships: []
      }
      medication_intakes: {
        Row: {
          created_at: string
          id: string
          medication_id: string
          notes: string | null
          scheduled_time: string
          status: string
          taken_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          medication_id: string
          notes?: string | null
          scheduled_time: string
          status: string
          taken_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          medication_id?: string
          notes?: string | null
          scheduled_time?: string
          status?: string
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_intakes_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          active: boolean
          created_at: string
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          instructions: string | null
          name: string
          prescribed_by: string | null
          reminder_times: Json | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          instructions?: string | null
          name: string
          prescribed_by?: string | null
          reminder_times?: Json | null
          start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          instructions?: string | null
          name?: string
          prescribed_by?: string | null
          reminder_times?: Json | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number
          created_at: string
          date_of_mi: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age: number
          created_at?: string
          date_of_mi: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number
          created_at?: string
          date_of_mi?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      therapeutic_goals: {
        Row: {
          created_at: string
          goal_type: string
          id: string
          target_value: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_type: string
          id?: string
          target_value: string
          unit: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_type?: string
          id?: string
          target_value?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      translations: {
        Row: {
          category: string
          created_at: string
          en: string
          et: string | null
          id: string
          key: string
          ru: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          en: string
          et?: string | null
          id?: string
          key: string
          ru?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          en?: string
          et?: string | null
          id?: string
          key?: string
          ru?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_type: string
          consented: boolean
          created_at: string
          id: string
          updated_at: string
          user_id: string
          version: string
        }
        Insert: {
          consent_type: string
          consented?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          version: string
        }
        Update: {
          consent_type?: string
          consented?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          created_at: string
          goal_type: string
          id: string
          target_value: number
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_type: string
          id?: string
          target_value: number
          unit: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_type?: string
          id?: string
          target_value?: number
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          language: string
          notification_preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          notification_preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          notification_preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          age: number
          created_at: string
          date_of_mi: string
          email: string
          name: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          _action: string
          _ip_address?: string
          _resource_accessed?: string
          _user_agent?: string
          _user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
