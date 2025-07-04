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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'super_admin' | 'admin' | 'client'
          avatar_url: string | null
          company_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'super_admin' | 'admin' | 'client'
          avatar_url?: string | null
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'super_admin' | 'admin' | 'client'
          avatar_url?: string | null
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: 'draft' | 'in_progress' | 'completed' | 'archived'
          current_step: number
          total_steps: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          current_step?: number
          total_steps?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          current_step?: number
          total_steps?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      project_steps: {
        Row: {
          id: string
          project_id: string
          step_number: number
          step_name: string
          status: 'not_started' | 'in_progress' | 'completed'
          form_data: Json
          ai_outputs: Json
          scraped_data: Json
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          step_number: number
          step_name: string
          status?: 'not_started' | 'in_progress' | 'completed'
          form_data?: Json
          ai_outputs?: Json
          scraped_data?: Json
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          step_number?: number
          step_name?: string
          status?: 'not_started' | 'in_progress' | 'completed'
          form_data?: Json
          ai_outputs?: Json
          scraped_data?: Json
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      ai_agents: {
        Row: {
          id: string
          step_number: number
          name: string
          role: string
          system_prompt: string
          personality: string
          intro_message: string | null
          fallback_responses: string[]
          model: string
          temperature: number
          max_tokens: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          step_number: number
          name: string
          role: string
          system_prompt: string
          personality: string
          intro_message?: string | null
          fallback_responses?: string[]
          model?: string
          temperature?: number
          max_tokens?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          step_number?: number
          name?: string
          role?: string
          system_prompt?: string
          personality?: string
          intro_message?: string | null
          fallback_responses?: string[]
          model?: string
          temperature?: number
          max_tokens?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          project_id: string
          step_number: number
          role: 'user' | 'assistant'
          content: string
          metadata: Json
          timestamp: string
        }
        Insert: {
          id?: string
          project_id: string
          step_number: number
          role: 'user' | 'assistant'
          content: string
          metadata?: Json
          timestamp?: string
        }
        Update: {
          id?: string
          project_id?: string
          step_number?: number
          role?: 'user' | 'assistant'
          content?: string
          metadata?: Json
          timestamp?: string
        }
      }
      files: {
        Row: {
          id: string
          project_id: string
          step_number: number | null
          file_name: string
          file_url: string
          file_size: number | null
          mime_type: string | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          step_number?: number | null
          file_name: string
          file_url: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          step_number?: number | null
          file_name?: string
          file_url?: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
      }
      generated_outputs: {
        Row: {
          id: string
          project_id: string
          output_type: string
          content: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          output_type: string
          content: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          output_type?: string
          content?: string
          metadata?: Json
          created_at?: string
        }
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
  }
}
