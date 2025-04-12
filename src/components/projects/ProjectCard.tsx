import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Project } from "@/lib/types";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { TechBadge } from "./TechBadge";
import { CalendarDays, CheckCircle, XCircle } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const completedTasks = project.tasks.filter(task => task.completed).length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <Link to={`/project/${project.id}`} className="block">
      <Card className="h-full overflow-hidden border border-border hover:border-accent/50 transition-colors duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <ProjectStatusBadge status={project.status} />
          </div>
          <h3 className="font-semibold text-lg line-clamp-1">{project.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 h-10">{project.description}</p>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex flex-wrap gap-1 mb-4">
            {project.techStack.slice(0, 3).map((tech, index) => (
              <TechBadge key={`${tech}-${index}`} tech={tech} />
            ))}
            {project.techStack.length > 3 && (
              <span className="text-xs text-muted-foreground">+{project.techStack.length - 3} more</span>
            )}
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-accent rounded-full h-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-1 text-xs text-muted-foreground flex justify-between">
          <div className="flex items-center">
            <CalendarDays size={14} className="mr-1" />
            <span>Updated {formatDate(project.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <CheckCircle size={14} className="mr-1 text-green-500" />
              <span>{completedTasks}</span>
            </div>
            <div className="flex items-center">
              <XCircle size={14} className="mr-1 text-red-500" />
              <span>{totalTasks - completedTasks}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
