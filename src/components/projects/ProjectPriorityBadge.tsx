
import { Badge } from "@/components/ui/badge";
import { ProjectPriority } from "@/lib/types";

interface ProjectPriorityBadgeProps {
  priority: ProjectPriority;
}

export const ProjectPriorityBadge = ({ priority }: ProjectPriorityBadgeProps) => {
  const getVariant = () => {
    switch (priority) {
      case "low":
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30";
      case "high":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30";
    }
  };

  const getLabel = () => {
    switch (priority) {
      case "low":
        return "Low";
      case "medium":
        return "Medium";
      case "high":
        return "High";
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

export default ProjectPriorityBadge;
