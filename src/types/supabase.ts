
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          user_type: string
          created_at: string
          updated_at: string
          skills: Json | null
          university: string | null
          graduation_year: number | null
          major: string | null
          bio: string | null
          linkedin_url: string | null
          avatar_url: string | null
          company_name: string | null
          job_title: string | null
          industry: string | null
          years_experience: number | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          user_type?: string
          created_at?: string
          updated_at?: string
          skills?: Json | null
          university?: string | null
          graduation_year?: number | null
          major?: string | null
          bio?: string | null
          linkedin_url?: string | null
          avatar_url?: string | null
          company_name?: string | null
          job_title?: string | null
          industry?: string | null
          years_experience?: number | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          user_type?: string
          created_at?: string
          updated_at?: string
          skills?: Json | null
          university?: string | null
          graduation_year?: number | null
          major?: string | null
          bio?: string | null
          linkedin_url?: string | null
          avatar_url?: string | null
          company_name?: string | null
          job_title?: string | null
          industry?: string | null
          years_experience?: number | null
        }
      }
      roleplay_sessions: {
        Row: {
          id: string
          student_id: string
          scenario_title: string
          scenario_description: string
          industry: string
          difficulty: string
          status: string
          created_at: string
          updated_at: string
          transcript: Json | null
        }
        Insert: {
          id?: string
          student_id: string
          scenario_title: string
          scenario_description: string
          industry: string
          difficulty: string
          status?: string
          created_at?: string
          updated_at?: string
          transcript?: Json | null
        }
        Update: {
          id?: string
          student_id?: string
          scenario_title?: string
          scenario_description?: string
          industry?: string
          difficulty?: string
          status?: string
          created_at?: string
          updated_at?: string
          transcript?: Json | null
        }
      }
      ai_feedback: {
        Row: {
          id: string
          roleplay_session_id: string
          score: number
          strengths: Json
          weaknesses: Json
          improvement_tips: Json
          created_at: string
        }
        Insert: {
          id?: string
          roleplay_session_id: string
          score: number
          strengths: Json
          weaknesses: Json
          improvement_tips: Json
          created_at?: string
        }
        Update: {
          id?: string
          roleplay_session_id?: string
          score?: number
          strengths?: Json
          weaknesses?: Json
          improvement_tips?: Json
          created_at?: string
        }
      }
      leaderboard_entries: {
        Row: {
          id: string
          user_id: string
          score: number
          category: string
          rank: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          category: string
          rank?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          category?: string
          rank?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
