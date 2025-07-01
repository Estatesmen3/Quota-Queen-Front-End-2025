
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileCheck, Calendar, Plus } from "lucide-react";
import { ProfileData } from "@/types/profiles";

interface DashboardHeaderProps {
  profile: ProfileData | null;
}

const DashboardHeader = ({ profile }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="highlight-gradient">Recruiter Dashboard</span>
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.first_name || "Recruiter"} 👋
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="glow-on-hover" asChild>
          <Link to="/recruiter/assessments">
            <FileCheck className="mr-2 h-4 w-4" />
            Create Assessment
          </Link>
        </Button>
        <Button variant="outline" className="glow-on-hover" asChild>
          <Link to="/recruiter/calendar">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Link>
        </Button>
        <Button className="glow-on-hover dopamine-gradient-1" asChild>
          <Link to="/recruiter/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            Post Job
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
