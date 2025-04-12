export type ProjectStatus = "idea" | "planning" | "in-progress" | "launched" | "archived";

export type ProjectPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
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
}
