import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { statusOptions, priorityOptions } from "@/lib/mock-data";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Github,
  Trash,
  Loader2,
  Pencil,
  Trash2,
  Plus,
  Globe,
} from "lucide-react";
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge";
import { ProjectPriorityBadge } from "@/components/projects/ProjectPriorityBadge";
import { TechBadge } from "@/components/projects/TechBadge";
import TasksList from "@/components/tasks/TasksList";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/components/ui/use-toast";
import { fetchProjectById, updateProject, deleteProject, createTask, updateTask, deleteTask } from "@/lib/api";
import { v4 as uuidv4 } from 'uuid';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // For tech stack input
  const [newTech, setNewTech] = useState("");

  // User ID handling
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [userId, setUserId] = useState<string>('');
  
  useEffect(() => {
    // Generate a valid UUID if one doesn't exist
    const validUserId = user.id && typeof user.id === 'string' && user.id.includes('-') 
      ? user.id 
      : uuidv4();
    
    // Store the UUID back in localStorage if we generated a new one
    if (!user.id || !user.id.includes('-')) {
      const updatedUser = {
        ...user,
        id: validUserId
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    setUserId(validUserId);
  }, [user]);

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const projectData = await fetchProjectById(id);
        
        if (!projectData) {
          console.error("Project not found");
          setProject(null);
          setLoading(false);
          return;
        }
        
        // Convert from Supabase format to our app format
        const formattedProject: Project = {
          id: projectData.id,
          title: projectData.title,
          description: projectData.description || "",
          status: projectData.status,
          priority: projectData.priority,
          techStack: projectData.tech_stack || [],
          githubUrl: projectData.github_url || "",
          deploymentUrl: projectData.deployment_url || "",
          tasks: Array.isArray(projectData.tasks) 
            ? projectData.tasks.map((task: any) => ({
                id: task.id,
                title: task.title,
                description: task.description || "",
                completed: task.completed || false,
                dueDate: task.due_date || null,
                createdAt: task.created_at
              })) 
            : [],
          createdAt: projectData.created_at,
          updatedAt: projectData.updated_at
        };
        
        setProject(formattedProject);
      } catch (error) {
        console.error("Error loading project:", error);
        toast({
          title: "Error loading project",
          description: "Could not load the project. Please try again later.",
          variant: "destructive",
        });
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, toast]);

  const handleDeleteProjectClick = async () => {
    if (!project) return;
    
    try {
      await deleteProject(project.id);
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error deleting project",
        description: "Could not delete the project. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <PageContainer className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p>Loading project...</p>
          </div>
        </PageContainer>
        <Footer />
      </div>
    );
  }

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
  const handleUpdateField = async (field: keyof Project, value: any) => {
    // Update local state immediately for responsive UI
    setProject({
      ...project,
      [field]: value,
      updatedAt: new Date().toISOString(),
    });
    
    // Save to Supabase
    setSaving(true);
    try {
      // Prepare data for Supabase format
      const updates: any = { 
        updated_at: new Date().toISOString() 
      };
      
      // Map the field name to Supabase column name
      switch (field) {
        case 'title':
        case 'description':
        case 'status':
        case 'priority':
          updates[field] = value;
          break;
        case 'techStack':
          updates.tech_stack = value;
          break;
        case 'githubUrl':
          updates.github_url = value;
          break;
        case 'deploymentUrl':
          updates.deployment_url = value;
          break;
        default:
          // Don't sync fields like 'tasks' directly
          break;
      }
      
      await updateProject(project.id, updates);
      
      toast({
        title: "Project updated",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Error saving changes",
        description: "Could not save your changes. Please try again later.",
        variant: "destructive",
      });
      
      // Optionally revert the local state change on error
    } finally {
      setSaving(false);
    }
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
  const handleAddTask = async (title: string) => {
    try {
      const newTaskData = await createTask(
        {
          title,
          completed: false
        },
        project.id
      );
      
      // Format the new task to match our app's format
      const newTask: Task = {
        id: newTaskData.id,
        title: newTaskData.title,
        description: newTaskData.description,
        completed: newTaskData.completed,
        dueDate: newTaskData.due_date,
        createdAt: newTaskData.created_at
      };
      
      // Update local state
      setProject({
        ...project,
        tasks: [...project.tasks, newTask],
        updatedAt: new Date().toISOString(),
      });
      
      toast({
        title: "Task added",
        description: "Your new task has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error adding task",
        description: "Could not add the task. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Toggle task completion
  const handleToggleTask = async (taskId: string, completed: boolean) => {
    // Update local state immediately for responsive UI
    const updatedTasks = project.tasks.map((task) =>
      task.id === taskId ? { ...task, completed } : task
    );
    
    setProject({
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    });
    
    // Save to Supabase
    try {
      await updateTask(taskId, { completed });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error updating task",
        description: "Could not update the task status. Please try again later.",
        variant: "destructive",
      });
      
      // Revert local state on error
      setProject({
        ...project,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId: string) => {
    // Update local state immediately for responsive UI
    const updatedTasks = project.tasks.filter((task) => task.id !== taskId);
    
    setProject({
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    });
    
    // Delete from Supabase
    try {
      await deleteTask(taskId);
      
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error deleting task",
        description: "Could not delete the task. Please try again later.",
        variant: "destructive",
      });
      
      // Revert local state on error
      setProject({
        ...project,
        updatedAt: new Date().toISOString(),
      });
    }
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash size={16} className="mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your project
                      and all associated tasks.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteProjectClick}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
                  <h4 className="text-sm font-medium mb-2">
                    <Github size={14} className="inline mr-1" />
                    GitHub Repository
                  </h4>
                  <Input
                    value={project.githubUrl || ""}
                    onChange={(e) => handleUpdateField("githubUrl", e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    <ExternalLink size={14} className="inline mr-1" />
                    Deployment URL
                  </h4>
                  <Input
                    value={project.deploymentUrl || ""}
                    onChange={(e) => handleUpdateField("deploymentUrl", e.target.value)}
                    placeholder="https://your-project.com"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Project Statistics</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Tasks</span>
                    <span className="font-medium">{project.tasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Completed Tasks</span>
                    <span className="font-medium">
                      {project.tasks.filter((task) => task.completed).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {project.tasks.length > 0
                        ? Math.round(
                            (project.tasks.filter((task) => task.completed).length /
                              project.tasks.length) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
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
