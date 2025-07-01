
import { ReactNode, useEffect, useState } from "react";
import { DesktopSidebar } from "./recruiter/DesktopSidebar";
import { MobileNavigation } from "./recruiter/MobileNavigation";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface RecruiterLayoutProps {
  children: ReactNode;
}

const RecruiterLayout = ({ children }: RecruiterLayoutProps) => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in and is a recruiter
    if (!isLoading) {
      setIsCheckingAuth(false);
      
      if (!user) {
        // If not logged in, redirect to login
        navigate("/login");
        return;
      }
      
      // Ensure the user is a recruiter if they have a profile
      if (profile && profile.user_type !== 'recruiter') {
        navigate("/student/dashboard");
        return;
      }
    }
  }, [user, profile, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isCheckingAuth || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 md:pt-0 pt-16">
        {children}
      </div>
    </div>
  );
};

export default RecruiterLayout;
