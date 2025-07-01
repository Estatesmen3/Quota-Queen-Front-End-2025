
import { Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const SidebarLogo = () => {
  const { profile } = useAuth();
  
  // Determine the correct dashboard path based on user type
  const dashboardPath = profile?.user_type === "recruiter" 
    ? "/recruiter/dashboard" 
    : "/student/dashboard";

  return (
    <Link to={dashboardPath} className="p-4 flex items-center gap-2">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-dopamine-purple to-dopamine-pink flex items-center justify-center shadow-md animate-pulse-subtle">
        <Crown className="text-white" size={20} />
      </div>
      <span className="font-semibold text-xl bg-gradient-to-r from-dopamine-purple to-dopamine-pink bg-clip-text text-transparent">
        Quota Queen
      </span>
    </Link>
  );
};
