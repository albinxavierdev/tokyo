
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const PageContainer = ({ children, className, fullWidth = false }: PageContainerProps) => {
  return (
    <main className={cn(
      "flex-1 px-4 py-8 md:px-6 lg:px-8", 
      !fullWidth && "container max-w-6xl mx-auto",
      className
    )}>
      {children}
    </main>
  );
};

export default PageContainer;
