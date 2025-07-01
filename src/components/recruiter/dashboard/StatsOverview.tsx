
import React from "react";
import PulseCard from "@/components/recruiter/PulseCard";
import { Users, Briefcase, FileCheck, Calendar } from "lucide-react";

const StatsOverview = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <PulseCard
        icon={<Users className="h-5 w-5 text-dopamine-purple" />}
        title="Talent Pool"
        value="1,247"
        subtitle="+23 new this week"
        trend={{ value: 4.2, isPositive: true }}
        gradient
      />
      
      <PulseCard
        icon={<Briefcase className="h-5 w-5 text-dopamine-pink" />}
        title="Active Jobs"
        value="8"
        subtitle="3 closing soon"
        trend={{ value: 2.8, isPositive: true }}
        gradient
      />
      
      <PulseCard
        icon={<FileCheck className="h-5 w-5 text-dopamine-orange" />}
        title="Applications"
        value="127"
        subtitle="42 need review"
        trend={{ value: 12.5, isPositive: true }}
        gradient
      />
      
      <PulseCard
        icon={<Calendar className="h-5 w-5 text-dopamine-blue" />}
        title="Interviews"
        value="12"
        subtitle="3 scheduled today"
        trend={{ value: 5.3, isPositive: true }}
        gradient
      />
    </div>
  );
};

export default StatsOverview;
