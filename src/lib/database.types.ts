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
          github_repo_owner: string | null;
          github_repo_name: string | null;
          github_webhook_id: number | null;
          github_sync_enabled: boolean | null;
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
          github_repo_owner?: string | null;
          github_repo_name?: string | null;
          github_webhook_id?: number | null;
          github_sync_enabled?: boolean | null;
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
          github_repo_owner?: string | null;
          github_repo_name?: string | null;
          github_webhook_id?: number | null;
          github_sync_enabled?: boolean | null;
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
          github_issue_url: string | null;
          github_issue_number: number | null;
          github_sync_enabled: boolean | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          completed?: boolean;
          due_date?: string | null;
          created_at?: string;
          project_id: string;
          github_issue_url?: string | null;
          github_issue_number?: number | null;
          github_sync_enabled?: boolean | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          completed?: boolean;
          due_date?: string | null;
          created_at?: string;
          project_id?: string;
          github_issue_url?: string | null;
          github_issue_number?: number | null;
          github_sync_enabled?: boolean | null;
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