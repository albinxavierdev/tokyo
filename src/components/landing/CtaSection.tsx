import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CtaSection = () => {
  // Check if user is already logged in
  const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
  
  return (
    <section className="py-16 md:py-24 px-4 bg-accent/5 border-y border-border">
      <div className="container max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to ship your projects faster?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Start tracking your projects today and focus on what matters most — building great products.
        </p>
        <Button asChild size="lg" className="px-8">
          <Link to={isLoggedIn ? "/dashboard" : "/login"}>
            {isLoggedIn ? "Go to Dashboard" : "Get Started Now"}
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
