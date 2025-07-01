export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_feedback: {
        Row: {
          created_at: string
          id: string
          improvement_tips: string[]
          roleplay_session_id: string
          score: number
          strengths: string[]
          weaknesses: string[]
        }
        Insert: {
          created_at?: string
          id?: string
          improvement_tips: string[]
          roleplay_session_id: string
          score: number
          strengths: string[]
          weaknesses: string[]
        }
        Update: {
          created_at?: string
          id?: string
          improvement_tips?: string[]
          roleplay_session_id?: string
          score?: number
          strengths?: string[]
          weaknesses?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "ai_feedback_roleplay_session_id_fkey"
            columns: ["roleplay_session_id"]
            isOneToOne: false
            referencedRelation: "roleplay_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_response_cache: {
        Row: {
          cache_key: string
          created_at: string | null
          id: string
          response: Json
          updated_at: string | null
        }
        Insert: {
          cache_key: string
          created_at?: string | null
          id?: string
          response: Json
          updated_at?: string | null
        }
        Update: {
          cache_key?: string
          created_at?: string | null
          id?: string
          response?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          created_at: string
          description: string | null
          end_time: string
          guest_id: string | null
          host_id: string
          id: string
          start_time: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time: string
          guest_id?: string | null
          host_id: string
          id?: string
          start_time: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string
          guest_id?: string | null
          host_id?: string
          id?: string
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      assessment_questions: {
        Row: {
          assessment_id: string
          created_at: string
          id: string
          options: string[] | null
          question_order: number
          question_text: string
          question_type: string
          trait: string | null
        }
        Insert: {
          assessment_id: string
          created_at?: string
          id?: string
          options?: string[] | null
          question_order?: number
          question_text: string
          question_type: string
          trait?: string | null
        }
        Update: {
          assessment_id?: string
          created_at?: string
          id?: string
          options?: string[] | null
          question_order?: number
          question_text?: string
          question_type?: string
          trait?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "personality_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_responses: {
        Row: {
          assessment_id: string
          candidate_id: string
          completed_at: string | null
          created_at: string
          id: string
          results: Json | null
          score: number | null
          started_at: string
        }
        Insert: {
          assessment_id: string
          candidate_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          results?: Json | null
          score?: number | null
          started_at?: string
        }
        Update: {
          assessment_id?: string
          candidate_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          results?: Json | null
          score?: number | null
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_responses_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "personality_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      call_participants: {
        Row: {
          call_id: string
          created_at: string
          id: string
          joined_at: string | null
          left_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          call_id: string
          created_at?: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          call_id?: string
          created_at?: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_participants_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          call_type: string
          created_at: string
          created_by: string | null
          description: string | null
          ended_at: string | null
          host_id: string
          id: string
          is_ai_feedback_processed: boolean | null
          recording_url: string | null
          related_session_id: string | null
          scheduled_at: string | null
          started_at: string | null
          status: string
          title: string
          transcript_url: string | null
          updated_at: string
        }
        Insert: {
          call_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          ended_at?: string | null
          host_id: string
          id?: string
          is_ai_feedback_processed?: boolean | null
          recording_url?: string | null
          related_session_id?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          title: string
          transcript_url?: string | null
          updated_at?: string
        }
        Update: {
          call_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          ended_at?: string | null
          host_id?: string
          id?: string
          is_ai_feedback_processed?: boolean | null
          recording_url?: string | null
          related_session_id?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          title?: string
          transcript_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_related_session_id_fkey"
            columns: ["related_session_id"]
            isOneToOne: false
            referencedRelation: "roleplay_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_engagement: {
        Row: {
          activity_date: string
          candidate_id: string | null
          created_at: string | null
          engagement_level: string | null
          id: string
          improvement_rate: number | null
          job_applications: number | null
          job_views: number | null
          message_count: number | null
          profile_views: number | null
          roleplay_count: number | null
        }
        Insert: {
          activity_date: string
          candidate_id?: string | null
          created_at?: string | null
          engagement_level?: string | null
          id?: string
          improvement_rate?: number | null
          job_applications?: number | null
          job_views?: number | null
          message_count?: number | null
          profile_views?: number | null
          roleplay_count?: number | null
        }
        Update: {
          activity_date?: string
          candidate_id?: string | null
          created_at?: string | null
          engagement_level?: string | null
          id?: string
          improvement_rate?: number | null
          job_applications?: number | null
          job_views?: number | null
          message_count?: number | null
          profile_views?: number | null
          roleplay_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_engagement_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_engagement_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "recruiter_student_view"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          comments: number | null
          content: string | null
          created_at: string
          id: string
          likes: number | null
          media_type: string | null
          media_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comments?: number | null
          content?: string | null
          created_at?: string
          id?: string
          likes?: number | null
          media_type?: string | null
          media_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comments?: number | null
          content?: string | null
          created_at?: string
          id?: string
          likes?: number | null
          media_type?: string | null
          media_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_challenges: {
        Row: {
          challenge_data: Json
          challenge_type: string
          created_at: string
          date_active: string
          id: string
          is_active: boolean
        }
        Insert: {
          challenge_data: Json
          challenge_type: string
          created_at?: string
          date_active?: string
          id?: string
          is_active?: boolean
        }
        Update: {
          challenge_data?: Json
          challenge_type?: string
          created_at?: string
          date_active?: string
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      document_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string | null
          document_id: string
          embedding: string | null
          feature_source: string
          id: string
          user_id: string
        }
        Insert: {
          chunk_index?: number
          content: string
          created_at?: string | null
          document_id: string
          embedding?: string | null
          feature_source: string
          id?: string
          user_id: string
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string | null
          document_id?: string
          embedding?: string | null
          feature_source?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "rag_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      job_matches: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          id: string
          job_id: string | null
          match_reasons: Json | null
          match_score: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          match_reasons?: Json | null
          match_score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          match_reasons?: Json | null
          match_score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_matches_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_matches_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "recruiter_student_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          ai_matching_enabled: boolean | null
          application_count: number | null
          application_link: string | null
          company_name: string
          created_at: string
          description: string
          id: string
          is_active: boolean | null
          job_type: string | null
          location: string | null
          preferred_experience: string | null
          recruiter_id: string
          required_roleplay_id: string | null
          required_skills: Json | null
          requirements: string[]
          salary_range: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          ai_matching_enabled?: boolean | null
          application_count?: number | null
          application_link?: string | null
          company_name: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          preferred_experience?: string | null
          recruiter_id: string
          required_roleplay_id?: string | null
          required_skills?: Json | null
          requirements: string[]
          salary_range?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          ai_matching_enabled?: boolean | null
          application_count?: number | null
          application_link?: string | null
          company_name?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          preferred_experience?: string | null
          recruiter_id?: string
          required_roleplay_id?: string | null
          required_skills?: Json | null
          requirements?: string[]
          salary_range?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: {
          category: string
          created_at: string
          id: string
          rank: number | null
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          rank?: number | null
          score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          rank?: number | null
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      message_engagement_analytics: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          engagement_score: number | null
          id: string
          last_analyzed: string | null
          optimal_send_time: string | null
          recruiter_id: string | null
          response_rate: number | null
          updated_at: string | null
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          last_analyzed?: string | null
          optimal_send_time?: string | null
          recruiter_id?: string | null
          response_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          last_analyzed?: string | null
          optimal_send_time?: string | null
          recruiter_id?: string | null
          response_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_engagement_analytics_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_engagement_analytics_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "recruiter_student_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_engagement_analytics_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_engagement_analytics_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "recruiter_student_view"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          follow_up_suggestion: string | null
          id: string
          read: boolean
          recipient_id: string
          response_time: unknown | null
          sender_id: string
          sentiment_score: number | null
        }
        Insert: {
          content: string
          created_at?: string
          follow_up_suggestion?: string | null
          id?: string
          read?: boolean
          recipient_id: string
          response_time?: unknown | null
          sender_id: string
          sentiment_score?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          follow_up_suggestion?: string | null
          id?: string
          read?: boolean
          recipient_id?: string
          response_time?: unknown | null
          sender_id?: string
          sentiment_score?: number | null
        }
        Relationships: []
      }
      performance_library: {
        Row: {
          created_at: string
          description: string | null
          feedback: Json | null
          id: string
          related_session_id: string | null
          source: string | null
          title: string
          transcript: string | null
          updated_at: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          feedback?: Json | null
          id?: string
          related_session_id?: string | null
          source?: string | null
          title: string
          transcript?: string | null
          updated_at?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          feedback?: Json | null
          id?: string
          related_session_id?: string | null
          source?: string | null
          title?: string
          transcript?: string | null
          updated_at?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_library_related_session_id_fkey"
            columns: ["related_session_id"]
            isOneToOne: false
            referencedRelation: "roleplay_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      personality_assessments: {
        Row: {
          completion_time: string | null
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          model_type: string
          recruiter_id: string
          target_role: string | null
          title: string
          traits: string[] | null
          updated_at: string
        }
        Insert: {
          completion_time?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          model_type: string
          recruiter_id: string
          target_role?: string | null
          title: string
          traits?: string[] | null
          updated_at?: string
        }
        Update: {
          completion_time?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          model_type?: string
          recruiter_id?: string
          target_role?: string | null
          title?: string
          traits?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          confidence_score: number | null
          created_at: string
          engagement_score: number | null
          first_name: string | null
          graduation_year: number | null
          growth_trend: number | null
          id: string
          last_name: string | null
          linkedin_url: string | null
          major: string | null
          objection_score: number | null
          persuasion_score: number | null
          portfolio_highlights: Json | null
          potential_score: number | null
          retention_probability: number | null
          skills: Json | null
          university: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          confidence_score?: number | null
          created_at?: string
          engagement_score?: number | null
          first_name?: string | null
          graduation_year?: number | null
          growth_trend?: number | null
          id: string
          last_name?: string | null
          linkedin_url?: string | null
          major?: string | null
          objection_score?: number | null
          persuasion_score?: number | null
          portfolio_highlights?: Json | null
          potential_score?: number | null
          retention_probability?: number | null
          skills?: Json | null
          university?: string | null
          updated_at?: string
          user_type?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          confidence_score?: number | null
          created_at?: string
          engagement_score?: number | null
          first_name?: string | null
          graduation_year?: number | null
          growth_trend?: number | null
          id?: string
          last_name?: string | null
          linkedin_url?: string | null
          major?: string | null
          objection_score?: number | null
          persuasion_score?: number | null
          portfolio_highlights?: Json | null
          potential_score?: number | null
          retention_probability?: number | null
          skills?: Json | null
          university?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      rag_documents: {
        Row: {
          content_text: string | null
          created_at: string
          embedding: Json | null
          feature_source: string
          file_url: string
          id: string
          title: string
          user_id: string
          user_role: string
        }
        Insert: {
          content_text?: string | null
          created_at?: string
          embedding?: Json | null
          feature_source: string
          file_url: string
          id?: string
          title: string
          user_id: string
          user_role: string
        }
        Update: {
          content_text?: string | null
          created_at?: string
          embedding?: Json | null
          feature_source?: string
          file_url?: string
          id?: string
          title?: string
          user_id?: string
          user_role?: string
        }
        Relationships: []
      }
      rag_queries: {
        Row: {
          created_at: string
          document_id: string | null
          feature_source: string
          id: string
          query_text: string
          response_text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_id?: string | null
          feature_source: string
          id?: string
          query_text: string
          response_text: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_id?: string | null
          feature_source?: string
          id?: string
          query_text?: string
          response_text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rag_queries_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "rag_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiter_calendar_events: {
        Row: {
          candidate_id: string | null
          created_at: string
          description: string | null
          end_time: string
          id: string
          location: string | null
          recruiter_id: string
          reminder_sent: boolean | null
          start_time: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          recruiter_id: string
          reminder_sent?: boolean | null
          start_time: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          recruiter_id?: string
          reminder_sent?: boolean | null
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_calendar_events_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiter_calendar_events_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "recruiter_student_view"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiter_profiles: {
        Row: {
          company_industry: string | null
          company_logo_url: string | null
          company_name: string | null
          company_size: string | null
          created_at: string
          hiring_focus: string[] | null
          id: string
          job_title: string | null
          updated_at: string
        }
        Insert: {
          company_industry?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          hiring_focus?: string[] | null
          id: string
          job_title?: string | null
          updated_at?: string
        }
        Update: {
          company_industry?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          hiring_focus?: string[] | null
          id?: string
          job_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recruiter_saved_students: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          recruiter_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          recruiter_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          recruiter_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_saved_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiter_saved_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "recruiter_student_view"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiter_subscriptions: {
        Row: {
          billing_period: string
          created_at: string
          expires_at: string | null
          id: string
          payment_id: string | null
          payment_method: string | null
          plan_name: string
          price: number
          recruiter_id: string
          starts_at: string
          status: string
          updated_at: string
        }
        Insert: {
          billing_period: string
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          plan_name: string
          price: number
          recruiter_id: string
          starts_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          billing_period?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          plan_name?: string
          price?: number
          recruiter_id?: string
          starts_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      resume_scores: {
        Row: {
          ats_score: number
          clarity_score: number
          created_at: string
          feedback_text: Json | null
          id: string
          resume_id: string
          skills_match_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ats_score: number
          clarity_score: number
          created_at?: string
          feedback_text?: Json | null
          id?: string
          resume_id: string
          skills_match_score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ats_score?: number
          clarity_score?: number
          created_at?: string
          feedback_text?: Json | null
          id?: string
          resume_id?: string
          skills_match_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_scores_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resume_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_versions: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          file_type: string
          id: string
          is_current: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          file_type: string
          id?: string
          is_current?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          file_type?: string
          id?: string
          is_current?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      roleplay_sessions: {
        Row: {
          created_at: string
          difficulty: string
          duration: number
          feedback_status: string | null
          id: string
          industry: string
          practice_segment: string | null
          recruiter_id: string | null
          scenario_data: Json | null
          scenario_description: string | null
          scenario_title: string
          segment: string | null
          status: string
          student_id: string
          transcript: Json | null
          updated_at: string
          upload_url: string | null
        }
        Insert: {
          created_at?: string
          difficulty: string
          duration?: number
          feedback_status?: string | null
          id?: string
          industry: string
          practice_segment?: string | null
          recruiter_id?: string | null
          scenario_data?: Json | null
          scenario_description?: string | null
          scenario_title: string
          segment?: string | null
          status?: string
          student_id: string
          transcript?: Json | null
          updated_at?: string
          upload_url?: string | null
        }
        Update: {
          created_at?: string
          difficulty?: string
          duration?: number
          feedback_status?: string | null
          id?: string
          industry?: string
          practice_segment?: string | null
          recruiter_id?: string | null
          scenario_data?: Json | null
          scenario_description?: string | null
          scenario_title?: string
          segment?: string | null
          status?: string
          student_id?: string
          transcript?: Json | null
          updated_at?: string
          upload_url?: string | null
        }
        Relationships: []
      }
      sales_game_leaderboard: {
        Row: {
          created_at: string
          id: string
          score: number
          streak: number
          updated_at: string
          user_id: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          score?: number
          streak?: number
          updated_at?: string
          user_id: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          id?: string
          score?: number
          streak?: number
          updated_at?: string
          user_id?: string
          week_start_date?: string
        }
        Relationships: []
      }
      sales_games: {
        Row: {
          created_at: string
          game_type: string
          id: string
          score: number
          streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          game_type: string
          id?: string
          score?: number
          streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          game_type?: string
          id?: string
          score?: number
          streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sales_industry_reports: {
        Row: {
          avg_performance_score: number | null
          created_at: string | null
          demand_trends: Json | null
          id: string
          industry: string
          region: string
          skill_gaps: Json | null
          top_skills: Json | null
          updated_at: string | null
        }
        Insert: {
          avg_performance_score?: number | null
          created_at?: string | null
          demand_trends?: Json | null
          id?: string
          industry: string
          region: string
          skill_gaps?: Json | null
          top_skills?: Json | null
          updated_at?: string | null
        }
        Update: {
          avg_performance_score?: number | null
          created_at?: string | null
          demand_trends?: Json | null
          id?: string
          industry?: string
          region?: string
          skill_gaps?: Json | null
          top_skills?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sales_resources: {
        Row: {
          category: string
          created_at: string | null
          description: string
          difficulty_level: string
          estimated_duration: string | null
          file_url: string | null
          format: string
          id: string
          is_featured: boolean | null
          source_url: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          difficulty_level: string
          estimated_duration?: string | null
          file_url?: string | null
          format: string
          id?: string
          is_featured?: boolean | null
          source_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          difficulty_level?: string
          estimated_duration?: string | null
          file_url?: string | null
          format?: string
          id?: string
          is_featured?: boolean | null
          source_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      scorecard_rubric: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          line_item: string | null
          roleplay_session_id: string
          score: number | null
          source: string | null
          weight: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          line_item?: string | null
          roleplay_session_id: string
          score?: number | null
          source?: string | null
          weight?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          line_item?: string | null
          roleplay_session_id?: string
          score?: number | null
          source?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scorecard_rubric_roleplay_session_id_fkey"
            columns: ["roleplay_session_id"]
            isOneToOne: false
            referencedRelation: "roleplay_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsored_challenge_attempts: {
        Row: {
          challenge_id: string
          created_at: string | null
          feedback: Json | null
          id: string
          recording_url: string | null
          score: number | null
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          feedback?: Json | null
          id?: string
          recording_url?: string | null
          score?: number | null
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          feedback?: Json | null
          id?: string
          recording_url?: string | null
          score?: number | null
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsored_challenge_attempts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "sponsored_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsored_challenges: {
        Row: {
          call_info: string
          company_description: string
          company_info: Json
          company_name: string
          created_at: string | null
          created_by: string | null
          difficulty: string
          end_date: string | null
          id: string
          industry: string
          is_active: boolean | null
          prize_amount: number | null
          prize_description: string | null
          product_name: string
          prospect_background: string
          prospect_info: Json
          research_notes: string
          scenario_description: string
          scenario_title: string
          start_date: string | null
        }
        Insert: {
          call_info: string
          company_description: string
          company_info: Json
          company_name: string
          created_at?: string | null
          created_by?: string | null
          difficulty: string
          end_date?: string | null
          id?: string
          industry: string
          is_active?: boolean | null
          prize_amount?: number | null
          prize_description?: string | null
          product_name: string
          prospect_background: string
          prospect_info: Json
          research_notes: string
          scenario_description: string
          scenario_title: string
          start_date?: string | null
        }
        Update: {
          call_info?: string
          company_description?: string
          company_info?: Json
          company_name?: string
          created_at?: string | null
          created_by?: string | null
          difficulty?: string
          end_date?: string | null
          id?: string
          industry?: string
          is_active?: boolean | null
          prize_amount?: number | null
          prize_description?: string | null
          product_name?: string
          prospect_background?: string
          prospect_info?: Json
          research_notes?: string
          scenario_description?: string
          scenario_title?: string
          start_date?: string | null
        }
        Relationships: []
      }
      sponsored_roleplays: {
        Row: {
          company_name: string
          created_at: string
          difficulty: string
          id: string
          industry: string
          prize_amount: number | null
          prize_description: string | null
          product_name: string
          scenario_description: string
          scenario_title: string
        }
        Insert: {
          company_name: string
          created_at?: string
          difficulty: string
          id?: string
          industry: string
          prize_amount?: number | null
          prize_description?: string | null
          product_name: string
          scenario_description: string
          scenario_title: string
        }
        Update: {
          company_name?: string
          created_at?: string
          difficulty?: string
          id?: string
          industry?: string
          prize_amount?: number | null
          prize_description?: string | null
          product_name?: string
          scenario_description?: string
          scenario_title?: string
        }
        Relationships: []
      }
      student_goals: {
        Row: {
          created_at: string
          description: string | null
          id: string
          progress: number | null
          status: string | null
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_opportunities: {
        Row: {
          created_at: string
          description: string
          id: string
          status: string | null
          student_id: string
          suggested_skill: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          status?: string | null
          student_id: string
          suggested_skill: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          status?: string | null
          student_id?: string
          suggested_skill?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_opportunities_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_opportunities_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "recruiter_student_view"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_pool_members: {
        Row: {
          added_at: string
          id: string
          notes: string | null
          student_id: string
          talent_pool_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          notes?: string | null
          student_id: string
          talent_pool_id: string
        }
        Update: {
          added_at?: string
          id?: string
          notes?: string | null
          student_id?: string
          talent_pool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_pool_members_talent_pool_id_fkey"
            columns: ["talent_pool_id"]
            isOneToOne: false
            referencedRelation: "talent_pools"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_pools: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          recruiter_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          recruiter_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          recruiter_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      top_weekly_candidates: {
        Row: {
          created_at: string
          id: string
          ranking: number
          reason: string | null
          score: number
          student_id: string | null
          week_start_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          ranking: number
          reason?: string | null
          score: number
          student_id?: string | null
          week_start_date: string
        }
        Update: {
          created_at?: string
          id?: string
          ranking?: number
          reason?: string | null
          score?: number
          student_id?: string | null
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "top_weekly_candidates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "top_weekly_candidates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "recruiter_student_view"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_winners: {
        Row: {
          created_at: string
          id: string
          prize_claimed: boolean
          prize_type: string
          user_id: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          prize_claimed?: boolean
          prize_type?: string
          user_id: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          id?: string
          prize_claimed?: boolean
          prize_type?: string
          user_id?: string
          week_start_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      recruiter_student_view: {
        Row: {
          avatar_url: string | null
          bio: string | null
          first_name: string | null
          graduation_year: number | null
          id: string | null
          last_name: string | null
          major: string | null
          skills: Json | null
          university: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          first_name?: string | null
          graduation_year?: number | null
          id?: string | null
          last_name?: string | null
          major?: string | null
          skills?: Json | null
          university?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          first_name?: string | null
          graduation_year?: number | null
          id?: string | null
          last_name?: string | null
          major?: string | null
          skills?: Json | null
          university?: string | null
        }
        Relationships: []
      }
      resource_categories: {
        Row: {
          category: string | null
          resource_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment_resource_view: {
        Args: { resource_id: string }
        Returns: undefined
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_document_chunks: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
          feature_filter?: string
          document_filter?: string
          user_filter?: string
        }
        Returns: {
          id: string
          document_id: string
          content: string
          similarity: number
          chunk_index: number
        }[]
      }
      match_documents: {
        Args: {
          query_embedding: Json
          match_threshold: number
          match_count: number
          feature_source: string
        }
        Returns: {
          id: string
          content_text: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      user_has_call_access: {
        Args: { call_id: string }
        Returns: boolean
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
