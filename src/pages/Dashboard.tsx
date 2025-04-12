
import { useState } from "react";
import { mockProjects, statusOptions } from "@/lib/mock-data";
import { Project, ProjectStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import ProjectGrid from "@/components/projects/ProjectGrid";
import Footer from "@/components/layout/Footer";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Filter projects by status and search query
  const filteredProjects = mockProjects.filter(project => {
    const matchesStatus = activeTab === "all" || project.status === activeTab;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Count projects by status
  const getStatusCount = (status: ProjectStatus | "all") => {
    if (status === "all") return mockProjects.length;
    return mockProjects.filter(project => project.status === status).length;
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
            <ProjectGrid projects={filteredProjects} />
          </TabsContent>
        </Tabs>
      </PageContainer>
      <Footer />
    </div>
  );
};

export default Dashboard;
