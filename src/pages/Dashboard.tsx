import { useState, useEffect } from "react";
import { statusOptions } from "@/lib/mock-data";
import { Project, ProjectStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, SearchIcon, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import ProjectGrid from "@/components/projects/ProjectGrid";
import Footer from "@/components/layout/Footer";
import { fetchProjects } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import GitHubIntegrationSection from "@/components/github/GitHubIntegrationSection";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get user ID from localStorage with proper UUID format
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // Generate a valid UUID if one doesn't exist, instead of using simple string "1"
  const userId = user.id && typeof user.id === 'string' && user.id.includes('-') 
    ? user.id 
    : uuidv4(); // Generate proper UUID

  // Store the UUID back in localStorage if we generated a new one
  useEffect(() => {
    if (!user.id || !user.id.includes('-')) {
      localStorage.setItem('user', JSON.stringify({
        ...user,
        id: userId
      }));
    }
  }, [userId, user]);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const projectsData = await fetchProjects(userId);
        
        if (!Array.isArray(projectsData)) {
          console.error("Invalid projects data format:", projectsData);
          setProjects([]);
          return;
        }
        
        // Convert Supabase data format to our application format
        const formattedProjects: Project[] = projectsData.map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description || "",
          status: project.status,
          priority: project.priority,
          techStack: project.tech_stack || [],
          githubUrl: project.github_url || "",
          deploymentUrl: project.deployment_url || "",
          tasks: Array.isArray(project.tasks) 
            ? project.tasks.map((task: any) => ({
                id: task.id,
                title: task.title,
                description: task.description || "",
                completed: task.completed || false,
                dueDate: task.due_date || null,
                createdAt: task.created_at
              }))
            : [],
          createdAt: project.created_at,
          updatedAt: project.updated_at
        }));
        
        setProjects(formattedProjects);
      } catch (error) {
        console.error("Error loading projects:", error);
        toast({
          title: "Error loading projects",
          description: "Could not load your projects. Please try again later.",
          variant: "destructive",
        });
        // Fallback to empty array
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [userId, toast]);

  // Filter projects by status and search query
  const filteredProjects = projects.filter(project => {
    const matchesStatus = activeTab === "all" || project.status === activeTab;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Count projects by status
  const getStatusCount = (status: ProjectStatus | "all") => {
    if (status === "all") return projects.length;
    return projects.filter(project => project.status === status).length;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageContainer className="flex-1">
        <PageHeader 
          title="Projects" 
          description="Manage your projects and keep track of their progress."
        >
          <Link to="/project/new">
            <Button>
              <PlusCircle size={16} className="mr-1" />
              New Project
            </Button>
          </Link>
        </PageHeader>
        
        <div className="mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-sm"
            />
          </div>
        </div>
        
        <div className="mb-8">
          <GitHubIntegrationSection />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="overflow-x-auto scrollbar-none">
            <TabsTrigger value="all">
              All ({getStatusCount("all")})
            </TabsTrigger>
            {statusOptions.map((status) => (
              <TabsTrigger key={status.value} value={status.value}>
                {status.label} ({getStatusCount(status.value)})
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2">Loading projects...</span>
              </div>
            ) : filteredProjects.length > 0 ? (
              <ProjectGrid projects={filteredProjects} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No projects found.</p>
                <p className="mt-2">
                  {activeTab !== "all" 
                    ? "Try selecting a different status or create a new project." 
                    : searchQuery 
                      ? "Try a different search term." 
                      : "Get started by creating your first project."}
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/project/new">
                    <PlusCircle size={16} className="mr-1" />
                    New Project
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PageContainer>
      <Footer />
    </div>
  );
};

export default Dashboard;
