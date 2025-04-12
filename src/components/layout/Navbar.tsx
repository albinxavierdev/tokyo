
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, Home, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="border-b border-border p-4 bg-background z-50">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🚀</span>
          <span className="font-bold text-lg">ProjectPilot</span>
        </Link>
        
        <div className="hidden md:flex space-x-1">
          <NavLink to="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />
          <NavLink to="/calendar" icon={<CalendarDays size={16} />} label="Calendar" />
          <div className="ml-2">
            <AuthButton />
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleMenu} 
          className="flex md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden pt-4 pb-2 animate-fade-in">
          <div className="flex flex-col space-y-2">
            <MobileNavLink to="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" onClick={toggleMenu} />
            <MobileNavLink to="/calendar" icon={<CalendarDays size={16} />} label="Calendar" onClick={toggleMenu} />
            <div className="pt-2">
              <AuthButton isMobile />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <Link to={to}>
    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
      {icon}
      <span>{label}</span>
    </Button>
  </Link>
);

const MobileNavLink = ({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick: () => void }) => (
  <Link to={to} onClick={onClick}>
    <Button variant="ghost" size="sm" className="w-full justify-start">
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  </Link>
);

const AuthButton = ({ isMobile = false }: { isMobile?: boolean }) => {
  // This is a placeholder for the authentication button
  // In a real app, this would check if the user is logged in
  const isLoggedIn = true;

  return (
    <Button 
      variant={isLoggedIn ? "outline" : "default"} 
      size="sm"
      className={cn(isMobile && "w-full justify-start")}
    >
      {isLoggedIn ? (
        <>
          <LogOut size={16} className={cn("mr-2", isMobile ? "" : "hidden lg:inline-block")} />
          <span>Sign Out</span>
        </>
      ) : (
        <span>Sign In</span>
      )}
    </Button>
  );
};

export default Navbar;
