
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavItem } from "./NavigationItems";
import { cn } from "@/lib/utils";

interface SidebarNavigationProps {
  navItems: NavItem[];
  closeSidebar?: () => void;
  isMobile?: boolean;
}

export const SidebarNavigation = ({ 
  navItems, 
  closeSidebar, 
  isMobile 
}: SidebarNavigationProps) => {
  const location = useLocation();

  return (
    <nav className="flex-1 px-2 py-4">
      <div className="text-sm font-medium text-gray-600 px-2 mb-2">
        Navigation
      </div>
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              to={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-dopamine-purple/10 hover:text-dopamine-purple transition-colors",
                location.pathname === item.href
                  ? "bg-gradient-to-r from-dopamine-purple/20 to-dopamine-pink/10 text-dopamine-purple font-medium"
                  : "text-muted-foreground"
              )}
              onClick={isMobile ? closeSidebar : undefined}
            >
              <span className={location.pathname === item.href ? "text-dopamine-purple" : ""}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
