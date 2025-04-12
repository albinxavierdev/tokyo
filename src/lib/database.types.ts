export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: 'idea' | 'planning' | 'in-progress' | 'launched' | 'archived';
          priority: 'low' | 'medium' | 'high';
          tech_stack: string[];
          github_url: string | null;
          deployment_url: string | null;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          status: 'idea' | 'planning' | 'in-progress' | 'launched' | 'archived';
          priority: 'low' | 'medium' | 'high';
          tech_stack: string[];
          github_url?: string | null;
          deployment_url?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: 'idea' | 'planning' | 'in-progress' | 'launched' | 'archived';
          priority?: 'low' | 'medium' | 'high';
          tech_stack?: string[];
          github_url?: string | null;
          deployment_url?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          completed: boolean;
          due_date: string | null;
          created_at: string;
          project_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          completed?: boolean;
          due_date?: string | null;
          created_at?: string;
          project_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          completed?: boolean;
          due_date?: string | null;
          created_at?: string;
          project_id?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}; 