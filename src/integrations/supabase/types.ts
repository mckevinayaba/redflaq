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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      disputes: {
        Row: {
          created_at: string | null
          details: string | null
          document_url: string | null
          id: string
          reason: string
          record_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          status: string | null
          user_email: string
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          document_url?: string | null
          id?: string
          reason: string
          record_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          user_email: string
        }
        Update: {
          created_at?: string | null
          details?: string | null
          document_url?: string | null
          id?: string
          reason?: string
          record_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "wanted_persons"
            referencedColumns: ["id"]
          },
        ]
      }
      duplicate_name_groups: {
        Row: {
          created_at: string | null
          flagged_for_review: boolean | null
          id: string
          match_count: number
          normalized_name: string
          person_ids: string[]
        }
        Insert: {
          created_at?: string | null
          flagged_for_review?: boolean | null
          id?: string
          match_count: number
          normalized_name: string
          person_ids: string[]
        }
        Update: {
          created_at?: string | null
          flagged_for_review?: boolean | null
          id?: string
          match_count?: number
          normalized_name?: string
          person_ids?: string[]
        }
        Relationships: []
      }
      human_verification_requests: {
        Row: {
          additional_info: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          payment_id: string | null
          possible_match_ids: string[] | null
          search_dob: string | null
          search_id_number: string | null
          search_name: string
          search_province: string | null
          status: string | null
          verification_notes: string | null
          verified_by_admin: string | null
          verified_match_id: string | null
        }
        Insert: {
          additional_info?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          payment_id?: string | null
          possible_match_ids?: string[] | null
          search_dob?: string | null
          search_id_number?: string | null
          search_name: string
          search_province?: string | null
          status?: string | null
          verification_notes?: string | null
          verified_by_admin?: string | null
          verified_match_id?: string | null
        }
        Update: {
          additional_info?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          payment_id?: string | null
          possible_match_ids?: string[] | null
          search_dob?: string | null
          search_id_number?: string | null
          search_name?: string
          search_province?: string | null
          status?: string | null
          verification_notes?: string | null
          verified_by_admin?: string | null
          verified_match_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "human_verification_requests_verified_match_id_fkey"
            columns: ["verified_match_id"]
            isOneToOne: false
            referencedRelation: "wanted_persons"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_payments: {
        Row: {
          amount: number
          created_at: string | null
          credits_used: number | null
          email: string
          id: string
          notes: string | null
          package_type: string | null
          payment_id: string
          payment_method: string | null
          proof_url: string | null
          reference: string | null
          search_credits: number | null
          status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          credits_used?: number | null
          email: string
          id?: string
          notes?: string | null
          package_type?: string | null
          payment_id: string
          payment_method?: string | null
          proof_url?: string | null
          reference?: string | null
          search_credits?: number | null
          status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          credits_used?: number | null
          email?: string
          id?: string
          notes?: string | null
          package_type?: string | null
          payment_id?: string
          payment_method?: string | null
          proof_url?: string | null
          reference?: string | null
          search_credits?: number | null
          status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number
          credits_purchased: number
          credits_remaining: number
          currency: string | null
          email: string
          expires_at: string | null
          id: string
          package_type: string
          paypal_order_id: string | null
          paypal_transaction_id: string | null
          purchase_id: string
          purchased_at: string | null
          status: string | null
        }
        Insert: {
          amount: number
          credits_purchased: number
          credits_remaining: number
          currency?: string | null
          email: string
          expires_at?: string | null
          id?: string
          package_type: string
          paypal_order_id?: string | null
          paypal_transaction_id?: string | null
          purchase_id: string
          purchased_at?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          credits_purchased?: number
          credits_remaining?: number
          currency?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          package_type?: string
          paypal_order_id?: string | null
          paypal_transaction_id?: string | null
          purchase_id?: string
          purchased_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      wanted_persons: {
        Row: {
          added_at: string
          case_number: string | null
          charges: string
          court_case_number: string | null
          court_name: string | null
          date_wanted: string | null
          detail_page_url: string | null
          first_name: string | null
          full_name: string
          id: string
          id_number: string | null
          identity_confidence_score: number | null
          is_active: boolean | null
          last_known_location: string | null
          last_verified_at: string | null
          legal_status: string | null
          offense_category: string | null
          photo_url: string | null
          police_station: string | null
          protection_order_number: string | null
          province: string | null
          record_status: string | null
          requires_human_verification: boolean | null
          risk_level: string | null
          source_url: string | null
          surname: string | null
          updated_at: string
        }
        Insert: {
          added_at?: string
          case_number?: string | null
          charges: string
          court_case_number?: string | null
          court_name?: string | null
          date_wanted?: string | null
          detail_page_url?: string | null
          first_name?: string | null
          full_name: string
          id?: string
          id_number?: string | null
          identity_confidence_score?: number | null
          is_active?: boolean | null
          last_known_location?: string | null
          last_verified_at?: string | null
          legal_status?: string | null
          offense_category?: string | null
          photo_url?: string | null
          police_station?: string | null
          protection_order_number?: string | null
          province?: string | null
          record_status?: string | null
          requires_human_verification?: boolean | null
          risk_level?: string | null
          source_url?: string | null
          surname?: string | null
          updated_at?: string
        }
        Update: {
          added_at?: string
          case_number?: string | null
          charges?: string
          court_case_number?: string | null
          court_name?: string | null
          date_wanted?: string | null
          detail_page_url?: string | null
          first_name?: string | null
          full_name?: string
          id?: string
          id_number?: string | null
          identity_confidence_score?: number | null
          is_active?: boolean | null
          last_known_location?: string | null
          last_verified_at?: string | null
          legal_status?: string | null
          offense_category?: string | null
          photo_url?: string | null
          police_station?: string | null
          protection_order_number?: string | null
          province?: string | null
          record_status?: string | null
          requires_human_verification?: boolean | null
          risk_level?: string | null
          source_url?: string | null
          surname?: string | null
          updated_at?: string
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
