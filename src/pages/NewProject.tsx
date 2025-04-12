import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { statusOptions, priorityOptions } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/components/ui/use-toast";
import { createProject } from "@/lib/api";
import { Link } from "react-router-dom";
import { ProjectPriority, ProjectStatus } from "@/lib/types";
import { v4 as uuidv4 } from 'uuid';

const NewProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // Ensure proper UUID format for user ID
  const [userId, setUserId] = useState<string>('');
  
  useEffect(() => {
    // Generate a valid UUID if one doesn't exist, instead of using simple string "1"
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
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("idea");
  const [priority, setPriority] = useState<ProjectPriority>("medium");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTech, setNewTech] = useState("");

  // Add tech stack item
  const handleAddTech = () => {
    if (newTech && !techStack.includes(newTech)) {
      setTechStack([...techStack, newTech]);
      setNewTech("");
    }
  };

  // Remove tech stack item
  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Project title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!userId) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to create a project",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the project data for submission
      const projectData = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        techStack: techStack.filter(tech => tech.trim() !== ''), // Filter out empty strings
      };
      
      const createdProject = await createProject(projectData, userId);
      
      if (!createdProject || !createdProject.id) {
        throw new Error("Failed to create project. No project data returned.");
      }
      
      toast({
        title: "Project created",
        description: "Your new project has been created successfully.",
      });
      
      // Navigate to the new project page
      navigate(`/project/${createdProject.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      
      // Provide a more specific error message if possible
      let errorMessage = "Could not create the project. Please try again later.";
      if (error instanceof Error) {
        errorMessage = error.message.includes("permission") 
          ? "You don't have permission to create projects." 
          : error.message || errorMessage;
      }
      
      toast({
        title: "Error creating project",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageContainer className="flex-1">
        <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>
              Fill in the details below to create a new project.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="title">
                  Project Title <span className="text-destructive">*</span>
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome Project"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="description">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of your project"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="status">
                    Status
                  </label>
                  <Select 
                    value={status} 
                    onValueChange={(value: ProjectStatus) => setStatus(value)}
                  >
                    <SelectTrigger id="status">
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
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="priority">
                    Priority
                  </label>
                  <Select 
                    value={priority} 
                    onValueChange={(value: ProjectPriority) => setPriority(value)}
                  >
                    <SelectTrigger id="priority">
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
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tech Stack</label>
                {techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {techStack.map((tech, index) => (
                      <div
                        key={`${tech}-${index}`}
                        className="flex items-center bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                        <button
                          type="button"
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveTech(tech)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add technology..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTech}
                    disabled={!newTech.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </PageContainer>
      <Footer />
    </div>
  );
};

export default NewProject; 