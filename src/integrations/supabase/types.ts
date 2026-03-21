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
      academy_articles: {
        Row: {
          author: string | null
          category: string
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          meta_description: string | null
          published: boolean | null
          related_tool_slug: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category?: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          published?: boolean | null
          related_tool_slug?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          published?: boolean | null
          related_tool_slug?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_events: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          performed_by: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          performed_by?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          performed_by?: string | null
        }
        Relationships: []
      }
      affidavit_drafts: {
        Row: {
          about_person: string | null
          created_at: string | null
          draft_pdf_url: string | null
          full_name: string
          id: string
          id_number: string | null
          purpose: string
          related_entry_ids: string[] | null
          relationship_to_person: string | null
          relief_sought: string[] | null
          residential_address: string
          statement_text: string
          telephone_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          about_person?: string | null
          created_at?: string | null
          draft_pdf_url?: string | null
          full_name: string
          id?: string
          id_number?: string | null
          purpose: string
          related_entry_ids?: string[] | null
          relationship_to_person?: string | null
          relief_sought?: string[] | null
          residential_address: string
          statement_text: string
          telephone_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          about_person?: string | null
          created_at?: string | null
          draft_pdf_url?: string | null
          full_name?: string
          id?: string
          id_number?: string | null
          purpose?: string
          related_entry_ids?: string[] | null
          relationship_to_person?: string | null
          relief_sought?: string[] | null
          residential_address?: string
          statement_text?: string
          telephone_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      behavioral_assessments: {
        Row: {
          ai_analysis: string | null
          assessment_type: string
          categories_detected: string[] | null
          created_at: string
          free_text: string | null
          id: string
          responses: Json
          risk_level: string
          risk_score: number
          user_id: string
        }
        Insert: {
          ai_analysis?: string | null
          assessment_type?: string
          categories_detected?: string[] | null
          created_at?: string
          free_text?: string | null
          id?: string
          responses?: Json
          risk_level?: string
          risk_score?: number
          user_id: string
        }
        Update: {
          ai_analysis?: string | null
          assessment_type?: string
          categories_detected?: string[] | null
          created_at?: string
          free_text?: string | null
          id?: string
          responses?: Json
          risk_level?: string
          risk_score?: number
          user_id?: string
        }
        Relationships: []
      }
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
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      gazette_records: {
        Row: {
          case_number: string | null
          court_name: string | null
          created_at: string
          details: string | null
          first_name: string | null
          full_name: string
          gazette_date: string | null
          gazette_number: string | null
          id: string
          id_number: string | null
          is_active: boolean | null
          name_normalized: string | null
          order_type: string | null
          province: string | null
          record_type: string
          source_page_number: number | null
          source_pdf_url: string | null
          surname: string | null
          updated_at: string
        }
        Insert: {
          case_number?: string | null
          court_name?: string | null
          created_at?: string
          details?: string | null
          first_name?: string | null
          full_name: string
          gazette_date?: string | null
          gazette_number?: string | null
          id?: string
          id_number?: string | null
          is_active?: boolean | null
          name_normalized?: string | null
          order_type?: string | null
          province?: string | null
          record_type?: string
          source_page_number?: number | null
          source_pdf_url?: string | null
          surname?: string | null
          updated_at?: string
        }
        Update: {
          case_number?: string | null
          court_name?: string | null
          created_at?: string
          details?: string | null
          first_name?: string | null
          full_name?: string
          gazette_date?: string | null
          gazette_number?: string | null
          id?: string
          id_number?: string | null
          is_active?: boolean | null
          name_normalized?: string | null
          order_type?: string | null
          province?: string | null
          record_type?: string
          source_page_number?: number | null
          source_pdf_url?: string | null
          surname?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gbv_resources: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          description: string | null
          hours: string | null
          icon: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          priority: number | null
          province: string | null
          services: string[] | null
          type: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          hours?: string | null
          icon?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          priority?: number | null
          province?: string | null
          services?: string[] | null
          type: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          hours?: string | null
          icon?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          priority?: number | null
          province?: string | null
          services?: string[] | null
          type?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      habit_checkins: {
        Row: {
          checkin_date: string
          created_at: string
          id: string
          responses: Json
          score: number
          user_id: string
        }
        Insert: {
          checkin_date?: string
          created_at?: string
          id?: string
          responses?: Json
          score?: number
          user_id: string
        }
        Update: {
          checkin_date?: string
          created_at?: string
          id?: string
          responses?: Json
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      habit_streaks: {
        Row: {
          current_streak: number
          id: string
          last_checkin_date: string | null
          longest_streak: number
          total_checkins: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          id?: string
          last_checkin_date?: string | null
          longest_streak?: number
          total_checkins?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          id?: string
          last_checkin_date?: string | null
          longest_streak?: number
          total_checkins?: number
          updated_at?: string
          user_id?: string
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
      journal_entries: {
        Row: {
          about_person: string | null
          abuse_types: string[] | null
          addendum_notes: string | null
          children_present: boolean | null
          created_at: string | null
          emotional_state: string | null
          entry_date: string
          entry_time: string
          hash_generated_at: string | null
          id: string
          incident_description: string
          injuries_damage: string | null
          last_edited_at: string | null
          location: string | null
          medical_attention: boolean | null
          medical_details: string | null
          police_case_number: string | null
          police_reported: boolean | null
          statement_hash: string | null
          statement_locked: boolean | null
          subject_person: string | null
          updated_at: string | null
          user_id: string
          weapon_description: string | null
          weapon_involved: boolean | null
          witnesses: string | null
        }
        Insert: {
          about_person?: string | null
          abuse_types?: string[] | null
          addendum_notes?: string | null
          children_present?: boolean | null
          created_at?: string | null
          emotional_state?: string | null
          entry_date: string
          entry_time: string
          hash_generated_at?: string | null
          id?: string
          incident_description: string
          injuries_damage?: string | null
          last_edited_at?: string | null
          location?: string | null
          medical_attention?: boolean | null
          medical_details?: string | null
          police_case_number?: string | null
          police_reported?: boolean | null
          statement_hash?: string | null
          statement_locked?: boolean | null
          subject_person?: string | null
          updated_at?: string | null
          user_id: string
          weapon_description?: string | null
          weapon_involved?: boolean | null
          witnesses?: string | null
        }
        Update: {
          about_person?: string | null
          abuse_types?: string[] | null
          addendum_notes?: string | null
          children_present?: boolean | null
          created_at?: string | null
          emotional_state?: string | null
          entry_date?: string
          entry_time?: string
          hash_generated_at?: string | null
          id?: string
          incident_description?: string
          injuries_damage?: string | null
          last_edited_at?: string | null
          location?: string | null
          medical_attention?: boolean | null
          medical_details?: string | null
          police_case_number?: string | null
          police_reported?: boolean | null
          statement_hash?: string | null
          statement_locked?: boolean | null
          subject_person?: string | null
          updated_at?: string | null
          user_id?: string
          weapon_description?: string | null
          weapon_involved?: boolean | null
          witnesses?: string | null
        }
        Relationships: []
      }
      journal_evidence: {
        Row: {
          entry_id: string
          file_hash: string | null
          file_hash_generated_at: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          hash_algorithm: string | null
          id: string
          uploaded_at: string | null
        }
        Insert: {
          entry_id: string
          file_hash?: string | null
          file_hash_generated_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          hash_algorithm?: string | null
          id?: string
          uploaded_at?: string | null
        }
        Update: {
          entry_id?: string
          file_hash?: string | null
          file_hash_generated_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          hash_algorithm?: string | null
          id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_evidence_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
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
          reference_claimed: boolean | null
          reference_claimed_at: string | null
          reference_claimed_by: string | null
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
          reference_claimed?: boolean | null
          reference_claimed_at?: string | null
          reference_claimed_by?: string | null
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
          reference_claimed?: boolean | null
          reference_claimed_at?: string | null
          reference_claimed_by?: string | null
          search_credits?: number | null
          status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          approved_at: string | null
          checks_referred: number | null
          contact_email: string
          contact_name: string
          created_at: string | null
          id: string
          notes: string | null
          org_name: string
          org_type: string
          referral_code: string | null
          revenue_referred: number | null
          status: string | null
          website: string | null
        }
        Insert: {
          approved_at?: string | null
          checks_referred?: number | null
          contact_email: string
          contact_name: string
          created_at?: string | null
          id?: string
          notes?: string | null
          org_name: string
          org_type: string
          referral_code?: string | null
          revenue_referred?: number | null
          status?: string | null
          website?: string | null
        }
        Update: {
          approved_at?: string | null
          checks_referred?: number | null
          contact_email?: string
          contact_name?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          org_name?: string
          org_type?: string
          referral_code?: string | null
          revenue_referred?: number | null
          status?: string | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
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
          reference_claimed: boolean | null
          reference_claimed_at: string | null
          reference_claimed_by: string | null
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
          reference_claimed?: boolean | null
          reference_claimed_at?: string | null
          reference_claimed_by?: string | null
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
          reference_claimed?: boolean | null
          reference_claimed_at?: string | null
          reference_claimed_by?: string | null
          status?: string | null
        }
        Relationships: []
      }
      record_merge_log: {
        Row: {
          final_record_id: string | null
          id: string
          match_confidence: number | null
          match_criteria: string[] | null
          matched_at: string | null
          matched_by: string | null
          source_1_data: Json | null
          source_1_type: string | null
          source_2_data: Json | null
          source_2_type: string | null
        }
        Insert: {
          final_record_id?: string | null
          id?: string
          match_confidence?: number | null
          match_criteria?: string[] | null
          matched_at?: string | null
          matched_by?: string | null
          source_1_data?: Json | null
          source_1_type?: string | null
          source_2_data?: Json | null
          source_2_type?: string | null
        }
        Update: {
          final_record_id?: string | null
          id?: string
          match_confidence?: number | null
          match_criteria?: string[] | null
          matched_at?: string | null
          matched_by?: string | null
          source_1_data?: Json | null
          source_1_type?: string | null
          source_2_data?: Json | null
          source_2_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "record_merge_log_final_record_id_fkey"
            columns: ["final_record_id"]
            isOneToOne: false
            referencedRelation: "wanted_persons"
            referencedColumns: ["id"]
          },
        ]
      }
      reference_claim_logs: {
        Row: {
          created_at: string
          credits_added: number | null
          id: string
          outcome: string
          reference_number: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_added?: number | null
          id?: string
          outcome: string
          reference_number: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_added?: number | null
          id?: string
          outcome?: string
          reference_number?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string | null
          id: string
          referred_email: string | null
          referred_user_id: string | null
          referrer_user_id: string
          reward_granted: boolean | null
          status: string | null
        }
        Insert: {
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_user_id: string
          reward_granted?: boolean | null
          status?: string | null
        }
        Update: {
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_user_id?: string
          reward_granted?: boolean | null
          status?: string | null
        }
        Relationships: []
      }
      saflii_judgments: {
        Row: {
          accused_first_name: string | null
          accused_name: string
          accused_surname: string | null
          case_number: string | null
          case_title: string | null
          charge_keywords: string[] | null
          court_code: string | null
          court_name: string | null
          created_at: string
          id: string
          is_criminal: boolean | null
          name_normalized: string | null
          province: string | null
          saflii_url: string | null
          year: number | null
        }
        Insert: {
          accused_first_name?: string | null
          accused_name: string
          accused_surname?: string | null
          case_number?: string | null
          case_title?: string | null
          charge_keywords?: string[] | null
          court_code?: string | null
          court_name?: string | null
          created_at?: string
          id?: string
          is_criminal?: boolean | null
          name_normalized?: string | null
          province?: string | null
          saflii_url?: string | null
          year?: number | null
        }
        Update: {
          accused_first_name?: string | null
          accused_name?: string
          accused_surname?: string | null
          case_number?: string | null
          case_title?: string | null
          charge_keywords?: string[] | null
          court_code?: string | null
          court_name?: string | null
          created_at?: string
          id?: string
          is_criminal?: boolean | null
          name_normalized?: string | null
          province?: string | null
          saflii_url?: string | null
          year?: number | null
        }
        Relationships: []
      }
      searches: {
        Row: {
          created_at: string
          hidden_from_dashboard: boolean
          id: string
          is_wanted: boolean
          matches_found: number
          needs_human_verification: boolean | null
          payment_id: string | null
          recommendation: string | null
          results: Json
          risk_factors: string[] | null
          risk_level: string
          risk_score: number | null
          search_case_number: string | null
          search_dob: string | null
          search_id: string
          search_id_number: string | null
          search_name: string | null
          search_province: string | null
          search_strategies: string[] | null
          searched_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          hidden_from_dashboard?: boolean
          id?: string
          is_wanted?: boolean
          matches_found?: number
          needs_human_verification?: boolean | null
          payment_id?: string | null
          recommendation?: string | null
          results?: Json
          risk_factors?: string[] | null
          risk_level?: string
          risk_score?: number | null
          search_case_number?: string | null
          search_dob?: string | null
          search_id: string
          search_id_number?: string | null
          search_name?: string | null
          search_province?: string | null
          search_strategies?: string[] | null
          searched_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          hidden_from_dashboard?: boolean
          id?: string
          is_wanted?: boolean
          matches_found?: number
          needs_human_verification?: boolean | null
          payment_id?: string | null
          recommendation?: string | null
          results?: Json
          risk_factors?: string[] | null
          risk_level?: string
          risk_score?: number | null
          search_case_number?: string | null
          search_dob?: string | null
          search_id?: string
          search_id_number?: string | null
          search_name?: string | null
          search_province?: string | null
          search_strategies?: string[] | null
          searched_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      secure_report_links: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          search_id: string
          token: string
          user_id: string
          viewed: boolean
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          search_id: string
          token: string
          user_id: string
          viewed?: boolean
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          search_id?: string
          token?: string
          user_id?: string
          viewed?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wanted_persons: {
        Row: {
          added_at: string
          aliases: string[] | null
          alleged_offenses: string[] | null
          case_number: string | null
          charges: string
          country: string | null
          court_case_number: string | null
          court_case_numbers: string[] | null
          court_name: string | null
          date_wanted: string | null
          detail_page_url: string | null
          first_name: string | null
          found_in_gazettes: boolean | null
          found_in_saflii: boolean | null
          found_in_saps: boolean | null
          full_name: string
          gazette_notice_refs: string[] | null
          gender: string | null
          id: string
          id_number: string | null
          identity_confidence_score: number | null
          is_active: boolean | null
          last_known_address: string | null
          last_known_location: string | null
          last_verified_at: string | null
          legal_status: string | null
          merged_from_records: string[] | null
          name_normalized: string | null
          needs_human_review: boolean | null
          offense_categories: string[] | null
          offense_category: string | null
          photo_source: string | null
          photo_url: string | null
          police_station: string | null
          protection_order_number: string | null
          protection_order_refs: string[] | null
          province: string | null
          record_status: string | null
          requires_human_verification: boolean | null
          risk_level: string | null
          sa_id_partial: string | null
          saps_case_numbers: string[] | null
          source_dataset: string | null
          source_url: string | null
          source_urls: string[] | null
          surname: string | null
          updated_at: string
          year_of_birth: number | null
        }
        Insert: {
          added_at?: string
          aliases?: string[] | null
          alleged_offenses?: string[] | null
          case_number?: string | null
          charges: string
          country?: string | null
          court_case_number?: string | null
          court_case_numbers?: string[] | null
          court_name?: string | null
          date_wanted?: string | null
          detail_page_url?: string | null
          first_name?: string | null
          found_in_gazettes?: boolean | null
          found_in_saflii?: boolean | null
          found_in_saps?: boolean | null
          full_name: string
          gazette_notice_refs?: string[] | null
          gender?: string | null
          id?: string
          id_number?: string | null
          identity_confidence_score?: number | null
          is_active?: boolean | null
          last_known_address?: string | null
          last_known_location?: string | null
          last_verified_at?: string | null
          legal_status?: string | null
          merged_from_records?: string[] | null
          name_normalized?: string | null
          needs_human_review?: boolean | null
          offense_categories?: string[] | null
          offense_category?: string | null
          photo_source?: string | null
          photo_url?: string | null
          police_station?: string | null
          protection_order_number?: string | null
          protection_order_refs?: string[] | null
          province?: string | null
          record_status?: string | null
          requires_human_verification?: boolean | null
          risk_level?: string | null
          sa_id_partial?: string | null
          saps_case_numbers?: string[] | null
          source_dataset?: string | null
          source_url?: string | null
          source_urls?: string[] | null
          surname?: string | null
          updated_at?: string
          year_of_birth?: number | null
        }
        Update: {
          added_at?: string
          aliases?: string[] | null
          alleged_offenses?: string[] | null
          case_number?: string | null
          charges?: string
          country?: string | null
          court_case_number?: string | null
          court_case_numbers?: string[] | null
          court_name?: string | null
          date_wanted?: string | null
          detail_page_url?: string | null
          first_name?: string | null
          found_in_gazettes?: boolean | null
          found_in_saflii?: boolean | null
          found_in_saps?: boolean | null
          full_name?: string
          gazette_notice_refs?: string[] | null
          gender?: string | null
          id?: string
          id_number?: string | null
          identity_confidence_score?: number | null
          is_active?: boolean | null
          last_known_address?: string | null
          last_known_location?: string | null
          last_verified_at?: string | null
          legal_status?: string | null
          merged_from_records?: string[] | null
          name_normalized?: string | null
          needs_human_review?: boolean | null
          offense_categories?: string[] | null
          offense_category?: string | null
          photo_source?: string | null
          photo_url?: string | null
          police_station?: string | null
          protection_order_number?: string | null
          protection_order_refs?: string[] | null
          province?: string | null
          record_status?: string | null
          requires_human_verification?: boolean | null
          risk_level?: string | null
          sa_id_partial?: string | null
          saps_case_numbers?: string[] | null
          source_dataset?: string | null
          source_url?: string | null
          source_urls?: string[] | null
          surname?: string | null
          updated_at?: string
          year_of_birth?: number | null
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          consent_given: boolean | null
          created_at: string | null
          current_state: string
          id: string
          last_generated_link: string | null
          last_message_at: string | null
          name_entered: string | null
          phone_number: string
          province_entered: string | null
          updated_at: string | null
        }
        Insert: {
          consent_given?: boolean | null
          created_at?: string | null
          current_state?: string
          id?: string
          last_generated_link?: string | null
          last_message_at?: string | null
          name_entered?: string | null
          phone_number: string
          province_entered?: string | null
          updated_at?: string | null
        }
        Update: {
          consent_given?: boolean | null
          created_at?: string | null
          current_state?: string
          id?: string
          last_generated_link?: string | null
          last_message_at?: string | null
          name_entered?: string | null
          phone_number?: string
          province_entered?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          created_at: string | null
          direction: string
          id: string
          message_text: string
          phone_number: string
        }
        Insert: {
          created_at?: string | null
          direction: string
          id?: string
          message_text: string
          phone_number: string
        }
        Update: {
          created_at?: string | null
          direction?: string
          id?: string
          message_text?: string
          phone_number?: string
        }
        Relationships: []
      }
      whatsapp_openings: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          opening_text: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          opening_text: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          opening_text?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lock_journal_entry_statement: {
        Args: { computed_hash: string; entry_id: string }
        Returns: undefined
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "owner" | "support"
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
      app_role: ["admin", "moderator", "user", "owner", "support"],
    },
  },
} as const
