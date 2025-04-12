
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectById, statusOptions, priorityOptions } from "@/lib/mock-data";
import { Project, Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Github,
  Trash,
} from "lucide-react";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { ProjectPriorityBadge } from "@/components/projects/ProjectPriorityBadge";
import { TechBadge } from "@/components/projects/TechBadge";
import TasksList from "@/components/tasks/TasksList";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const { toast } = useToast();

  // For tech stack input
  const [newTech, setNewTech] = useState("");

  // Load project data
  useEffect(() => {
    if (!id) return;
    
    const projectData = getProjectById(id);
    if (projectData) {
      setProject(projectData);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <PageContainer className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Project not found</h2>
            <Link to="/dashboard">
              <Button>
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </PageContainer>
        <Footer />
      </div>
    );
  }

  // Update project field handler
  const handleUpdateField = (field: keyof Project, value: any) => {
    setProject({
      ...project,
      [field]: value,
      updatedAt: new Date().toISOString(),
    });
    
    toast({
      title: "Project updated",
      description: "Your changes have been saved automatically.",
    });
  };

  // Add tech stack item
  const handleAddTech = () => {
    if (newTech && !project.techStack.includes(newTech)) {
      const updatedTechStack = [...project.techStack, newTech];
      handleUpdateField("techStack", updatedTechStack);
      setNewTech("");
    }
  };

  // Remove tech stack item
  const handleRemoveTech = (tech: string) => {
    const updatedTechStack = project.techStack.filter((t) => t !== tech);
    handleUpdateField("techStack", updatedTechStack);
  };

  // Add a new task
  const handleAddTask = (title: string) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    const updatedTasks = [...project.tasks, newTask];
    handleUpdateField("tasks", updatedTasks);
  };

  // Toggle task completion
  const handleToggleTask = (taskId: string, completed: boolean) => {
    const updatedTasks = project.tasks.map((task) =>
      task.id === taskId ? { ...task, completed } : task
    );
    handleUpdateField("tasks", updatedTasks);
  };

  // Delete a task
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = project.tasks.filter((task) => task.id !== taskId);
    handleUpdateField("tasks", updatedTasks);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageContainer className="flex-1">
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ProjectStatusBadge status={project.status} />
                <ProjectPriorityBadge priority={project.priority} />
                <div className="text-xs text-muted-foreground">
                  <CalendarDays size={14} className="inline mr-1" />
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
              <Input
                value={project.title}
                onChange={(e) => handleUpdateField("title", e.target.value)}
                className="text-2xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-foreground"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="destructive" size="sm">
                <Trash size={16} className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main project info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Description</h3>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={project.description}
                  onChange={(e) => handleUpdateField("description", e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="font-semibold">Tech Stack</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech, index) => (
                    <div key={`${tech}-${index}`} className="flex items-center">
                      <TechBadge tech={tech} />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-1 rounded-full"
                        onClick={() => handleRemoveTech(tech)}
                      >
                        <Trash size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add technology..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTech();
                    }}
                  />
                  <Button onClick={handleAddTech} disabled={!newTech.trim()}>
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <TasksList
              tasks={project.tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Project Status</h3>
              </CardHeader>
              <CardContent>
                <Select
                  value={project.status}
                  onValueChange={(value) => handleUpdateField("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Priority</h4>
                  <Select
                    value={project.priority}
                    onValueChange={(value) => handleUpdateField("priority", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Links</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    <Github size={16} className="inline mr-1" />
                    GitHub Repository
                  </label>
                  <Input
                    value={project.githubUrl || ""}
                    onChange={(e) => handleUpdateField("githubUrl", e.target.value)}
                    placeholder="https://github.com/user/repo"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    <ExternalLink size={16} className="inline mr-1" />
                    Deployment URL
                  </label>
                  <Input
                    value={project.deploymentUrl || ""}
                    onChange={(e) => handleUpdateField("deploymentUrl", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center text-sm text-accent hover:underline"
                  >
                    <Github size={16} className="mr-1" />
                    View on GitHub
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                )}
                
                {project.deploymentUrl && (
                  <a
                    href={project.deploymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center text-sm text-accent hover:underline"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    Visit Deployment
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
