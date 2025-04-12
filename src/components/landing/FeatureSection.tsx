import { Check, Layout, Calendar, Tag, Github, LucideIcon, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

const FeatureCard = ({ title, description, icon: Icon, className }: FeatureCardProps) => {
  return (
    <div className={cn(
      "flex flex-col p-6 bg-secondary rounded-lg border border-border",
      "hover:border-accent/50 transition-colors duration-300",
      className
    )}>
      <div className="p-2 w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center mb-4">
        <Icon className="text-accent" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export const FeatureSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Navigate your projects with Tokyo</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple tools for tracking your indie projects without the bloat of enterprise management software.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Project Dashboard"
            description="See all your projects at a glance with status updates and progress tracking."
            icon={Layout}
          />
          <FeatureCard
            title="Task Lists"
            description="Keep track of what needs to be done with simple task checklists for each project."
            icon={Check}
          />
          <FeatureCard
            title="Tech Stack Tagging"
            description="Tag projects with technologies used for easy filtering and organization."
            icon={Tag}
          />
          <FeatureCard
            title="Calendar View"
            description="Plan your work with a monthly calendar view for deadlines and milestones."
            icon={Calendar}
          />
          <FeatureCard
            title="GitHub Integration"
            description="Connect your projects to GitHub repositories for seamless tracking."
            icon={Github}
          />
          <FeatureCard
            title="Global Access"
            description="Works beautifully on desktop, tablet, and mobile devices from anywhere."
            icon={MapPin}
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
