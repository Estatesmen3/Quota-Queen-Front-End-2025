
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { 
  LayoutDashboard, 
  Users, 
  Trophy,
  Briefcase,
  Settings,
  MessageSquare,
  BarChart,
  FileSpreadsheet,
  Calendar,
  Award
} from "lucide-react";

export type NavItem = {
  name: string;
  icon: React.FC<{ className?: string }>;
  path: string;
  highlight?: boolean;
};

export const getNavItems = (): NavItem[] => [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/recruiter/dashboard",
  },
  {
    name: "Talent Pool",
    icon: Users,
    path: "/recruiter/talent-pool",
    highlight: true,
  },
  {
    name: "Leaderboard",
    icon: Trophy,
    path: "/recruiter/leaderboard",
  },
  {
    name: "Job Postings",
    icon: Briefcase,
    path: "/recruiter/jobs",
  },
  {
    name: "Messages",
    icon: MessageSquare,
    path: "/recruiter/messages",
  },
  {
    name: "Analytics",
    icon: BarChart,
    path: "/recruiter/analytics",
  },
  {
    name: "Assessments",
    icon: FileSpreadsheet,
    path: "/recruiter/assessments",
  },
  {
    name: "Calendar",
    icon: Calendar,
    path: "/recruiter/calendar",
  },
  {
    name: "Sponsored Challenges",
    icon: Award,
    path: "/recruiter/sponsored-challenges",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/recruiter/settings",
  },
];

interface NavigationItemsProps {
  variant: "desktop" | "mobile";
}

export const NavigationItems = ({ variant }: NavigationItemsProps) => {
  const location = useLocation();
  const navItems = getNavItems();
  
  const isActive = (path: string) => {
    // Check if the current location starts with the given path
    // This ensures proper highlighting for nested routes
    return location.pathname.startsWith(path);
  };

  return (
    <div className={cn(
      "py-6 px-4 space-y-1.5 overflow-y-auto",
      variant === "desktop" ? "flex-1" : ""
    )}>
      {navItems.map((item, index) => (
        <Button
          key={item.name}
          variant={isActive(item.path) ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start transition-all duration-300 overflow-hidden relative",
            isActive(item.path) 
              ? "bg-gradient-to-r from-dopamine-purple/20 to-dopamine-pink/10 text-dopamine-purple font-medium"
              : "hover:bg-dopamine-purple/10 hover:text-dopamine-purple hover:translate-x-1",
            item.highlight && !isActive(item.path) && "border border-dopamine-purple/30"
          )}
          asChild
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Link to={item.path}>
            {isActive(item.path) && (
              <span className="absolute inset-0 bg-gradient-to-r from-dopamine-purple/10 to-transparent animate-pulse-subtle" />
            )}
            <item.icon className={cn(
              "mr-2 h-4 w-4",
              isActive(item.path) ? "text-dopamine-purple" : 
                item.highlight ? "text-dopamine-pink" : ""
            )} />
            {item.name}
            {item.highlight && !isActive(item.path) && (
              <Sparkles className="ml-auto h-3.5 w-3.5 text-dopamine-pink animate-pulse-subtle" />
            )}
          </Link>
        </Button>
      ))}
    </div>
  );
};
