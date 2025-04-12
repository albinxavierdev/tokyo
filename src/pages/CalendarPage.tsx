
import { useState } from "react";
import { mockProjects } from "@/lib/mock-data";
import { Task } from "@/lib/types";
import Navbar from "@/components/layout/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import CalendarView from "@/components/calendar/CalendarView";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/layout/Footer";

const CalendarPage = () => {
  const [selectedProject, setSelectedProject] = useState<string>("all");
  
  // Get all tasks with due dates from all projects
  const allTasks = mockProjects.flatMap(project => 
    project.tasks.filter(task => task.dueDate)
  );
  
  // Filter tasks based on selected project
  const filteredTasks: Task[] = selectedProject === "all"
    ? allTasks
    : mockProjects
        .find(p => p.id === selectedProject)?.tasks
        .filter(task => task.dueDate) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageContainer className="flex-1">
        <PageHeader 
          title="Calendar" 
          description="View and plan your tasks across projects."
        >
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {mockProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PageHeader>
        
        <div className="mt-6">
          <CalendarView tasks={filteredTasks} />
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
};

export default CalendarPage;
