export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
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
          end_date: string
          id: string
          source: string
          start_date: string
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          activity_type: string
          created_at?: string
          end_date: string
          id?: string
          source: string
          start_date: string
          unit: string
          user_id: string
          value: number
        }
        Update: {
          activity_type?: string
          created_at?: string
          end_date?: string
          id?: string
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
      user_preferences: {
        Row: {
          created_at: string
          id: string
          language: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
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
      [_ in never]: never
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
