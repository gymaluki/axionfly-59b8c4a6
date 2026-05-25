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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_owner: boolean
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_owner?: boolean
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_owner?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      affiliates: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          lifetime_url: string | null
          monthly_url: string | null
          name: string
          quarterly_url: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          lifetime_url?: string | null
          monthly_url?: string | null
          name: string
          quarterly_url?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          lifetime_url?: string | null
          monthly_url?: string | null
          name?: string
          quarterly_url?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contacted_leads: {
        Row: {
          created_at: string
          id: string
          lead_name: string
          notes: string | null
          phone: string | null
          source_url: string | null
          status: string
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lead_name: string
          notes?: string | null
          phone?: string | null
          source_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lead_name?: string
          notes?: string | null
          phone?: string | null
          source_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      hyperbuild_license_logs: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          license_key: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          license_key?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          license_key?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      hyperbuild_licenses: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          key: string
          lote: string | null
          status: string
          updated_at: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          key: string
          lote?: string | null
          status?: string
          updated_at?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          key?: string
          lote?: string | null
          status?: string
          updated_at?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          is_published: boolean | null
          module_id: string | null
          order: number | null
          title: string
          updated_at: string | null
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean | null
          module_id?: string | null
          order?: number | null
          title: string
          updated_at?: string | null
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          is_published?: boolean | null
          module_id?: string | null
          order?: number | null
          title?: string
          updated_at?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pending_payments: {
        Row: {
          affiliate_slug: string | null
          created_at: string
          email: string
          expires_at: string | null
          id: string
          payment_provider: string | null
          plan: string | null
          status: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          affiliate_slug?: string | null
          created_at?: string
          email: string
          expires_at?: string | null
          id?: string
          payment_provider?: string | null
          plan?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          affiliate_slug?: string | null
          created_at?: string
          email?: string
          expires_at?: string | null
          id?: string
          payment_provider?: string | null
          plan?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      platform_sales: {
        Row: {
          affiliate_slug: string | null
          amount: number | null
          created_at: string | null
          email: string
          id: string
          payload: Json | null
          payment_method: string | null
          plan: string | null
          status: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          affiliate_slug?: string | null
          amount?: number | null
          created_at?: string | null
          email: string
          id?: string
          payload?: Json | null
          payment_method?: string | null
          plan?: string | null
          status: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          affiliate_slug?: string | null
          amount?: number | null
          created_at?: string | null
          email?: string
          id?: string
          payload?: Json | null
          payment_method?: string | null
          plan?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_sales_affiliate_slug_fkey"
            columns: ["affiliate_slug"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["slug"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cakto_product_image_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          cakto_product_image_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          cakto_product_image_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          amount: number
          client_name: string
          created_at: string
          description: string | null
          id: string
          sale_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          client_name: string
          created_at?: string
          description?: string | null
          id?: string
          sale_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          client_name?: string
          created_at?: string
          description?: string | null
          id?: string
          sale_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      search_history: {
        Row: {
          created_at: string
          id: string
          location: string | null
          nicho: string | null
          query: string
          results_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          nicho?: string | null
          query: string
          results_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          nicho?: string | null
          query?: string
          results_count?: number
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          affiliate_slug: string | null
          created_at: string
          expires_at: string | null
          id: string
          payment_provider: string | null
          plan: string | null
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_slug?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_provider?: string | null
          plan?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_slug?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_provider?: string | null
          plan?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_errors: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          level: string
          message: string
          resolved: boolean
          source: string | null
          stack: string | null
          url: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          level?: string
          message: string
          resolved?: boolean
          source?: string | null
          stack?: string | null
          url?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          level?: string
          message?: string
          resolved?: boolean
          source?: string | null
          stack?: string | null
          url?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_cakto_credentials: {
        Row: {
          client_id: string
          client_secret: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          client_secret: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          client_secret?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          lesson_id: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sites: {
        Row: {
          created_at: string
          id: string
          niche: string | null
          prompt: string
          site_name: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          niche?: string | null
          prompt: string
          site_name?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          niche?: string | null
          prompt?: string
          site_name?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      vagas_config: {
        Row: {
          id: string
          initial_slots: number
          remaining_slots: number
          singleton: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          initial_slots?: number
          remaining_slots?: number
          singleton?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          initial_slots?: number
          remaining_slots?: number
          singleton?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_access: { Args: { check_user_id: string }; Returns: boolean }
      claim_hyperbuild_license: {
        Args: never
        Returns: {
          expires_at: string
          license_key: string
        }[]
      }
      claim_pending_access: { Args: never; Returns: boolean }
      decrement_vaga: { Args: never; Returns: number }
      get_affiliate_by_slug: {
        Args: { _slug: string }
        Returns: {
          id: string
          lifetime_url: string
          monthly_url: string
          name: string
          quarterly_url: string
          slug: string
        }[]
      }
      is_admin: { Args: { check_user_id: string }; Returns: boolean }
      is_owner: { Args: { check_user_id: string }; Returns: boolean }
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
