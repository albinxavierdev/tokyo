
import { Badge } from "@/components/ui/badge";

interface TechBadgeProps {
  tech: string;
}

export const TechBadge = ({ tech }: TechBadgeProps) => {
  const getTechColor = () => {
    // Map popular technologies to colors
    const techColorMap: Record<string, string> = {
      "React": "bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30",
      "Next.js": "bg-slate-500/20 text-slate-500 hover:bg-slate-500/30",
      "Vue": "bg-green-500/20 text-green-500 hover:bg-green-500/30",
      "Angular": "bg-red-500/20 text-red-500 hover:bg-red-500/30",
      "Node.js": "bg-lime-500/20 text-lime-500 hover:bg-lime-500/30",
      "PostgreSQL": "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30",
      "MongoDB": "bg-green-500/20 text-green-500 hover:bg-green-500/30",
      "Firebase": "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30",
      "TypeScript": "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30",
      "JavaScript": "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30",
      "Python": "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30",
      "TailwindCSS": "bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30",
      "Stripe": "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30",
      "React Native": "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30",
      "TensorFlow": "bg-orange-500/20 text-orange-500 hover:bg-orange-500/30",
      "OpenWeatherMap API": "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30",
      "MDX": "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30",
    };

    return techColorMap[tech] || "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30";
  };

  return (
    <Badge variant="outline" className={`${getTechColor()} border-none`}>
      {tech}
    </Badge>
  );
};

export default TechBadge;
