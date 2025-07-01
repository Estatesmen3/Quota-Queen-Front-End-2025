
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { SidebarLogo } from "../recruiter/SidebarLogo";

interface MobileHeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const MobileHeader = ({ isSidebarOpen, toggleSidebar }: MobileHeaderProps) => {
  return (
    <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      <SidebarLogo />
      <div></div>
    </div>
  );
};
