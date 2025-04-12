import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  // Check if user is already logged in
  const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
  
  return (
    <div className="flex flex-col items-center text-center py-16 md:py-24 px-4 animate-fade-in">
      <div className="text-5xl md:text-7xl mb-4">🗼</div>
      <h1 className="text-4xl md:text-5xl font-bold max-w-3xl tracking-tight mb-4">
        Elevate your projects with Tokyo
      </h1>
      <p className="text-xl text-muted-foreground max-w-xl mb-8">
        A minimal, beautiful project tracker for solo developers and indie hackers.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="px-8">
          <Link to={isLoggedIn ? "/dashboard" : "/login"}>
            {isLoggedIn ? "Go to Dashboard" : "Get Started"}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#features">Learn more</a>
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
