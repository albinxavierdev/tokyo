
import { Badge } from "@/components/ui/badge";
import { ProjectStatus } from "@/lib/types";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  const getVariant = () => {
    switch (status) {
      case "idea":
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30";
      case "planning":
        return "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30";
      case "in-progress":
        return "bg-orange-500/20 text-orange-500 hover:bg-orange-500/30";
      case "launched":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
      case "archived":
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30";
    }
  };

  const getLabel = () => {
    switch (status) {
      case "idea":
        return "Idea";
      case "planning":
        return "Planning";
      case "in-progress":
        return "In Progress";
      case "launched":
        return "Launched";
      case "archived":
        return "Archived";
      default:
        return "Unknown";
    }
  };

  return (
    <Badge variant="outline" className={`${getVariant()} border-none`}>
      {getLabel()}
    </Badge>
  );
};

export default ProjectStatusBadge;
