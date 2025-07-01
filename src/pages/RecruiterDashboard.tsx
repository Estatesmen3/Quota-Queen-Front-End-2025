
import React from "react";
import RecruiterLayout from "@/components/RecruiterLayout";
import { useAuth } from "@/context/AuthContext";
import { useCallsData } from "@/hooks/useCallsData";
import DashboardHeader from "@/components/recruiter/dashboard/DashboardHeader";
import StatsOverview from "@/components/recruiter/dashboard/StatsOverview";
import UpcomingInterviews from "@/components/recruiter/dashboard/UpcomingInterviews";
import RecruitmentAnalytics from "@/components/recruiter/dashboard/RecruitmentAnalytics";
import TalentPoolsCard from "@/components/recruiter/dashboard/TalentPoolsCard";
import WeeklyTopCandidates from "@/components/recruiter/dashboard/WeeklyTopCandidates";
import { useToast } from "@/hooks/use-toast";

const RecruiterDashboard = () => {
  const { profile } = useAuth();
  const { upcomingCalls, isLoading, error } = useCallsData();
  const { toast } = useToast();
  
  // Show error toast if there was an error loading calls data
  React.useEffect(() => {
    if (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error loading data",
        description: "We're experiencing some technical difficulties. Some features may be unavailable.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  return (
    <RecruiterLayout>
      <div className="p-6 space-y-6">
        {/* Dashboard Header */}
        <DashboardHeader profile={profile} />

        {/* Stats Overview */}
        <StatsOverview />

        {/* Talent Pools, Top Candidates & Upcoming Interviews */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
          {/* Talent Pools */}
          <div className="lg:col-span-2">
            <TalentPoolsCard />
          </div>
          
          {/* Weekly Top Candidates */}
          <div className="lg:col-span-2">
            <WeeklyTopCandidates />
          </div>
          
          {/* Upcoming Interviews */}
          <div className="lg:col-span-1">
            <UpcomingInterviews 
              calls={upcomingCalls} 
              isLoading={isLoading} 
              error={error} 
            />
          </div>
        </div>

        {/* Analytics Preview */}
        <RecruitmentAnalytics />
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterDashboard;
