import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, Home, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="border-b border-border p-4 bg-background z-50">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🗼</span>
          <span className="font-bold text-lg">Tokyo</span>
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  
  const handleAuthAction = async () => {
    if (user) {
      try {
        // Sign out using auth context
        await signOut();
        
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });
        
        navigate('/');
      } catch (error: any) {
        console.error("Error signing out:", error);
        toast({
          title: "Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Handle login
      navigate('/login');
    }
  };

  // If user is authenticated and has a GitHub profile, show avatar dropdown
  if (user && user.app_metadata?.provider === 'github') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-full p-0 w-8 h-8">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={user.user_metadata?.avatar_url} 
                alt={user.user_metadata?.user_name || user.email || 'User'} 
              />
              <AvatarFallback>
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {user.user_metadata?.user_name || user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/calendar">Calendar</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleAuthAction}>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Regular auth button for non-GitHub users or when not logged in
  return (
    <Button 
      variant={user ? "outline" : "default"} 
      size="sm"
      className={cn(isMobile && "w-full justify-start")}
      onClick={handleAuthAction}
    >
      {user ? (
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
