export type ProjectStatus = "idea" | "planning" | "in-progress" | "launched" | "archived";

export type ProjectPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  githubIssueUrl?: string;
  githubIssueNumber?: number;
  githubSyncEnabled?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  techStack: string[];
  githubUrl?: string;
  deploymentUrl?: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  githubRepoOwner?: string;
  githubRepoName?: string;
  githubWebhookId?: number;
  githubSyncEnabled?: boolean;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string; 
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string;
  default_branch: string;
  open_issues_count: number;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  permissions?: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  html_url: string;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  labels: Array<{
    name: string;
    color: string;
  }>;
  milestone?: {
    title: string;
    due_on: string | null;
  };
}
