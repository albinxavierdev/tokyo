import { Link } from "react-router-dom";
import { Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-6 px-4 bg-background">
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <span className="text-xl">🗼</span>
          <span className="font-semibold">Tokyo</span>
        </div>
        
        <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github size={18} />
          </a>
        </div>
        
        <div className="mt-4 md:mt-0 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tokyo
        </div>
      </div>
    </footer>
  );
};

export default Footer;
