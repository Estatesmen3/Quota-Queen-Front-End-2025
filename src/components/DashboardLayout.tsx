
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toaster } from "@/components/ui/toaster";
import { MobileHeader } from "./dashboard/MobileHeader";
import { Sidebar } from "./dashboard/Sidebar";
import { getRecruiterNavItems, getStudentNavItems } from "./dashboard/NavigationItems";

interface DashboardLayoutProps {
  children: ReactNode;
}

// Export both as named export and default export for backward compatibility
export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    // Close mobile sidebar when route changes
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const recruiterNavItems = getRecruiterNavItems();
  const studentNavItems = getStudentNavItems();
  const navItems = profile?.user_type === "recruiter" ? recruiterNavItems : studentNavItems;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader 
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar} 
        />
      )}

      {/* Sidebar */}
      {(isSidebarOpen || !isMobile) && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          closeSidebar={closeSidebar}
          isMobile={isMobile}
          navItems={navItems}
          companyName={profile?.company_name}
          handleSignOut={handleSignOut}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
}

// Add a default export that just re-exports the named export
export default DashboardLayout;
