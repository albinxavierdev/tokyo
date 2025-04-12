
import { Project, ProjectPriority, ProjectStatus } from "./types";

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "A modern e-commerce platform with cart functionality and payment processing.",
    status: "in-progress",
    priority: "high",
    techStack: ["React", "Node.js", "PostgreSQL", "Stripe"],
    githubUrl: "https://github.com/user/ecommerce-platform",
    deploymentUrl: "https://ecommerce-platform.vercel.app",
    tasks: [
      {
        id: "t1",
        title: "Set up authentication",
        completed: true,
        createdAt: "2025-03-15T12:00:00Z"
      },
      {
        id: "t2",
        title: "Implement product listings",
        completed: true,
        createdAt: "2025-03-20T12:00:00Z"
      },
      {
        id: "t3",
        title: "Build shopping cart",
        completed: false,
        dueDate: "2025-04-25T12:00:00Z",
        createdAt: "2025-03-25T12:00:00Z"
      },
      {
        id: "t4",
        title: "Integrate payment gateway",
        completed: false,
        dueDate: "2025-04-30T12:00:00Z",
        createdAt: "2025-03-30T12:00:00Z"
      }
    ],
    createdAt: "2025-03-10T12:00:00Z",
    updatedAt: "2025-04-10T12:00:00Z"
  },
  {
    id: "2",
    title: "Task Management App",
    description: "A simple task management application with drag and drop functionality.",
    status: "launched",
    priority: "medium",
    techStack: ["React", "TypeScript", "Firebase"],
    githubUrl: "https://github.com/user/task-management",
    deploymentUrl: "https://task-app.vercel.app",
    tasks: [
      {
        id: "t5",
        title: "Design UI mockups",
        completed: true,
        createdAt: "2025-02-05T12:00:00Z"
      },
      {
        id: "t6",
        title: "Implement drag and drop",
        completed: true,
        createdAt: "2025-02-10T12:00:00Z"
      },
      {
        id: "t7",
        title: "Add filtering and sorting",
        completed: true,
        createdAt: "2025-02-15T12:00:00Z"
      }
    ],
    createdAt: "2025-02-01T12:00:00Z",
    updatedAt: "2025-03-01T12:00:00Z"
  },
  {
    id: "3",
    title: "Personal Blog",
    description: "A markdown-based personal blog with dark mode and code highlighting.",
    status: "idea",
    priority: "low",
    techStack: ["Next.js", "MDX", "TailwindCSS"],
    tasks: [
      {
        id: "t8",
        title: "Research blog frameworks",
        completed: false,
        createdAt: "2025-04-05T12:00:00Z"
      },
      {
        id: "t9",
        title: "Design homepage layout",
        completed: false,
        dueDate: "2025-04-20T12:00:00Z",
        createdAt: "2025-04-10T12:00:00Z"
      }
    ],
    createdAt: "2025-04-01T12:00:00Z",
    updatedAt: "2025-04-01T12:00:00Z"
  },
  {
    id: "4",
    title: "Weather App",
    description: "A weather app with location detection and 7-day forecast.",
    status: "planning",
    priority: "medium",
    techStack: ["React Native", "OpenWeatherMap API"],
    tasks: [
      {
        id: "t10",
        title: "Create app wireframes",
        completed: true,
        createdAt: "2025-03-18T12:00:00Z"
      },
      {
        id: "t11",
        title: "Research weather APIs",
        completed: true,
        createdAt: "2025-03-20T12:00:00Z"
      },
      {
        id: "t12",
        title: "Set up React Native project",
        completed: false,
        dueDate: "2025-04-15T12:00:00Z",
        createdAt: "2025-03-25T12:00:00Z"
      }
    ],
    createdAt: "2025-03-15T12:00:00Z",
    updatedAt: "2025-04-05T12:00:00Z"
  },
  {
    id: "5",
    title: "AI-Powered Coding Assistant",
    description: "An AI assistant that helps developers write better code faster.",
    status: "archived",
    priority: "high",
    techStack: ["Python", "TensorFlow", "React"],
    githubUrl: "https://github.com/user/ai-coding-assistant",
    tasks: [
      {
        id: "t13",
        title: "Research existing models",
        completed: true,
        createdAt: "2025-01-10T12:00:00Z"
      },
      {
        id: "t14",
        title: "Train initial prototype",
        completed: true,
        createdAt: "2025-01-20T12:00:00Z"
      },
      {
        id: "t15",
        title: "Build web interface",
        completed: true,
        createdAt: "2025-02-10T12:00:00Z"
      }
    ],
    createdAt: "2025-01-05T12:00:00Z",
    updatedAt: "2025-03-01T12:00:00Z"
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id);
};

export const getProjectsByStatus = (status?: ProjectStatus): Project[] => {
  if (!status) return mockProjects;
  return mockProjects.filter(project => project.status === status);
};

export const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "planning", label: "Planning" },
  { value: "in-progress", label: "In Progress" },
  { value: "launched", label: "Launched" },
  { value: "archived", label: "Archived" },
];

export const priorityOptions: { value: ProjectPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
