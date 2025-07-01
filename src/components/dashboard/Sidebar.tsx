
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, LogOut } from "lucide-react";
import { SidebarLogo } from "../recruiter/SidebarLogo";
import { SidebarNavigation } from "./SidebarNavigation";
import { NavItem } from "./NavigationItems";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  isMobile: boolean;
  navItems: NavItem[];
  companyName?: string;
  handleSignOut: () => void;
}

export const Sidebar = ({
  isSidebarOpen,
  closeSidebar,
  isMobile,
  navItems,
  companyName,
  handleSignOut
}: SidebarProps) => {
  return (
    <div
      className={cn(
        "flex flex-col w-64 bg-white border-r transition-transform duration-300 transform",
        isMobile ? "fixed top-0 left-0 h-full z-50" : "relative",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <SidebarLogo />
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={closeSidebar}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>

      <Separator />

      <SidebarNavigation 
        navItems={navItems} 
        closeSidebar={closeSidebar} 
        isMobile={isMobile} 
      />

      <Separator />

      <div className="p-4">
        <Button variant="outline" className="w-full" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
