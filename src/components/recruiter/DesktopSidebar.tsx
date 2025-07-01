
import { Separator } from "@/components/ui/separator";
import { SidebarLogo } from "./SidebarLogo";
import { NavigationItems } from "./NavigationItems";
import { UserProfileSection } from "./UserProfileSection";

export const DesktopSidebar = () => {
  return (
    <div className="hidden md:flex flex-col w-64 border-r border-r-dopamine-purple/10 bg-background shadow-md fixed h-full z-20">
      <SidebarLogo />
      <Separator className="bg-dopamine-purple/10" />
      <NavigationItems variant="desktop" />
      <UserProfileSection />
    </div>
  );
};
